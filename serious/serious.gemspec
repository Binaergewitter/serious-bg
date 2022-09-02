# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "serious/version"

Gem::Specification.new do |s|
  s.name        = "serious"
  s.version     = SERIOUS_VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Christoph Olszowka"]
  s.email       = ["christoph at olszowka de"]
  s.homepage    = "https://github.com/colszowka/serious"
  s.summary     = %Q{Serious is a simple, file-driven blog engine inspired by toto and driven by sinatra with an emphasis on easy setup}
  s.description = %Q{Serious is a simple, file-driven blog engine inspired by toto and driven by sinatra with an emphasis on easy setup}

  s.bindir = 'bin'
  s.executables = ['serious']

  s.add_dependency 'sinatra', ">= 1.0.0"
  s.add_dependency 'stupider_formatter', '>= 0.3.0'
  s.add_dependency 'builder', ">= 2.1.2"
  s.add_dependency 'excon', '>= 0.49.0'

  s.add_development_dependency "shoulda", "~> 2.10.3"
  s.add_development_dependency "hpricot", ">= 0.8.0"
  s.add_development_dependency "rack-test", ">= 0.5.0"
  s.add_development_dependency "rake", ">= 0.8.7"
  s.add_development_dependency "rdoc"
  s.add_development_dependency 'simplecov'

  s.files         = Dir['**/*'].keep_if { |file| File.file?(file) }
  s.test_files    = Dir['test/**/*']
  s.executables   = []
  s.require_paths = ["lib"]
end
