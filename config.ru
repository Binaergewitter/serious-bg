require 'rubygems'
require 'bundler'
require 'bundler/setup'
require 'serious'
Serious.set :title, 'Binärgewitter'
Serious.set :author, 'Binärgewitter Team'
Serious.set :url, 'http://blog.binaergewitter.de'
Serious.set :description, 'Ein Podcast, der sich mit dem Web, Technologie und Open Source Software auseinander setzt.'
Serious.set :isso, true

Serious.set :flattr, true
Serious.set :flattr_uid, 'binaergewitter'
Serious.set :flattr_category, 'audio'
Serious.set :flattr_tags, ['podcast','tech','software']
# 6 hours of caching. Will be purged by git push on heroku. Clients might cache longer.
Serious.set :cache_timeout, 21600
Serious.set :items_in_feed, 20
Serious.set :date_format, "%d.%m.%Y"

run Serious
