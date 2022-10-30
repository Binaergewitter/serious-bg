require 'test/unit'
require "rack/test"
require 'serious'

class PostValidation < Test::Unit::TestCase
  def test_all_audio_urls_are_https
    Serious::Article.all().each do |article|
      article.audioformats.each_pair do |audio_type, audio_url|
        assert (audio_url.start_with? "https"), "#{article.path}: audio type #{audio_type} url was not https"
      end
    end
  end
end
