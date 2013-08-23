require 'cgi'
xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd",  "xmlns:media" => "http://search.yahoo.com/mrss/",  :version => "2.0" do
  xml.channel do
    xml.title Serious.title
    xml.link Serious.url
    # xml.description ''
    xml.language 'de'
    xml.pubDate @articles.first.date.strftime('%FT%TZ') unless @articles.empty?
    xml.lastBuildDate @articles.first.date.strftime('%FT%TZ') unless @articles.empty?    
    xml.author { xml.name Serious.author }
    
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
    xml.tag!("itunes:summary", "")
    xml.tag!("itunes:author", Serious.author)
    xml.tag!("itunes:explicit", "no")
  
    xml.tag!("itunes:image", {"href" => "http://blog.binaergewitter.de/images/binaergewitter_logo.png"})
    xml.tag!("itunes:category", {"text" => "Technology"})
    xml.tag!("itunes:owner"){
      xml.tag!("itunes:name", "Binärgewitter Crew")
      xml.tag!("itunes:email", "info@binaergewitter.de")
    }
    

    @articles.each do |article|
      xml.item do
        xml.title article.title
        xml.pubDate article.date.strftime('%FT%TZ')
        xml.link "rel" => "alternate", "href" => article.full_url
        if @selected_audio_codec
          xml.enclosure "url" => article.audioformats[@selected_audio_codec], 'length' => "", 'type' => "audio/x-#{@selected_audio_codec}"
        end
        xml.id article.full_url
        
        if Serious.flattr
          flattr_link = 'https://flattr.com/submit/auto?url='
          flattr_link << CGI::escape(article.full_url)
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