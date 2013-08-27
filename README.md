# General

Oh hai!


# Markdown syntax
You can add a "release: 2" line to the article markdown in case you 
fudged up a release and would like to increment the GUID in the feed after a fix

# Feeds
Feed with all items:

    /podcast_feed/all/m4a/rss.xml

Examples for the category feed generation:

    /podcast_feed/spezial/mp3/rss.xml
    /podcast_feed/talk/opus/rss.xml

iTunes feed that uses m4a with a fallback to mp3 if there is no m4a for that episode

    /podcast_feed/talk/itunes/rss.xml

Note: You can also add a feed_size parameter and a page parameter to the URL ("?feed_size=4&page=3")