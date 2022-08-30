require 'test/unit'
require "rack/test"
require 'webmock/test_unit'
require "net/http"
require 'typhoeus'

class SmokeTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def setup
    # chaptermarks for example
    stub_request(:get, /download.binaergewitter.de.*/).to_return(:status => 200, :body => "", :headers => {'Content-Length' => '123456'})

    # stub requests to meta data file
    json_data = File.open(File.join(File.dirname(__FILE__), "testdata/2021-11-10.Binaergewitter.Talk.286.json")).read
    stub_request(:get, /download.binaergewitter.de.*.json/).to_return(:status => 200, :body => json_data, :headers => {'Content-Length' => '123456'})
  end

  def app
    Rack::Builder.parse_file('config.ru').first
  end

  def test_homepage_is_a_200
    get "/"
    assert last_response.ok?
  end

  def test_categories_is_a_200
    ['all', 'talk', 'westcoast', 'spezial'].each do |category|
      get "/categories/#{category}"
      assert last_response.ok?
    end
  end

  def test_random_crap_fails
    get "/lol/catpoop.php"
    assert !last_response.ok?
  end

  def test_that_all_posts_on_the_archive_page_work
    get "/archives"
    last_response.body.scan(/a href=["'](\/2.*)["']>/).each do |match|
      get match[0] + "/"
      assert last_response.ok?
    end
  end

  def test_archive_categories_is_a_200
    ['all', 'talk', 'westcoast', 'spezial'].each do |category|
      get "/archives/categories/#{category}"
      assert last_response.ok?
    end
  end

  def test_that_all_episodes_can_be_downloaded
    WebMock.allow_net_connect!
    hydra = Typhoeus::Hydra.hydra
    requests = []
    Serious::Article.all.each do |post|
      post.audioformats.each do |format, link|
        req = Typhoeus::Request.new(link, {:method => :head, :followlocation => true})
        requests << req
        hydra.queue req
      end
    end
    hydra.run
    requests.each do |req|
      assert req.response.success?, "Audio file was not available: '#{req.url}'"
    end
    WebMock.disable_net_connect!
  end

  def test_the_podcast_is_live
    stub_request(:get, "http://stream.radiotux.de:8000/status.xsl")
	    .to_return(:status => 200, :body =>  "binaergewitter.mp3")
    assert_equal(true, Background.update_is_live)
  end

  def test_the_podcast_is_not_live
    stub_request(:head, "http://stream.radiotux.de:8000/binaergewitter.mp3")
      .to_return(:status => [404, "404 - The file you requested could not be found"])

    assert_equal(false, Background.update_is_live)
  end

  def test_the_server_timeout
    stub_request(:head, "http://stream.radiotux.de:8000/binaergewitter.mp3").to_timeout

    assert_equal(false, Background.update_is_live)
  end

  def test_broken_metadata_file
    stub_request(:get, /download.binaergewitter.de.*.json/).to_timeout

    assert_equal(nil, Background.get_metadata("http://download.binaergewitter.de/2021-11-10.Binaergewitter.Talk.286.json"))
  end
end
