# General

Oh hai!

[![Build Status](https://travis-ci.org/Binaergewitter/serious-bg.svg?branch=master)](https://travis-ci.org/Binaergewitter/serious-bg)


[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=binaergewitter&url=https://github.com/Binaergewitter/serious-bg&title=BinaergewitterSerious&language=de&tags=github&category=software)

# Markdown syntax
You can add a "release: 2" line to the article markdown in case you 
fudged up a release and would like to increment the GUID in the feed after a fix

You can add a "published: false" line to the article markdown to NOT have it
show up anywhere.

# Feeds
Feed with all items:

    /podcast_feed/all/m4a/rss.xml

Examples for the category feed generation:

    /podcast_feed/spezial/mp3/rss.xml
    /podcast_feed/talk/opus/rss.xml

iTunes feed that uses m4a with a fallback to mp3 if there is no m4a for that episode

    /podcast_feed/talk/itunes/rss.xml

Note: You can also add a feed_size parameter and a page parameter to the URL ("?feed_size=4&page=3")
