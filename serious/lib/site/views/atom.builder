xml.rss "xmlns:itunes" => "http://www.itunes.com/dtds/podcast-1.0.dtd",  "xmlns:media" => "http://search.yahoo.com/mrss/",  :version => "2.0" do
  xml.channel do
    xml.title Serious.title
    xml.link Serious.url
    # xml.description ''
    xml.language 'de'
    xml.pubDate @articles.first.date.strftime('%FT%TZ') unless @articles.empty?
    xml.lastBuildDate @articles.first.date.strftime('%FT%TZ') unless @articles.empty?    
    xml.author { xml.name Serious.author }

    
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
        xml.updated article.date.strftime('%FT%TZ')
        xml.itunes :author, Serious.author
        xml.itunes :summary, article.summary.formatted, "type" => "html"
        xml.content article.body.formatted, "type" => "html"
      end
    end
  end
end