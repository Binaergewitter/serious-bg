---
layout: post
title: "Binärgewitter Talk #15 - Cockford maximal strukturiert wegflickschustern"
permalink: /blog/2012/05/26/binaergewitter-talk-number-14-cockford-maximal-strukturiert-wegflickschustern/
date: 2012-05-26 12:30
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2012-05-24.Binaergewitter.Talk.15.mp3
  ogg: http://download.binaergewitter.de/2012-05-24.Binaergewitter.Talk.15.ogg
---
Felix und pfleidi allein im Studio. Nicht ganz eine 112 reloaded aber trotzdem mit witzigen und interessanten Themen gespickt.

## Kategorie der Woche

### Erfindung der Woche

- [Nicht haftende Beschichtung in der Flasche und der Ketchup flutscht fuer immer](http://www.fastcoexist.com/1679878/mits-freaky-non-stick-coating-keeps-ketchup-flowing )
- [Kerl baut aus seiner Ente ein Motorrad](http://hackaday.com/2012/05/21/man-stranded-in-the-desert-makes-a-motorcycle-from-his-broken-car/ )
- [Perpeto Mobile]( http://www.wimp.com/perpetualmotion/ )
- [Danke Japan! Der Roboter Arsch]( http://kotaku.com/5909139/japanese-researcher-made-robot-ass-for-you-to-spank-finally/gallery/1 )

## Toter der Woche

- [Der alte Shack]( http://3.asset.soup.io/asset/3176/3891_805d_500.jpeg ) :-(
- [Zuchtbulle tot, Landwirte failten]( http://www.fuldaerzeitung.de/nachrichten/huenfeld/Huenfeld-Zuchtbulle-tot-Landwirte-verletzt;art17,566627 )
- [Erfinder der Fernbedienung gestorben]( http://www.focus.de/panorama/vermischtes/fernbedienung-erfinder-der-kabellosen-tv-fernbedienung-ist-tot-_aid_756811.html )

## Untoter der Woche

- [Jazz Legende auf Parkbank nach 36 Jahren gefunden]( http://www.tagesschau.de/kultur/jazz104.html )

## News

- [Kaffee Trinker leben länger]( http://www.sciencedaily.com/releases/2012/05/120519071454.htm )
- [Chrome meist genutzter Browser....](http://www.omgchrome.com/chrome-overtakes-internet-explorer-now-worlds-most-used-browser/ ) [ OR IS
IT?](http://tech.slashdot.org/story/12/05/23/1345212/chrome-browser-usage-artificially-boosted-says-microsoft )
- [Verrückter will die Enterprise nachbauen](http://www.buildtheenterprise.org/ )
- [ SpaceX]( http://www.space.com/15805-spacex-private-capsule-launches-space-station.html )
    * [SpaceX Videos]( http://vimeo.com/spacexlaunch/videos )
- [yahoo Private key in App Fail]( https://github.com/nikcub/yahoo-spoof/ )
- [Douglas Crochford wechselt zu Paypal]( http://news.cnet.com/8301-1023_3-57427801-93/paypal-lures-javascript-bigwig-crockford-from-yahoo/ )
- Raspberry PI Konkurrenten:
    - [VIA APC Andrioid Computer]( http://www.tweaktown.com/news/24233/via_introduces_amazing_49_apc_android_computer_we_go_hands_on/index.html )
    - [Mini-PC-On-A-Stick AllWinner A10]( http://www.talkandroid.com/112590-mini-pc-on-a-stick-for-74-with-allwinner-a10-1-5ghz-cpu-and-android-4-0-sold-out-until-june-10/ )
    - [Volksbox]( http://www.golem.de/news/streaming-client-media-markt-stellt-settopbox-volksbox-movie-fuer-69-euro-vor-1205-92007.html )
- [Adobe will Geld fuer Security Updates, aka. kauft unsere neue Software](http://it.slashdot.org/story/12/05/10/2139232/adobe-introduces-the-paid-security-fix )[ und rudert wieder
zurueck...](http://arstechnica.com/gaming/2012/05/adobe-backs-down-will-secure-last-generation-of-apps/ )
- [FreeBSD will auf Clang/LLVM umsteigen]( http://www.golem.de/news/freebsd-clang-wird-gcc-ersetzen-1205-91778.html )
- [PostgreSQL unterstützt nun JSON]( http://www.golem.de/news/datenbanken-postgresql-9-2-beta-unterstuetzt-json-1205-91828.html )
    * [LWN PostgreSQL Artikel]( http://lwn.net/Articles/497069/ )
- [AppJS als Alternative zu Adobe AIR]( http://appjs.org/ )
    * [Github Account]( https://github.com/milani/appjs )
- [Geändertes Dropbox SDK soll AppStore Ablehnung verhindern]( http://www.appleinsider.com/articles/12/05/11/dropbox_fixes_app_rejection_issue_complies_with_apples_rules.html )
- [Apple weigert sich immer noch Flattr Integration in Apps zuzulassen]( http://vemedio.com/blog/posts/318 )
- [HdM Webday]( http://events.mi.hdm-stuttgart.de/ )

## Themen

### Felix und sein neuer(alter) Ubuntu Homeserver
- Von ArchLinux nach Ubuntu 12.04 LTS Server
    * 6TB Crypto + Raid + LVM
    * Crypto Home
    * AFP + NFS (o. Samba)
    * Sabnzbd+
- Warum?
    - Altes system arg verkrepelt und instabil
    - NFS "tat nicht"
    - Audio kaputt
    - etc. etc.
    - Ubuntu als "Debian mit frischen Paketen"
- Migration:
    - Vollstaendiger Migrationsaufwand 1.5h incl installation
    - Frisches Backup von Vorteil (z.b. mit rsnapshot) um Config direkt einzuspielen
- [Ubuntu 12.04 Vagrant Box]( http://blog.roothausen.de/downloads/vagrant-ubuntu-precise-64bit.box ) (pfleidi)
    * [Vagrant Box Howto]( http://vagrantup.com/v1/docs/base_boxes.html )

### Redundant Raid Cloud Storage Redux

- glusterfs
    - config pain + nfs
    - nur striping und mirroring
- [Tahoe-lafs]( https://tahoe-lafs.org/trac/tahoe-lafs )
    - redundanz (3 von 10) + serious crypto => by the powers combined
- PoC Code tbd

## Lesefoo

- [Harvest, yield, and scalable tolerant systems]( http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.24.3690&rep=rep1&type=pdf )
- [Avengers HUD Design]( http://cargocollective.com/jayse/Avengers )
- [The selfish gene]( http://www.amazon.de/gp/product/0199291144/ref=as_li_ss_tl?tag=retinacast-21 )
- [Tahoe-lafs]( https://tahoe-lafs.org/~zooko/lafs.pdf )

## Mimimi der Woche

- [Neues netcfg release bricht config]( http://www.archlinux.org/news/netcfg-282-release/ ) (pfleidi)
- [Cacti]( http://cacti.net/ )
    * [Cacti debugging]( http://docs.cacti.net/manual:087:4_help.2_debugging )
    * [Benutzt Munin]( http://munin-monitoring.org/ )
- Snort braucht 512+ MB RAM
    - [verwendet mit SecurityOnion]( http://securityonion.blogspot.de/ )

## Picks

- [Making the web faster, one Rails page at a time](http://www.youtube.com/watch?v=cUSucUxb40s) (pfleidi)
    * [W3C Navigation Timining API]( https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html )
- [Tron Dance]( https://www.youtube.com/watch?v=-Rot9uaVO8s )
- [Hübsche RFCs]( http://pretty-rfc.herokuapp.com/ ) (pfleidi)
- [Bearfood.com]( http://bearfood.com/ )
    - [Vogel Berserker]( http://explodedsoda.tumblr.com/post/20119944789/knitmeapony-fyeahlilbitoeverything )
- [Webpagetest]( http://www.webpagetest.org/ ) (pfleidi)
- [Gitolite]( https://github.com/sitaramc/gitolite )
- [Where the fuck should i go to eat?]( http://www.wherethefuckshouldigotoeat.com/ )
- [GIt animals]( http://git-animals.tumblr.com/ ) (pfleidi)
- [Recursive Drawing]( http://news.ycombinator.net/item?id=3951255 )
- [Speakerdeck]( http://speakerdeck.com ) (pfleidi)
    * [pfleidis Account]( https://speakerdeck.com/u/pfleidi )
- Chrome hat Flashblock eingebaut

