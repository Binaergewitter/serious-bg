require 'rubygems'
require 'bundler'
require 'bundler/setup'
require 'serious'
Serious.set :title, 'Binaergewitter'
Serious.set :author, 'Binaergewitter Team'
Serious.set :url, 'http://blog.binaergewitter.de'
Serious.set :disqus, 'binaergewitterpodcast'
#Serious.set :disqus, true

Serious.set :flattr, true
Serious.set :flattr_uid, 'binaergewitter'
Serious.set :flattr_category, 'audio'
Serious.set :flattr_tags, ['podcast','tech','software']
#5 minutes of caching. Will be purged by git push on heroku
Serious.set :cache_timeout, 600
Serious.set :items_in_feed, 20

run Serious
