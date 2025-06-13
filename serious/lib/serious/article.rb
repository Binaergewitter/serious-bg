# encoding: utf-8
#
# Backend for file-system based articles
#

require 'time'
require 'monitor'
require 'oj'

# A thread-safe, global metadata cache
class MetadataCache
  include MonitorMixin

  def initialize
    super()
    @cache = {}
  end

  def fetch(url)
    synchronize do
      return @cache[url] if @cache.key?(url)

      metadata = Background.get_metadata(url)
      if metadata
        metadata.delete_if { |key, _| key.to_s.match?(/(txt|json)/) }
        @cache[url] = metadata
      end
      metadata
    end
  end
end

$metadata_cache ||= MetadataCache.new


class Serious::Article
  # Exception for invalid filenames
  class InvalidFilename < StandardError
  end

  class << self
    #
    # Returns all articles. Can be drilled down by (optional) :limit and :offset options
    #
    def all(options={})
      options = {:limit => 10000, :offset => 0, :include_unpublished => false}.merge(options)
      options[:audioformat] = ['m4a', 'mp3'] if options[:audioformat] == 'itunes'
      now = DateTime.now
      articles = article_paths.map do |article_path|
        article = new(article_path)
        matches_published_status = options[:include_unpublished] ? true : article.published?

        if options[:category]
          matches_category = options[:category] == 'all' || Array(article.categories).include?(options[:category].to_s)
        else
          matches_category = true
        end

        if options[:audioformat]
          available_formats = article.audioformats.keys rescue []
          wanted_formats = Array(options[:audioformat])
          matches_audioformat = !(available_formats & wanted_formats).empty?
        else
          matches_audioformat = true
        end

        article if article && (Serious.future || article.date <= now) && matches_category && matches_audioformat && matches_published_status
      end.compact[options[:offset]...options[:limit]+options[:offset]]

      articles || []
    end

    #
    # Retrieves the article(s) for the given arguments. The arguments must be part of the filename.
    # You can give any combination, but the arguments must appear in the same order as given in the
    # arguments, so find(2009, 11) works for all articles in november 2009, 
    # find('foo-bar') works for all articles with permalink 'foo-bar', but find(2009, 'foo-bar')
    # will not return anything.
    #
    def find(*args)
      # Reformat arguments (one-digit months and days should be converted to two-digit format)
      args = args.map {|a| a.to_s =~ /^\d{1}$/ ? "%02d" % a : a }
      now = DateTime.now
      article_paths.select {|path| File.basename(path) =~ /#{args.join('-')}/i }.map do |path|
        article = new(path)
        article if article && (Serious.future || article.date <= now)
      end.compact
    end
    
    #
    # Find the article for given arguments (same as find), but returns only the first one
    #
    def first(*args)
      find(*args).first
    end
    
    private
      # Returns all article files in articles path
      def article_paths
        @article_paths ||= Dir[File.join(Serious.articles, '*')].sort.reverse
      end
  end
  
  attr_reader :path, :date, :permalink
  
  def initialize(path)
    @path = path
    extract_date_and_permalink!
    # TODO: Add some nice error handling!
  end
  
  # Lazy-loading title accessor
  def title
    @title ||= yaml["title"]
  end

  def extract_date
    datetime = DateTime.new()
    if yaml["date"].is_a?(String)
      datetime = Time.parse(yaml["date"])
    elsif yaml["date"].is_a?(Date)
      datetime = yaml["date"]
    end

    datetime
  end

  # Lazy-loading date_time accessor
  def date_time
    @date_time ||= extract_date()
  end

  # Lazy-loading release accessor
  def release
    @release ||= yaml["release"]
  end  

  # Lazy-loading audioformats accessor
  def audioformats
    @audio ||= yaml["audioformats"] || {}
  end

  def transcript
    @transcript ||= yaml["transcript"]
  end  

  def voices
    @voices ||= yaml["voices"] || {}
  end

  # Hash for each file format the matching file size
  def audio_file_sizes
    return @audio_file_sizes if defined?(@audio_file_sizes)

    @audio_file_sizes = {}
    if not podcast_metadata.nil?
      podcast_metadata["output_files"].each do |meta|
        @audio_file_sizes[meta["ending"]] = meta["size"]
      end
    else
      # fallback to 0 size
      audioformats.each do |format, url|
        @audio_file_sizes[format] = 0
      end
    end

    @audio_file_sizes
  end

  # Duration as string formated as used by itunes:duration
  def duration_timestring
    return @duration_timestring if defined?(@duration_timestring)

    if not podcast_metadata.nil?
      @duration_timestring = podcast_metadata["length_timestring"]
      # because feed duration does not support HH:MM:SS.000
      # https://validator.w3.org/feed/docs/error/InvalidDuration.html
      @duration_timestring = @duration_timestring.split(".")[0]
    else
      # fallback to 0 time
      @duration_timestring = "00:00:00"
    end

    @duration_timestring
  end

  # Download and cache the json meta data produced by auphonic
  # used for file size and length
  def podcast_metadata
    return @podcast_metadata if defined?(@podcast_metadata)

    format_, url = audioformats.first
    return nil unless url

    metadata_url = url.sub(".#{format_}", ".json")
    @podcast_metadata = $metadata_cache.fetch(metadata_url)

    @podcast_metadata
  end

  def chapters_url
    @chapters_url ||= yaml["chapters"]
  end

  def chapter
    return @chapter if defined?(@chapter)
    $chapter_chache ||= {}
    if $chapter_chache.key?(chapters_url)
      @chapter = $chapter_chache[chapters_url]
    else
      @chapter = Background.get_chapters(chapters_url)
      $chapter_chache[chapters_url] = @chapter
    end
    @chapter
  end

  def chapter_json
    return '[]' if chapter.empty?
    Oj.dump(chapter)
  end

  # Is the article published? by default it is
  def published?
    return @published if defined?(@published) && @published
    if yaml.key?('published')
      @published = !!yaml["published"]
    else
      @published = true
    end
  end

  # Lazy-loading categories accessor with fallback to empty array
  def categories
    @categories ||= yaml["categories"] || []
  end
  
  # Lazy-loading author accessor with fallback to Serious.author
  def author
    @author ||= yaml["author"] || Serious.author
  end
  
  # Cached lazy-loading of summary
  def summary
    return @summary if defined?(@summary) && @summary
    @summary ||= content.split("~~", 2).first.chomp
  end

  # Cached lazy-loading of the automatic summary
  # We'll just grab anything before the first markdown headline
  def automatic_summary
    return @automatic_summary if defined?(@automatic_summary) && @automatic_summary
    parsed = content.split('##')[0]
    if parsed.include?('#')
      parsed = parsed.split('#')[0]
    end
    if parsed.include?('*')
      parsed = parsed.split('*')[0]
    end
    parsed.gsub!("\n",' ')
    parsed.gsub!('"',"'")
    parsed.strip!
    @automatic_summary ||= parsed
  end
  
  # Cached lazy-loading of body
  def body
    return @body if defined?(@body) && @body
    @body ||= content.split("~~", 2).join("").chomp
  end
  
  # Compiles the url for this article
  def url
    @url ||= "/#{date.year}/#{"%02d" % date.month}/#{"%02d" % date.day}/#{permalink}"
  end
  
  # url combined with Serious.url
  def full_url
    @full_url ||= File.join(Serious.url, url)
  end
  
  # Equality comparison
  def ==(article)
    path == article.path
  rescue NoMethodError
    false
  end
  
  # Collection of validation errors
  def errors
    @errors || valid?
  end
  
  #
  # Loads the article and makes sure it can be loaded, formatted etc.. 
  # Error messages can be read through errors array
  #
  def valid?
    @errors = []
    errors << "No title given" unless title.kind_of?(String) and title.length > 0
    errors << "No author given" unless author.kind_of?(String) and author.length > 0
    
    begin
      summary.formatted  
    rescue
      errors << "Failed to format summary"
    end
    
    begin
      body.formatted
    rescue
      errors << "Failed to format body"
    end
  ensure
    return errors.length == 0
  end
  
  private
  
    # Will extract the date and permalink from the filename.
    def extract_date_and_permalink!
      match = File.basename(path).match(/(\d{4})-(\d{1,2})-(\d{1,2})-([^\.]+)/)
      @date = Date.new(match[1].to_i, match[2].to_i, match[3].to_i)
      @permalink = match[4]
    rescue NoMethodError
      raise InvalidFilename, "Failed to extract date or permalink from #{File.basename(path)}"
    end
    
    #
    # Will read the actual article file and store the yaml front processed in @yaml,
    # the content in @content
    #
    def load!
      return true if defined?(@yaml) && @yaml and @content
      begin
        # stolen from jekyll:
        # ---
        # yaml stuff
        # ---
        # markdown stuff
        if File.read(path) =~ /\A(---\s*\n.*?\n?)^(---\s*$\n?)(.*)/m
          @yaml = YAML.load($1, permitted_classes: [Date])
          @content = $3
        end        
      rescue StandardError => e
        raise "Failed parsing file: #{path.inspect}. Original message: '#{e.message}'"
      end      
    end
    
    # Cached lazy-loading yaml config
    def yaml
      return @yaml if defined?(@yaml) && @yaml
      load!
      @yaml 
    end
    
    # Cached lazy-loading content
    def content
      return @content if defined?(@content) && @content
      load!
      @content
    end
end
