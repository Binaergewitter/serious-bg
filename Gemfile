source 'https://rubygems.org'
ruby "2.0.0"
gem "rake"
gem "serious", :path => './serious'

group :test do
  gem 'rack-test'
  gem 'test-unit'
  gem 'feedvalidator', :require => 'feed_validator', :git => 'https://github.com/bandzoogle/feedvalidator.git'
end

group :production do
  gem 'thin'
end