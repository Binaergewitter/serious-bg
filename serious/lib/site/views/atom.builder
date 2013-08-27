require 'cgi'
require 'time'

description_text = "Ein Podcast, der sich mit dem Web, Technologie und Open Source Software auseinander setzt."


xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd", "xmlns:atom" => "http://www.w3.org/2005/Atom", "xmlns:media" => "http://search.yahoo.com/mrss/",  :version => "2.0" do
  xml.channel do
    xml.title Serious.title
    xml.link Serious.url
    xml.tag!("atom:link", :rel => 'self', :href => @current_url) if @current_url
    xml.tag!("atom:link", :rel => 'next', :href => @next_url) if @next_url
    xml.description description_text
    xml.language 'de'
    xml.pubDate @articles.first.date.rfc2822 unless @articles.empty?
    xml.lastBuildDate @articles.first.date.rfc2822 unless @articles.empty?    
    xml.itunes :author, Serious.author
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
      xml.tag!("atom:link", "rel" => 'payment', 'type' => 'text/html', 'href' => flattr_link)
    end
    xml.itunes :subtitle, "Web, Technologie und OpenSource Software"
    xml.itunes :summary, description_text
    xml.itunes :keywords, "technology, gadgets, web, opensource, krepel"
    xml.itunes :explicit, "no"
  
    xml.itunes :image, {"href" => "http://blog.binaergewitter.de/img/binaergewitter_logo.png"}
    xml.itunes :category, {"text" => "Technology"}
    xml.tag!("itunes:owner"){
      xml.tag!("itunes:name", "Binärgewitter Crew")
      xml.tag!("itunes:email", "info@binaergewitter.de")
    }
    

    @articles.each do |article|
      xml.item do
        xml.title article.title
        xml.pubDate article.date.rfc2822
        xml.itunes :author, Serious.author
        xml.itunes :summary, article.automatic_summary.formatted
        # In case we fudged the initial release, we can set the parameter in the article and
        # generate a new GUID which will trigger clients to redownload things
        if article.release
          xml.guid "#{article.full_url}-#{article.release}", 'isPermaLink'=> "false"
        else
          xml.guid article.full_url
        end
        xml.content article.body.formatted, "type" => "html"
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
          xml.enclosure "url" => url, 'length' => "0", 'type' => type
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
      end
    end
  end
end