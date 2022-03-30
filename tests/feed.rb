require 'test/unit'
require "rack/test"
require 'webmock/test_unit'
require 'feed_validator/assertions'

class FeedTest < Test::Unit::TestCase
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
 
  # TODO(FN): find a new way to check the feed
  # feedvalidator has stoped working reliable
  #def test_feed_validates
  #  get "/podcast_feed/all/itunes/rss.xml"
  #  WebMock.allow_net_connect!
  #  assert_valid_feed(last_response.body)
  #  WebMock.disable_net_connect!
  #end

  def test_mp3_feed_works
    get "/podcast_feed/all/mp3/rss.xml"
    assert last_response.ok?
  end

  def test_mp3_feed_works_with_feed_size
    [1,2,3,4,5].each do |number|
      get "/podcast_feed/all/mp3/rss.xml?feed_size=#{number}"
      assert last_response.ok?
      assert_equal number, last_response.body.scan('<item>').size
    end
  end

  def test_feed_without_feed_size
    get "/podcast_feed/all/mp3/rss.xml?&page=1"
    assert last_response.ok?
  end

  def test_mp3_feed_works_with_feed_size_and_page_size
    last_id_set = []
    [1,2,3,4,5].each do |number|
      get "/podcast_feed/all/mp3/rss.xml?feed_size=2&page=#{number}"
      assert last_response.ok?
      current_id_set = last_response.body.scan(/<id>\s*(.*)\s*<\/id>/i).flatten
      assert_empty current_id_set & last_id_set
      last_id_set = current_id_set
    end
  end

  def test_mp3_feed_has_a_next_link
    get "/podcast_feed/all/mp3/rss.xml?feed_size=2&page=2"
    assert last_response.ok?
    # There is a next link
    assert_include last_response.body, '/podcast_feed/all/mp3/rss.xml?feed_size=2&amp;page=3'
  end


  def test_talk_category_feed_works
    get "/podcast_feed/talk/m4a/rss.xml"
    assert last_response.ok?
  end

  def test_spezial_category_feed_works
    get "/podcast_feed/spezial/m4a/rss.xml"
    assert last_response.ok?
  end
end

