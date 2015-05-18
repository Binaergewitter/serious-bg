---
layout: post
title: "Binärgewitter Spezial #6: Programmiersprachen 2015"
date: 2015-04-30 21:00
comments: true
categories: spezial
sharing: true
release: 2
audioformats:
  mp3: http://download.binaergewitter.de/2015-04-28.Binaergewitter.Spezial.6.mp3
  ogg: http://download.binaergewitter.de/2015-04-28.Binaergewitter.Spezial.6.ogg
  m4a: http://download.binaergewitter.de/2015-04-28.Binaergewitter.Spezial.6.m4a
  opus: http://download.binaergewitter.de/2015-04-28.Binaergewitter.Spezial.6.opus
---
Felix lernt Lua und Pfleidi schaut sich dieses Jahr mal Elixir angeschaut. Beide berichten über ihre Erfahrungen und warum man sich vielleicht dieses mal Sprache mal anschauen sollte.

## Origin Stories

- Was war unsere erste Programmiersprache?
    * pfleidi: [MSL]( http://en.wikipedia.org/wiki/MIRC_scripting_language )
    * Danach: C, Perl, Java
        - [Mirc](https://de.wikipedia.org/wiki/MIRC )
    * Felix: Counter-Strike Console Scripting, Autohotkey
      - Java, C, Python
    * Ingo: Pascal, Object Pascal
        - [NIKI](https://de.wikipedia.org/wiki/Niki_%E2%80%93_der_Roboter )

### Lua

- imperativ/prozedural sowie funktional oder auch objektorientiert (mittels metatables)
- für Embedded Systeme sowie zum Einbetten in Software-Projekte dank kleinem Interpreter (120k)
- MIT Lizenz
- leichtes [einbinden von C/C++](http://www.lua.org/pil/26.html ) , vgl. [Python C Extension]( https://docs.python.org/3/extending/extending.html )
- first class Functions
- [Indices starten bei 1](http://www.luafaq.org/#T1.5.1 )
- 87% weniger klammern als mit vergleichbaren Programmiersprachen!
- [Cypthon]( http://cython.org/ )
- [Maglev Ruby VM]( http://maglev.github.io/ )
- [Rubinus]( http://rubini.us/ )
- [Supercoder 2000](  http://www.blogcdn.com/de.engadget.com/media/2010/08/supercoder-2000-keyboardbbb.jpg )
- [Z++]( http://en.wikipedia.org/wiki/Z++ )
- [Why Local]( http://lua-users.org/wiki/LocalByDefault )

### Lua Projekte/Frameworks/Libraries

- [Luarocks Package Manager]( https://rocks.moonscript.org/ )
  * [Rockspec]( https://github.com/Tieske/binaryheap.lua/blob/master/rockspec/binaryheap-0.2-1.rockspec )
- [Prosoy]( https://prosody.im/ )
- [Schnelle VM]( http://luajit.org/ )
- [Luvit]( https://luvit.io/ )
- [NodeMCU]( http://nodemcu.com/index_en.html )
- [LuaJIT.IO]( http://luajit.io/ )
- [moonscript](http://moonscript.org/ )
- [Lapis web framework]( http://leafo.net/lapis/ )

### Lua Ressourcen

- [Lua in 15 minutes]( http://tylerneylon.com/a/learn-lua/ )
- [luafaq]( http://www.luafaq.org/ )
- [Programmieren mit Lua](http://www.amazon.de/Programmieren-Lua-Roberto-Ierusalimschy/dp/3955390209 )
- [Programming Lua](http://www.amazon.de/Programming-Lua-Ierusalimschy-Roberto-Paperback/dp/B00MXDVRLS )

### Lua auf dem MicroController

- [Esp8266]( http://s.click.aliexpress.com/klk/qbYburNBE )
  * mit nur 2 nutzbaren IO Pings
  * 3.3 Volt (keine 5!), braucht also Step-Down + Serielle Konsole
  * [ESP8266 ESP-12]( http://s.click.aliexpress.com/klk/AmQ3v3Nne ) mit mehr PINs, 
  * evtl gleich mit [Adapter Plate]( http://www.aliexpress.com/item/10pcs-lot-ESP8266-serial-WIFI-module-connecting-plate-applicable-to-ESP-07-the-ESP-08-ESP/32262406988.html )
- [nodemcu Devboard (all-in-one)]( http://s.click.aliexpress.com/klk/BIA62N7Yr ), USB anschliessen und los!
- [The Button]( http://benlo.com/esp8266/esp8266Projects.html )

## Elixir

### Allgemeines zu Elixir

- Funktional, dynamisch/stark typisiert, concurrent, _nicht_ objektorientiert
- Kein Veränderbarer State in Datenstrukturen
- [Prozesse]( http://elixir-lang.org/getting-started/processes.html )
- Läuft auf Erlang VM (BEAM = Bogdan/Björn's Erlang Abstract Machine)
- [Apache 2.0 Lizenz]( https://github.com/elixir-lang/elixir/blob/master/LICENSE )
- Einsatzzweck: Distributed Systems, Webapplikationen, Datenbanken, ...
- Hot Code Reloading
- [Kein Assignment sondern Match Operator]( http://elixir-lang.org/getting-started/pattern-matching.html )
- [Pipe Operator]( http://elixir-lang.org/getting-started/enumerables-and-streams.html )
- [Meta Programming]( http://elixir-lang.org/getting-started/meta/quote-and-unquote.html )
- [Sigils]( http://elixir-lang.org/getting-started/sigils.html )
- Integriertes Dokumentationsssytem
- [Erlang: The Movie 2]( https://www.youtube.com/watch?v=rRbY3TMUcgQ )

### Elixir Projekte/Frameworks/Libraries

- [Hex Paketmanager]( https://hex.pm/ )
- [Phoenix framework]( https://github.com/phoenixframework/phoenix )
- [Ecto]( https://github.com/elixir-lang/ecto )
- [Postgrex]( http://github.com/ericmj/postgrex )
- [Mariaex]( http://github.com/xerions/mariaex )
- [Plug]( https://github.com/elixir-lang/plug )

### Elixir Ressourcen 

- [Elixir Website]( http://elixir-lang.org/ )
- [Elixir auf Github]( https://github.com/elixir-lang )
- [Awesome Elixir]( https://github.com/h4cc/awesome-elixir )
- [Elixir Style Guide]( https://github.com/niftyn8/elixir_style_guide )
- [Getting started guide]( http://elixir-lang.org/getting-started/introduction.html )
- [Programming Elixir]( https://pragprog.com/book/elixir/programming-elixir )
- [Actor Model/Processes]( http://elixir-lang.org/getting-started/processes.html )
- [Macros]( http://elixir-lang.org/getting-started/meta/macros.html )
- [Erlang]( http://www.erlang.org/ )
- [OTP]( http://www.erlang.org/doc/ )
- [Elixir and Go concurrency models]( http://blog.plataformatec.com.br/2014/10/playing-with-elixir-and-go-concurrency-models/ )
- [Erlang/Elixir Syntax]( http://elixir-lang.org/crash-course.html )
- [Introduction to Elixir]( http://www.youtube.com/watch?v=a-off4Vznjs )
- [Programming in Elixir with the Phoenix framework]( http://gogogarrett.sexy/programming-in-elixir-with-the-phoenix-framework-building-a-basic-CRUD-app/ )
- [Rise of the phoenix]( http://www.youtube.com/watch?v=3jMbzGv_6tA )
- [Elixir isn't hipster]( http://blog.alexrp.com/2013/02/14/elixir-isnt-hipster/ )
- [Blogpost zu Lernmaterial]( http://blog.jordan-dimov.com/round-up-of-elixir-books-and-resources/ )
- [Weiterer Blogpost]( http://www.creativedeletion.com/2015/04/19/elixir_next_language.html )
- [Mix / OTP Guide]( http://elixir-lang.org/getting-started/mix-otp/introduction-to-mix.html )
- [Mostly Erlang Podcast]( http://mostlyerlang.com/ )
- [Ruby Rogues zu Elixir]( http://devchat.tv/ruby-rogues/114-rr-elixir-with-jose-valim )

