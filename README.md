# General

Oh hai!

[![CI](https://github.com/Binaergewitter/serious-bg/workflows/CI/badge.svg?branch=master)](https://github.com/Binaergewitter/serious-bg/actions/)
[![Support us on Patreon](http://ionicabizau.github.io/badges/patreon.svg)](https://www.patreon.com/Binaergewitter) 
[![Donate](https://img.shields.io/liberapay/patrons/Binaergewitter.svg?logo=liberapay)](https://liberapay.com/Binaergewitter)


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


# Stork search
Prerequisits: [install stork](https://stork-search.net/docs/install)

For every release the stork index has to be built like this:

```
python gen-stork.py > stork.toml
stork --build stork.toml
```

then a github action builds and publishes `bgt.st` to https://search.binaergewitter.de/bgt.st.

# Update comments after rename

If you rename a post you should migrate the old comments.
Since the id for comments is the post title: <https://github.com/Binaergewitter/serious-bg/blob/main/serious/lib/site/views/_isso.erb#L8>.

1. Get the `comments.db`
1. Create a backup
1. Look up the old id and new id in the `threads` table (i use `sqlitebrowser`)
1. Run the update command `UPDATE comments SET tid=$newid WHERE tid=$oldid;`
1. Save file!
1. Upload `comments.db` again


```
scp binaergewitter:/var/lib/isso/comments.db ~/Downloads/comments.db
cp ~/Downloads/comments.db ~/Downloads/comments_bak.db

sqlitebrowser

scp ~/Downloads/comments.db binaergewitter:/var/lib/isso/comments.db
```
