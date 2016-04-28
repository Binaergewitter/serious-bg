require 'cgi'
require 'time'

xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.rss "xmlns:atom" => "http://www.w3.org/2005/Atom", "xmlns:content" => "http://purl.org/rss/1.0/modules/content/", "xmlns:media" => "http://search.yahoo.com/mrss/",  :version => "2.0" do
  xml.channel do
    xml.title Serious.title
    xml.link Serious.url
    xml.tag!("atom:link", :rel => 'self', :href => @current_url) if defined?(@current_url) && @current_url
    xml.tag!("atom:link", :rel => 'next', :href => @next_url) if defined?(@next_url) && @next_url
    xml.description Serious.description
    xml.language 'de'
    xml.pubDate @articles.first.date.rfc2822 unless @articles.empty?
    xml.lastBuildDate @articles.first.date.rfc2822 unless @articles.empty?
    xml.copyright "Creative Commons BY-SA 3.0 DE"

    @articles.each do |article|
      xml.item do
        xml.title article.title
        xml.pubDate article.date.rfc2822
        xml.author Serious.author
        xml.summary article.automatic_summary
        # In case we fudged the initial release, we can set the parameter
        # in the article and generate a new GUID which will trigger clients
        # to redownload things
        if article.release
          xml.guid "#{article.full_url}-#{article.release}", 'isPermaLink'=> "false"
        else
          xml.guid article.full_url
        end
        xml.link article.full_url
        #article.body.formatted
        xml.tag!("content:encoded", article.automatic_summary)
        if @selected_audio_codec
          if @selected_audio_codec.to_s.downcase == 'itunes'
            selected_codec = (['m4a', 'mp3'] & article.audioformats.keys).first
          else
            selected_codec = @selected_audio_codec
          end
          url = article.audioformats[selected_codec]
          type = "audio/x-#{selected_codec}"
          #According to the RSS Advisory Board's Best Practices Profile,
          #when an enclosure's size cannot be determined, a publisher should use a length of 0.
          xml.figure do
            xml.img "src" => 'http://blog.binaergewitter.de/img/binaergewitter_logo.png'
            xml.audio "url" => url, 'length' => "0", 'type' => type, 'title' => article.title
          end
        end
      end
    end
  end
end
