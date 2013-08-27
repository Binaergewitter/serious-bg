require 'cgi'
require 'time'

xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd",  "xmlns:media" => "http://search.yahoo.com/mrss/",  :version => "2.0" do
  xml.channel do
    xml.title Serious.title
    xml.link Serious.url
    xml.link(:rel => 'self', :href => @current_url) if @current_url
    xml.link(:rel => 'next', :href => @next_url) if @next_url
    # xml.description ''
    xml.language 'de'
    xml.pubDate @articles.first.date.rfc2822 unless @articles.empty?
    xml.lastBuildDate @articles.first.date.strftime('%FT%TZ') unless @articles.empty?    
    xml.author { xml.name Serious.author }
    xml.copyright "Creative Commons BY-NC-SA 3.0 DE"
    
    if Serious.flattr
      flattr_link = 'https://flattr.com/submit/auto?url='
      flattr_link << CGI::escape(Serious.url)
      flattr_link << '&'
      flattr_link << "user_id=#{CGI::escape(Serious.flattr_uid)}"
      flattr_link << "&"
      flattr_link << "title=#{CGI::escape(Serious.title)}"
      flattr_link << "&"
      flattr_link << "category=audio"
      flattr_link << "&"
      flattr_link << "tags=#{CGI::escape(Serious.flattr_tags.join(','))}"
      xml.link "rel" => 'payment', 'type' => 'text/html', 'href' => flattr_link
    end
    xml.tag!("itunes:subtitle", "Web, Technologie und OpenSource Software")
    xml.tag!("itunes:summary", "Ein Podcast, der sich mit dem Web, Technologie und Open Source Software auseinander setzt.")
    xml.tag!("itunes:keywords", "technology, gadgets, web, opensource, krepel")
    xml.tag!("itunes:author", Serious.author)
    xml.tag!("itunes:explicit", "no")
  
    xml.tag!("itunes:image", {"href" => "http://blog.binaergewitter.de/img/binaergewitter_logo.png"})
    xml.tag!("itunes:category", {"text" => "Technology"})
    xml.tag!("itunes:owner"){
      xml.tag!("itunes:name", "Binärgewitter Crew")
      xml.tag!("itunes:email", "info@binaergewitter.de")
    }
    

    @articles.each do |article|
      xml.item do
        xml.title article.title
        xml.pubDate article.date.rfc2822
        xml.link "rel" => "alternate", "href" => article.full_url
        if @selected_audio_codec
          if @selected_audio_codec.to_s.downcase == 'itunes'
            selected_codec = (['m4a', 'mp3'] & article.audioformats.keys).first
          else
            selected_codec = @selected_audio_codec
          end
          url = article.audioformats[selected_codec]
          type = "audio/x-#{selected_codec}"
          xml.enclosure "url" => url, 'length' => "", 'type' => type
        end
        # In case we fudged the initial release, we can set the parameter in the article and
        # generate a new GUID which will trigger clients to redownload things
        if article.release
          xml.guid "#{article.full_url}-#{article.release}", 'isPermaLink'=> "false"
        else
          xml.guid article.full_url
        end
        
        if Serious.flattr
          flattr_link = 'https://flattr.com/submit/auto?url='
          # Nasty hack to support our "old" flattr items. Stupid /blog/ ...
          flattr_link << CGI::escape("#{Serious.url}/blog#{article.url}/")
          flattr_link << '&'
          flattr_link << "user_id=#{CGI::escape(Serious.flattr_uid)}"
          flattr_link << "&"
          flattr_link << "title=#{CGI::escape(article.title)}"
          flattr_link << "&"
          flattr_link << "category=audio"
          flattr_link << "&"
          flattr_link << "tags=#{CGI::escape(Serious.flattr_tags.join(','))}"
          xml.link "rel" => 'payment', 'type' => 'text/html', 'href' => flattr_link
        end
        
        xml.updated article.date.strftime('%FT%TZ')
        xml.itunes :author, Serious.author
        xml.itunes :summary, article.automatic_summary.formatted, "type" => "html"
        xml.content article.body.formatted, "type" => "html"
      end
    end
  end
end