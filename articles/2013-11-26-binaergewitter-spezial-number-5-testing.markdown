---
layout: post
title: "Binärgewitter Spezial #5 - Testing"
date: 2013-11-26 13:00
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2013-11-21.Binaergewitter.Spezial.5.mp3
  ogg: http://download.binaergewitter.de/2013-11-21.Binaergewitter.Spezial.5.ogg
  m4a: http://download.binaergewitter.de/2013-11-21.Binaergewitter.Spezial.5.m4a
  opus: http://download.binaergewitter.de/2013-11-21.Binaergewitter.Spezial.5.opus
---
Felix, Marc, Mat, Pfleidi und Ingo haben sich zusammen gefunden um über das Testen von Software zu sprechen.

## Trotzdem den Toten der Woche

- [Winamp]( http://www.winamp.com/media-player/en )

## Sinn und Zweck

- Ausführbare Spezifikation
- Sicherheit beim [Refactoring]( http://en.wikipedia.org/wiki/Refactoring )
- Erleichterung beim Verschieben von Designentscheidungen
- "Ausprobieren" von Objektdesign
- Sample code wie Interfaces/Objekte/Binaries funktionieren sollten
- Schutz vor [Regressions]( http://en.wikipedia.org/wiki/Regression_testing ) (speziell mit CI)
- Performance Regressionen erkennen
- Schutz vor [Broken-Windows-Phänomen]( http://en.wikipedia.org/wiki/Broken_windows_theory )
- Nebeneffekt: Gut testbarer Code ist oft flexibler und besser wartbar

## Was testet man?

- [Unit Test]( http://en.wikipedia.org/wiki/Unit_test )
- [Integration Test]( http://en.wikipedia.org/wiki/Integration_testing )
- [Acceptance Test]( http://en.wikipedia.org/wiki/Acceptance_testing )
    * Web Testing (Browser Automation)
- Vulnerability Testing
    * Fuzz Testing - Spezielle Form von Vulnerability Testing/Quality Assurance
        - [Property based testing]( http://blog.jessitron.com/2013/04/property-based-testing-what-is-it.html )
        - Input validation: Paradedisziplin [SQL injection]( http://en.wikipedia.org/wiki/SQL_injection )
        - Stichwort: [Checked Exceptions]( http://en.wikipedia.org/wiki/Checked_exception#Checked_exceptions ) - z.B. in Java für Fälle, die häufig auftreten
    * [Penetration Test]( http://en.wikipedia.org/wiki/Penetration_testing )
        - [sqlmap]( http://sqlmap.org/ )
        - [Metasploit framework]( http://www.metasploit.com/ )
- Performance Testing
    *  [Tracer Bullet]( http://ninjasandrobots.com/rails-performance-help-tracer-bullets ) 
- [Load Testing]( http://en.wikipedia.org/wiki/Load_testing )
    * [Slowloris]( http://en.wikipedia.org/wiki/Slowloris )
- "PWN Testing" (Neu! TM!)
- (Code Metrics)
    * Komplexität
    * [Sandy Metz rules for developers]( http://robots.thoughtbot.com/sandi-metz-rules-for-developers )
    * [SOLID Principle]( http://en.wikipedia.org/wiki/SOLID_(object-oriented_design\) )
    * [Code-Coverage]( http://en.wikipedia.org/wiki/Code_coverage )
    * [Valgrind]( http://valgrind.org/ )

## Wie entwickelt man testgetrieben?

- [Test-driven development (TDD) (inside out)]( http://de.wikipedia.org/wiki/Testgetriebene_Entwicklung )
- [Behavior Driven Development (BDD) (outside in)]( http://de.wikipedia.org/wiki/Behavior_Driven_Development )
- [Feature Driven Development (FDD)](http://de.wikipedia.org/wiki/Feature_Driven_Development )

## Stubs/Mocks/Fixtures

- Stubs
- [Mocks]( http://en.wikipedia.org/wiki/Mock_object )
- [Fixtures]( http://en.wikipedia.org/wiki/Test_fixture )
- Data-Factories
    * [Factory Girl]( https://github.com/thoughtbot/factory_girl )
- [Mocks aren't stubs]( http://martinfowler.com/articles/mocksArentStubs.html )


## Java Frameworks

- [jUnit]( http://junit.org ), [TestNG]( http://testng.org )
- [Mockito]( https://code.google.com/p/mockito/ ), [Spock]( https://code.google.com/p/spock/ )
- [FIT]( http://fit.c2.com/ ) ist Testing-Porn für Manager

## Python Frameworks

- STDLIB to the rescue
    * [Unittest]( http://docs.python.org/2/library/unittest.html )
    * [Doctest]( http://docs.python.org/2/library/doctest.html )
        - [Doclet]( http://de.wikipedia.org/wiki/Doclet )
        - [Docblock]( http://www.stack.nl/~dimitri/doxygen/manual/docblocks.html )
        - [docopt]( https://github.com/docopt/docopt )
- [Python Testing Überblick]( https://wiki.python.org/moin/PythonTestingToolsTaxonomy )

## Ruby Frameworks:

- [Test-Unit]( http://www.ruby-doc.org/stdlib-1.8.7/libdoc/test/unit/rdoc/Test/Unit.html ) (aka: old stdlib)
- [Minitest]( https://github.com/seattlerb/minitest ) (aka: stdlib)
    * [WHY NO BEFORE?]( http://bfts.rubyforge.org/minitest/MiniTest/Unit.html#method-c-after_tests )
- [RSpec]( http://rspec.info/ )
    * [2]( https://www.relishapp.com/rspec )
    * [1]( http://old.rspec.info/ )
- [Mocha]( http://gofreerange.com/mocha/docs/ )
- [Cucumber]( http://cukes.info/ ) (Behavior Driven Testing)
- [HTTP Client testing]( http://robots.thoughtbot.com/how-to-stub-external-services-in-tests/ )
    * [VCR]( https://github.com/vcr/vcr )
    * [Faraday Mock Adapter]( https://github.com/lostisland/faraday )
    * [Webmock]( https://github.com/bblimke/webmock )
    * [Fakeweb]( https://github.com/chrisk/fakeweb )
-  [File System: FakeFS]( https://github.com/defunkt/fakefs )
- [Zeit: Timecop]( https://github.com/travisjeffery/timecop )

## JS Frameworks

- [Vows]( http://vowsjs.org/ )
- [Jasmine]( http://pivotal.github.io/jasmine/ )
- [Mocha]( http://visionmedia.github.io/mocha/ )
- [QUnit]( http://qunitjs.com/ )

## PHP

- [PHPUnit]( http://phpunit.de/manual/current/en/index.html )
- [Simpletest]( http://www.simpletest.org/ )
- [Behat]( http://behat.org/ )

## Unsere Projekte

- [Podding]( https://github.com/Podding/Podding )
- [Mlk]( https://github.com/pfleidi/mlk )
- [serious-bg]( https://github.com/Binaergewitter/serious-bg )
- [painload (test suite)]( https://github.com/krebscode/painload/blob/master/util/Makefile )
- [viddl-rb]( https://github.com/rb2k/viddl-rb )


## Infrastruktur

- Testing macht erst mit CI richtig Sinn / CI macht erst mit Testing richtig Sinn
    * [Jenkins CI]( http://jenkins-ci.org )
    * Travis CI [Free]( http://travis-ci.org ) [Kommerz]( http://travis-ci.com/ )
    * [Atlassian Bamboo]( https://www.atlassian.com/software/bamboo )
- [Coveralls]( https://coveralls.io/ )
- [Code Climate]( https://codeclimate.com/ )
- Xcode Bots, Mac OS X Server
- [Vim Syntax Checker: syntastic]( https://github.com/scrooloose/syntastic )
- [pep8](http://www.python.org/dev/peps/pep-0008/), [pylint](http://www.pylint.org/)
- [JSLint]( http://www.jslint.com/ )
- [faker]( https://github.com/joke2k/faker )
    * Auch: [faker]( https://github.com/stympy/faker )
    * Auch: [Data::Faker]( http://search.cpan.org/~jasonk/Data-Faker-0.07/lib/Data/Faker.pm )

## Vorträge

- [Therapeutic Refactoring]( http://www.confreaks.com/videos/1071-cascadiaruby2012-therapeutic-refactoring )
- [Boundaries]( http://confreaks.com/videos/1314-rubyconf2012-boundaries )

## Bücher zum Thema

- [Test Driven Development]( http://amzn.to/1cHruyZ )
- [Extreme Programming]( http://amzn.to/1fl5I9h )
- [Practical Object Oriented Design in Ruby]( http://www.poodr.com/ )

