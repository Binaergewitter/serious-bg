require 'test/unit'
require "rack/test"

OUTER_APP = Rack::Builder.parse_file('config.ru').first

class SmokeTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  def test_homepage_is_a_200
    get "/"
    assert last_response.ok?
  end

  def test_mp3_feed_works
    get "/podcast_feed/all/mp3/atom.xml"
    assert last_response.ok?
  end

  def test_mp3_feed_works_with_feed_size
    get "/podcast_feed/all/mp3/atom.xml?feed_size=2"
    assert last_response.ok?
    assert_equal 2, last_response.body.scan('<item>').size
  end

  def test_mp3_feed_works_with_feed_size_and_page_size
    get "/podcast_feed/all/mp3/atom.xml?feed_size=2&page=2"
    assert last_response.ok?
    assert_equal 2, last_response.body.scan('<item>').size
  end
  
  def test_mp3_feed_has_a_next_link
    get "/podcast_feed/all/mp3/atom.xml?feed_size=2&page=2"
    assert last_response.ok?
    # There is a next link
    assert_include last_response.body, '/podcast_feed/all/mp3/atom.xml?feed_size=2&amp;page=3'
  end
  

  def test_talk_category_feed_works
    get "/podcast_feed/talk/m4a/atom.xml"
    assert last_response.ok?
  end

  def test_spezial_category_feed_works
    get "/podcast_feed/spezial/m4a/atom.xml"
    assert last_response.ok?
  end

  def test_random_crap_fails
    get "/lol/catpoop.php"
    assert !last_response.ok?
  end

  def test_that_all_posts_work
    get "/archives"
    last_response.body.scan(/a href="(.*)"/).each do |match|
      get match[0]
      assert last_response.ok?
    end
  end

end