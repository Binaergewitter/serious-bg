---
layout: post
title: "Binärgewitter Talk #106: GeteBayTime"
date: 2014-10-10 12:00
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2014-10-09.Binaergewitter.Talk.106.mp3
  ogg: http://download.binaergewitter.de/2014-10-09.Binaergewitter.Talk.106.ogg
  m4a: http://download.binaergewitter.de/2014-10-09.Binaergewitter.Talk.106.m4a
  opus: http://download.binaergewitter.de/2014-10-09.Binaergewitter.Talk.106.opus
---
Mat und Felix treffen sich im Zwischenmodus um über Shellshock und Windows 10 zu quatschen.

## der l33tname
- [STICKER \o/]( http://l33tsource.com/blog/2014/10/09/Binaergewitter-Sticker/ )

## Toter der Woche
- [Podcasting, weil verklagt]( http://arstechnica.com/tech-policy/2014/09/jury-finds-cbs-infringes-podcasting-patent-awards-1-3-million/ ) via Daniel
- [Samsung notebooks]( http://www.heise.de/newsticker/meldung/Samsung-verkauft-in-Europa-keine-Notebooks-mehr-2402460.html )
- [Yahoo! Verzeichnisdienst]( http://www.heise.de/newsticker/meldung/Yahoo-kuendigt-Ende-seines-Verzeichnisdienstes-an-2404728.html )


## News

- [Matchstick, Chromecast mit FirefoxOS]( https://www.kickstarter.com/projects/matchstick/matchstick-the-streaming-stick-built-on-firefox-os )
- [Kirby 2]( http://getkirby.com/blog/kirby-2 )
- [Bash Command Injection](http://arstechnica.com/security/2014/09/bug-in-bash-shell-creates-big-security-hole-on-anything-with-nix-in-it/ )
 - [Grosse zusammenfassung von DWheeler]( http://www.dwheeler.com/essays/shellshock.html )
 - ueberall wo bash/zsh via remote gecalled wird (und env gesetzt werden kann durch den user)
  - PoC:
     - CGI: curl -i -k -X 'GET' -H 'Cookie: () { :;}; sleep 5' -H 'User-Agent: () { :;}; sleep 6' 'https://server.tld/'
     - lokal (auch nach aktuellstem patch): zzz='() {(zzz)zzz>\' bash -c 'fufuf date'    ; cat fufuf
     - Windows cmd.exe : https://twitter.com/FioraAeterna/status/517791046835920897
     - https://wiki.ubuntu.com/DashAsBinSh
     - [Schönes Icon]( fedoramagazine.org/wp-content/uploads/2014/09/shellshock.png )
     - [OpenVPN Vulnerable]( http://www.dwheeler.com/essays/shellshock.html )
     - [DHCP RCE]( https://www.trustedsec.com/september-2014/shellshock-dhcp-rce-proof-concept/ )

- [Slack Information Leakage]( http://webcache.googleusercontent.com/search?q=cache:7u-bEJPVOAkJ:www.tanay.co.in/blog/wanna-know-what-product-your-competitor-working-try-slack.html+&cd=1&hl=de&ct=clnk&gl=de&client=firefox-a )
    * [Slack Statement dazu]( http://slackhq.com/post/99505995605/slackandsignin )

- [BadUSB source code free to use]( https://github.com/adamcaudill/Psychson )
-[ReSSL]( http://www.heise.de/security/meldung/ReSSL-Der-naechste-Schritt-weg-von-OpenSSL-2408561.html )

- [Windows 10 ... oder so]
     * [Bill Gates erklaert Windows 910]( lh5.googleusercontent.com/-ULOXGAt9zJc/VC6ipZd0c9I/AAAAAAAADX0/HOQVBahYMFc/w460-h396-no/win9.jpg )
     * [Angeblicher Grund für Windows 10 statt Windows 9]( i.imgur.com/p7eQQK3.png )
     * [Searchcode Suche]( https://searchcode.com/?q=if%28version%2Cstartswith%28%22windows+9%22%29 )
     * [Why is software OS specific]( http://arstechnica.com/information-technology/2014/10/why-is-software-os-specific/ )

- [Potato Salad gekickststartet]( http://kotaku.com/the-potato-salad-kickstarter-festival-actually-happened-1640680938 )

- [GT Advanced pleite]( http://arstechnica.com/apple/2014/10/apples-sapphire-manufacturing-partner-files-for-bankruptcy/ )
    * [CEO hat noch kurz vorher Aktien vertickt]( http://arstechnica.com/apple/2014/10/sapphire-company-ceo-sold-160000-in-stock-days-before-iphone-6-reveal/ )
    
- [HP split]( http://arstechnica.com/information-technology/2014/10/the-hp-split-does-half-a-dinosaur-move-twice-as-fast/ )
- [Gopro jetzt mit 4K]( https://www.youtube.com/watch?v=wTcNtgA6gHs)
- [Github mag Studenten]( https://github.com/blog/1900-the-best-developer-tools-now-free-for-students )

## Themen

### Projektvorstellung AliOrders

- Aliexpress bietet keine 'echte' buyer API, Javascript Interface
- Crawling mit PhantomJS/CasperJS, Auswertung mit python
- Use Cases:
  1. Welche Orders sind noch auf dem Weg, schon zu lang Unterwegs
  2. Wie lang brauchen orders aus China jetzt wirklich
- Problem Feature-Creep: von Web- zu CLI, mutli-user zu local-only
- Jetzt auch fuer ebay!

## Lesefoo
- [Flying the worlds fastest plane]( http://www.sbnation.com/2014/3/7/5447310/sr-71-blackbird-pilot-interview )
- [Darpa 1.8 gigapixel drone]( http://www.theverge.com/2013/2/1/3940898/darpa-gigapixel-drone-surveillance-camera-revealed )

## Mimimi der Woche
- Apple Hotline

## Picks
- [If programming languages were weapons]( http://bjorn.tipling.com/if-programming-languages-were-weapons )
- [Honest Trailers - Transformers 4]( https://www.youtube.com/watch?v=Zz5vEfa7UvI)
  - [... und Godzilla]( https://www.youtube.com/watch?v=LOyVy7CTUJE&list=PL86F4D497FD3CACCE&index=3 )
- [Win 95 auf Android Wear]( http://arstechnica.com/gadgets/2014/10/make-your-smartwatch-even-less-useful-by-installing-windows-95/ ) 
