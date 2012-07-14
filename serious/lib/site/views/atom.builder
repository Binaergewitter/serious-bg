xml.instruct! :xml, :version=>"1.0", :encoding=>"UTF-8"
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
  xml.title Serious.title
  xml.id Serious.url
  xml.updated @articles.first.date.to_s unless @articles.empty?
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
    xml.entry do
      xml.title article.title
      xml.link "rel" => "alternate", "href" => article.full_url
      if @selected_audio_codec
        xml.enclosure "url" => article.audioformats[@selected_audio_codec], 'length' => "", 'type' => "audio/x-#{@selected_audio_codec}"
      end
      xml.id article.full_url
      xml.published article.date.to_s
      xml.updated article.date.to_s
      xml.author { xml.name article.author }
      xml.summary article.summary.formatted, "type" => "html"
      xml.content article.body.formatted, "type" => "html"
    end
  end
end