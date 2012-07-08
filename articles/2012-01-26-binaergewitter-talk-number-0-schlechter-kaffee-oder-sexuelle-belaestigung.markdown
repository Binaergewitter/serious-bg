---
layout: post
title: "Binärgewitter Talk #0 - schlechter Kaffee oder sexuelle Belästigung"
date: 2012-01-26 10:15
comments: true
sharing: true
categories: talk
audioformats:
  mp3: http://download.binaergewitter.de/2012-01-25.Binaergewitter.Talk.0.mp3
  ogg: http://download.binaergewitter.de/2012-01-25.Binaergewitter.Talk.0.ogg
---
## Einführung

- Wer sind wir eigentlich und was machen wir hier?
    * [Team Seite]( http://blog.binaergewitter.de/das-team/ )

## Unsere Infrastruktur

- Wie hosten wir unsere Sachen nun?
- Was für Software setzen wir dafür ein?
    * [Liquid]( https://github.com/shopify/liquid )
    * [Jekyll]( http://jekyllrb.com/ )
    * [Octopress]( http://octopress.org/ )
    * Ruby, Bundler, Rake, Piwik, audio.js ...
- Wie können die Hörer mitmachen?
- [Auf Github]( https://github.com/binaergewitter )
    * [Commits]( https://github.com/Binaergewitter/binaergewitter.github.com/commits/source )
    * [Issue Tracker](  https://github.com/Binaergewitter/binaergewitter.github.com/issues?sort=created&direction=desc&state=open )
 - Intro
 
## Toter der Woche
 - [Arfa Karim Randhawa verstorben mit 16](http://digitallife.today.msnbc.msn.com/_news/2012/01/14/10158059-programming-prodigy-passes-away-at-16-hear-her-philosophy-of-life )

## In der Zwischenzeit
* Weihnachten ;)
* 28c3
   - [Vortrag: Building a Distributed Satellite Ground Station Network]( http://www.youtube.com/watch?v=qeyTZ8naunk ) 
* CES
* Megaupload ist tot
 - [Dezura Client unter GPL]( http://www.pro-linux.de/news/1/17946/desura-client-im-quellcode-freigegeben.html )
 - [P2P Traffic explodiert zufaelliger weise am 19.Januar[fr]](http://www.numerama.com/magazine/21393-le-p2p-explose-apres-la-fermeture-de-megaupload.html )
* ACTA/SOPA/PiPA
    - You heard it here first! Sendung im letzten Jahr
    - Facepalm [CDU will (mal wieder) Netzsperren]( http://www.golem.de/1201/89320.html )
    - [Herpderpedia Twitter Account]( https://twitter.com/#!/herpderpedia )

## News

- [HP gibt WebOS als OpenSource frei]( http://gigaom.com/mobile/webos-lives-hp-decides-to-open-source-the-platform/ )
    * Gibt es den Sourcecode nun?
    * Unter welcher Lizenz ist der Code freigegeben?
    * [Es gibt einen leeren Github Account]( https://github.com/hpwebos )
    * [Microsoft Manager übernimmt WebOS]( http://www.golem.de/1201/89140.html )
    * [HPWebOS Releaseplan](http://www.theverge.com/2012/1/25/2732672/open-webos-10-announced )
- [SPDY für Apache]( http://www.golem.de/1112/88613.html )
- [SPDY für Rack]( https://github.com/jonasschneider/momentum )
- [Google will TCP beschleunigen]( http://www.golem.de/1201/89268.html )
- [DoS Angriff mittels Hash Kollisonen]( http://www.ocert.org/advisories/ocert-2011-003.html )
    * [Vortrag vom 28c3]( http://events.ccc.de/congress/2011/Fahrplan/events/4680.en.html )
- [C&C original gibt es nun in HTML5]( http://www.adityaravishankar.com/projects/games/command-and-conquer/ )
- [MegaSearch.cc - Die Kreditkartennummern Suchmaschine](http://krebsonsecurity.com/2012/01/megasearch-aims-to-index-fraud-site-wares/ )
- [The AWS Storage Gateway](http://www.allthingsdistributed.com/2012/01/The-AWS-Storage-Gateway.html )

## Themen

### Marc's neuer HTPC/HomeServer
  
- [Flirc](http://flirc.tv/ ) (marc)
- [AMD E-450 Mainboard: Asus-E45M1-M](https://www.amazon.de/dp/B005O43SI8/ ) (marc)
- [LC-Power 1300MI Gehäuse Mini-ITX/M-ATX 75W](https://www.amazon.de/dp/B002A2U8KI/) (marc)
- PCI Interrupt probleme unter Last ( irq 1[69]: nobody cared ) (felix)
- [Wii Balance Board ist im Guiness Buch der Rekorde]( http://www.t3.com.au/2012/01/13/wii-balance-board-enters-guinness-book-of-records/ )

## Mimimi der Woche
- Siehe AMD-E45M1-M (felix)
- iptables macht komische Sachen
  * iptables -t nat -A PREROUTING -p tcp --dport 30009 -j DNAT --to $IP:30009
  * iptables -A POSTROUTING -t nat -j MASQUERADE
 
## Lesefoo

- [The magic of consistent hashing]( http://www.paperplanes.de/2011/12/9/the-magic-of-consistent-hashing.html ) (pfleidi)
- [Wat](https://www.destroyallsoftware.com/talks/wat ) (Felix, pfleidi, Marc)
    * [Wat meme]( http://knowyourmeme.com/memes/wat )
- [Star Trek - Deep Space Nine 8.01: Offenbarung](http://www.amazon.de/gp/product/B0058NV1IY/trektrip )
  * [Star Trek - Next Generation auf Blu-ray](http://www.amazon.de/gp/product/B005OUKLG4/trektrip )
  * [Unterschied auf YouTube](http://www.youtube.com/watch?v=fHUQ3aGLa5Q )
- [Eloquent Ruby](http://amzn.to/w9FQDJ )
- [Tenzing A SQL Implementation On The MapReduce Framework](http://research.google.com/pubs/pub37200.html )
- [Turbocharging Solr Index Replication with BitTorrent](http://codeascraft.etsy.com/2012/01/23/solr-bittorrent-index-replication/ )
- [Ultra Fuckers]( http://www.amazon.de/gp/product/1933929669/retinacast-21 )
- [deprecated linux networking commands and their replacements](http://dougvitale.wordpress.com/2011/12/21/deprecated-linux-networking-commands-and-their-replacements/ )
- [Recover Wifi Protected Setup access](http://code.google.com/p/reaver-wps/ )
- [WPS Brute Force Paper](http://sviehb.files.wordpress.com/2011/12/viehboeck_wps.pdf )

## Picks

- [Louis CK at the Beacon Theatre]( https://buy.louisck.net ) (pfleidi)
    * [Stellungnahme nach 12 Tagen]( https://buy.louisck.net/news )
- [Trybloc]( http://www.trybloc.com/courses ) (pfleidi)
- [iozone](http://www.iozone.org/ ) (ingo)
- [honeyd](http://ulissesaraujo.wordpress.com/2008/12/08/deploying-honeypots-with-honeyd/ ) -> Software die einfach fertig ist
- [Backup with Backup](http://freelancing-gods.com/posts/backing_up_with_backup )
- [Travis CI]( http://travis-ci.org/ )
- [Minipwner (aka. Krebsplug)]( http://www.minipwner.com/ )
- [Python for Humans]( http://python-for-humans.heroku.com ) 

