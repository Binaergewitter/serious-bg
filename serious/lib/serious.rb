# encoding: utf-8

require 'rubygems'
require 'bundler'
Bundler.setup(:default)
require 'sinatra/base'
require 'stupid_formatter'
require 'yaml'
require 'builder'
require 'ruby_ext'
require 'net/http'
require 'httpx'
require 'oj'
Oj.mimic_JSON()
require 'uri'

puts "CUSTOM"

class Background

  def self.update_is_live
    res = HTTPX.get("http://stream.radiotux.de:8000/status.xsl", timeout: { read_timeout: 10, connect_timeout: 10 })
    res.status == 200 && res.to_s.include?("binaergewitter.mp3")
  rescue HTTPX::TimeoutError, HTTPX::ConnectionError
    false
  end

  def self.get_chapters(url)
    return [] if url.nil?

    chapters = []
    begin
      response = HTTPX.get(url, timeout: { connect_timeout: 10, read_timeout: 10 })
      if response.status == 200
        response.to_s.force_encoding("UTF-8").each_line do |line|
          time, title = line.split(" ", 2)
          chapters << { start: time, title: title.strip } if time && title
        end
      end
    rescue HTTPX::Error => e
      puts "Error fetching chapters from #{url}: #{e.message}"
    end

    chapters
  end
  

  def self.get_metadata(url)
    return nil if url.nil? || url.strip.empty?

    begin
      res = HTTPX.get(url, timeout: { connect_timeout: 10, read_timeout: 10 })

      if res.status == 200
        JSON.parse(res.to_s.force_encoding("UTF-8"))
      else
        puts "Failed to fetch metadata. HTTP Status: #{res.status}"
        nil
      end
    rescue HTTPX::RequestError => e
      puts "Invalid or failed request to #{url}: #{e.message}"
    rescue JSON::ParserError => e
      puts "Failed to parse JSON from #{url}: #{e.message}"
    rescue StandardError => e
      puts "Unexpected error fetching metadata from #{url}: #{e.message}"
    end
  end
end

class Serious < Sinatra::Base

  # worker thread to update stream status
  $stream_response = false

  set :articles, Proc.new { File.join(Dir.getwd, 'articles') }
  set :pages, Proc.new { File.join(Dir.getwd, 'pages') }
  set :static, true # Required to serve static files, see http://www.sinatrarb.com/configuration.html
  set :static_cache_control, [:public, :max_age => 21600]
  set :future, true
  set :stream_response_time, Time.now - 140 # setting a time where a cache update is needed

  not_found do
    erb :"404"
  end

  before do
    headers['Cache-Control'] = "public, max-age=#{Serious.cache_timeout}"
  end

  helpers do
    # Helper for rendering partial _archives
    def render_archived(articles)
      render :erb, :'_archives', :locals => { :articles => articles }, :layout => false
    end

    def render_nav(articles)
      render :erb, :'_navigation', :locals => { :articles => articles }, :layout => false
    end

    def render_controls(article)
      render :erb, :"_podcast_controls", :locals => { :article => article }, :layout => false
    end

    def render_isso(title)
      render :erb, :"_isso", :locals => { :title => title }, :layout => false
    end

    def render_article(article, summary_only=false)
      render :erb, :'_article', :locals => { :article => article, :summary_only => summary_only }, :layout => !summary_only
    end

    def render_partial(name)
      render :erb, :"_#{name}", :layout => false
    end

    def catetory_tite(category)
      if category.nil? || category == 'all'
        return Serious.title
      end

      "#{Serious.title} #{category.capitalize}"
    end

    def category_url(category)
      if category.nil? || category == 'all'
        return Serious.url
      end

      "#{Serious.url}/categories/#{category.downcase}"
    end

    def catetory_archive_path(category)
      if category.nil? || category == 'all'
        return "#{Serious.url}/archives"
      end

      "/archives/categories/#{category.downcase}"
    end

    def is_live?
      if Time.now - settings.stream_response_time > 120
        settings.stream_response_time = Time.now
        Thread.new do
          $stream_response = Background.update_is_live
        end
      end
      $stream_response
    end
  end

  # Index page
  get '/' do
    @recent = Article.all(:limit => Serious.items_on_index)
    @archived = Article.all(:limit => Serious.archived_on_index, :offset => Serious.items_on_index)
    erb :index
  end

  get "/categories/:category" do
    @category = params['category']

    @recent = Article.all(
      :category => @category,
      :limit => Serious.items_on_index
    )

    @archived = Article.all(
      :category => @category,
      :limit => Serious.archived_on_index,
      :offset => Serious.items_on_index
    )

    erb :index
  end

  ["/atom.xml", "/rss.xml"].each do |route|
    get route do
      feed_size = (params.delete('feed_size') || Serious.items_in_feed).to_i
      @page = (params.delete('page') || 0).to_i
      @articles = Article.all(
      :limit => feed_size,
      :offset => @page * feed_size
      )

      @current_url = request.url
      # If our current page is filled, ther is probably a next one too
      # If it isn't, we'll serve an empty page... for now
      if @articles.size == feed_size
        parsed_uri = URI(request.url)
        parsed_uri.query = parsed_uri.query.to_s.gsub(/[?&]page=\d+/,'')
        parsed_uri.query += "&page=#{@page + 1}"
        @next_url = parsed_uri.to_s
      end

      builder :rss
    end
  end


  # /podcast_feed/talk/mp3/rss.xml
  ['/podcast_feed/*/*/atom.xml', '/podcast_feed/*/*/rss.xml'].each do |feed_url|
    get feed_url do
      feed_size = (params.delete('feed_size') || Serious.items_in_feed).to_i
      @page = (params.delete('page') || 0).to_i
      @category, audio_format = params[:splat]
      @articles = Article.all(
        :audioformat => audio_format,
        :category => @category,
        :limit => feed_size,
        :offset => @page * feed_size
      )
      @selected_audio_codec = audio_format

      @current_url = request.url
      # If our current page is filled, there is probably a next one too
      # If it isn't, we'll serve an empty page... for now
      if @articles.size == feed_size
        parsed_uri = URI(request.url)
        parsed_uri.query = parsed_uri.query.to_s.gsub(/[?&]page=\d+/,'')
        parsed_uri.query += "&page=#{@page + 1}"
        @next_url = parsed_uri.to_s
      end

      builder :rss
    end
  end

  ['/facebook_feed/*/*/atom.xml', '/facebook_feed/*/*/rss.xml'].each do |feed_url|
    get feed_url do
      feed_size = (params.delete('feed_size') || Serious.items_in_feed).to_i
      @page = (params.delete('page') || 0).to_i
      category, audio_format = params[:splat]
      @articles = Article.all(
        :audioformat => audio_format,
        :category => category,
        :limit => feed_size,
        :offset => @page * feed_size
      )
      @selected_audio_codec = audio_format

      @current_url = request.url
      # If our current page is filled, there is probably a next one too
      # If it isn't, we'll serve an empty page... for now
      if @articles.size == feed_size
        parsed_uri = URI(request.url)
        parsed_uri.query = parsed_uri.query.to_s.gsub(/[?&]page=\d+/,'')
        parsed_uri.query += "&page=#{@page + 1}"
        @next_url = parsed_uri.to_s
      end

      builder :rss_facebook_articles
    end
  end

  # Specific article route
  get %r{/(\d{4})/(\d{1,2})/(\d{1,2})/([^\/]+)/?} do
    halt 404 unless @article = Article.first(*params[:captures])
    # redirect to the url without / because isso needs
    # it to map it to the comment thread
    # enforce https on non localhost
    if request.path_info[-1] == "/"
        info = request.path_info.chomp('/')
        add_s = 's' unless %w(localhost 127.0.0.1).include? request.host

        redirect "http#{add_s}://#{request.host_with_port}#{info}", 302
    end

    render_article @article
  end

  # Archives route
  # is this even used?
  get %r{/(\d{4})[/]{0,1}(\d{0,2})[/]{0,1}(\d{0,2})[/]{0,1}} do
    selection = params[:captures].reject {|s| s.strip.length == 0 }.map {|n| n.length == 1 ? "%02d" % n : n}
    @articles = Article.find(*selection)
    @title = "Archives for #{selection.join("-")}"
    erb :archives
  end

  get "/archives" do
    @articles = Article.all
    @title = "Archives"
    erb :archives
  end

  get "/archives/categories/:category" do
    category = params['category']
    @articles = Article.all(:category => category)
    @title = "Archives #{category.capitalize}"

    erb :archives
  end

  get "/pages" do
    @articles = Page.all
    @title = "Pages"
    erb :archives
  end

  # Add permanent redirects for all old /blog/ sites.
  get "/blog/*" do
    redirect "/#{params[:splat][0]}", 301
  end

  # Add permanent redirect for old images
  # Some old podcatchers seem to still request those
  get "/images/*" do
    redirect "/img/#{params[:splat][0]}", 301
  end


  get "/pages/:page" do
    halt 404 unless @article = Page.find(params[:page])
    render_article @article
  end
end

require 'serious/version'
require 'serious/article'
require 'serious/page'
require 'serious/commonmarker_formater'
# Set up default stupid_formatter chain
StupidFormatter.chain = [StupidFormatter::Erb, StupidFormatter::CommonMarker]

# Set up defaults for app
Serious.set :root, File.join(File.dirname(__FILE__), 'site')
Serious.set :title, "Serious"
Serious.set :author, "unknown"
Serious.set :url, 'http://localhost:3000'
Serious.set :items_in_feed, 25 # Number of items to display in atom feed
Serious.set :items_on_index, 3 # Number of items to display with summary on main page
Serious.set :archived_on_index, 10 # Number of items to display small (title only) on main page
Serious.set :cache_timeout, 300
Serious.set :run, false
Serious.set :environment, :test
Serious.set :date_format, "%B %o %Y"
Serious.set :disqus, false
Serious.set :google_analytics, false
Serious.set :feed_url, '/rss.xml'
