---
layout: post
title: "Binärgewitter Talk #11 - btrfs -> cheeseFS"
date: 2012-04-20 14:00
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2012-04-19.Binaergewitter.Talk.11.mp3
  ogg: http://download.binaergewitter.de/2012-04-19.Binaergewitter.Talk.11.ogg
---
Was ist eigentlich unhosted? Das fragen wir unseren Gast Jan. Er erklärt uns auch warum die Semi.coli sterben und wir trauern darum dass nicht gleich das Wireless World Wide Web erfunden wurde.

## Toter der Woche
- [Das Semikolon](http://github.com/twitter/bootstrap/issues/3057 )
## Untoter der Woche
- [Prince of Persia aus den Apple II Kassetten zurueck gekehrt](http://jordanmechner.com/blog/2012/04/textfiles/ )
    * [Code auf Github]( https://github.com/jmechner/Prince-of-Persia-Apple-II )
- [Tupac, der Holo Geisterrapper]( http://www.welt.de/kultur/musik/article106199399/Die-unheimliche-Holo-Auferstehung-des-toten-Tupac.html )
- [OpenOffice 3.4](http://www.golem.de/news/freie-buerosoftware-apache-openoffice-org-3-4-als-release-candidate-verfuegbar-1204-91264.html )
- [Blobby Volley im Browser](http://blobby.sourceforge.net/data/bv2browser/index.html )
- [Achtung, die Kurve!]( http://stravid.com/projects/achtung-die-kurve/ )
## News
- [same procedure as every week](http://www.humblebundle.com )
- [indie royale]( http://indieroyale.com )
- [openttd 1.2](http://www.pro-linux.de/news/1/18274/openttd-12-erschienen.html )
- [Multiuser tmux: Wemux]( https://github.com/zolrath/wemux )
- [Firebase]( http://www.wired.com/wiredenterprise/2012/04/firebase/ )
- [Package Lookup für sehr viele Quellen]( http://labs.floatboth.com/pkglookup/ )
    - Problem: pakete heissen bei allen distros Anders
    - pkglookup ist mehr Meta-Suchmaschine als Lookup/Resolver
    - [listaller](http://www.pro-linux.de/news/1/18276/listaller-054-freigegeben.html ) vs openpkg
    - [Punani Meta Package Manager](https://github.com/krebscode/painload/tree/master/punani )
        * `curl euer.krebsco.de:9111/pacman/python`
- [Light Table IDE](http://www.kickstarter.com/projects/306316578/light-table )
- [Neuer CoffeeScript Compiler auf Kickstarter]( http://www.kickstarter.com/projects/1182995593/make-a-better-coffeescript-compiler )
- [WFT? Ikea verkauft Fernseher](http://www.heise.de/newsticker/meldung/Ikea-verkauft-Fernseher-mit-Soundsystem-1541715.html )
- [Priv.ly, Privacy trotz Facebook, Twitter etc.](http://priv.ly/ )
- [Physik Prof. veröffentlicht Paper um Strafzettel zu entgehen]( http://www.neatorama.com/2012/04/14/man-beat-traffic-ticket-with-math/ )
- [StuttgartJS meetup](http://www.meetup.com/stuttgartjs/ )
- [Tinker.io (open source JSFiddle)](http://tinker.io/ )
- [Farbrausch ve röffentlicht Code aus 10 Jahren]( https://github.com/farbrausch/fr_public )
    * [Github Blogpost]( https://github.com/blog/1103-ten-years-of-farbrausch-productions-on-github )
    * [.kkrieger Video]( http://www.youtube.com/watch?v=oKCFq5GsrV0 )
- [Libre Projects, Sammlung von open source Webdiensten]( http://libreprojects.net )
- [Codetube federated git hosting](https://gitorious.org/codetube )
- [Haben will :) Net Coffee Machine](http://www.golem.de/news/fernbestellung-kaffeemaschine-mit-netzwerkanschluss-1204-91261.html )
- [ZeroBin, Pastebin mit client-side Encryption](http://sebsauvage.net/paste/ )
## Themen
### [Unhosted](http://unhosted.org )
* Was ist [Unhosted]( http://unhosted.org/#introduction )?
    - Offene [remoteStorage-Spezifikation](http://w3.org/community/unhosted/wiki/RemoteStorage )
    - [Offener Code](https://github.com/unhosted ), [Mailingliste](https://groups.google.com/forum/?fromgroups#!forum/unhosted ), IRC channel #unhosted auf freenode, [Twitter](http://twitter.com/unhosted )
* Was ist der Mehrwert/Vorteil gegenüber X?
    - Offenes Protokoll, jeder kann Storage-Provider wie auch Anwendungen programmieren
    - App-Entwickler müssen sich nicht um das Backend kümmern, Anwendungen sind nur client-seitiges HTML & Javascript
    - Nutzer bleiben in Kontrolle ihrer Daten und entscheiden, wo es gespeichert wird
* Integration mit anderen Projekten
 * Storage: [ownCloud](http://owncloud.org ), [5apps](http://5apps.com ), [Node.js+Redis](https://github.com/5apps/express-storage ), [Sinatra+Riak](https://github.com/5apps/liquor-cabinet )…
     * [ownCloud Exploit]( http://packetstormsecurity.org/files/111956/TC-SA-2012-01.txt )
 * Apps: [Libre Docs]( http://libredocs.org/ ), [Todo](http://todomvc.unhosted.5apps.com/ ), …
 * [TodoMVC]( http://addyosmani.github.com/todomvc/ )
 * [remoteStorage.js](https://github.com/unhosted/remoteStorage.js ) & [Tutorial](http://tutorial.unhosted.5apps.com/ )
* Technologie: OAuth, Webfinger, Cross-Origin Resource Sharing (CORS) und Key-Value Store
    - [Webfinger]( http://hueniverse.com/2009/08/introducing-webfinger/ )
    - [Oauth]( http://oauth.net/ )
    - [CORS]( http://www.w3.org/TR/cors/ )
* Ziele: [OpenPhoto](https://openphoto.me/ ), Pilotprojekt mit Niederländischen Studenten: [Surfnet](http://surfnet.nl ), [Banken zerstören und Transaktionen dezentralisieren](http://opentabs.net ), Legacy support für Dropbox, Google Drive etc.
* [Free-Web-Unkonferenz im September, in Unhost bei Prag](https://github.com/unhosted/website/wiki/Unhost12 )
## Lesefoo
- [The 30 css selectors you must memorize]( http://net.tutsplus.com/tutorials/html-css-techniques/the-30-css-selectors-you-must-memorize/ ) (pfleidi)
- [Extracting text from HTML documents]( http://tomazkovacic.com/blog/14/extracting-article-text-from-html-documents/ ) (pfleidi)
## Mimimi der Woche
- 3ware RAID (ingo) - tw_cli /c0/u0 set storsave=performance
- btrfs als Ersatz fuer LVM (makefu)
- Wordpress und SSL-only Admin / Caching (pfleidi)
## Picks
- [Lots of Satellites]( http://geoscope.agi.com/LotsOfSatellites/ ) (pfleidi)
    - [Air Traffic with ](http://hackaday.com/2012/04/16/playing-air-traffic-controller-with-software-defined-radio/ )
- [Terminial colors]( http://wynnnetherland.com/journal/a-stylesheet-author-s-guide-to-terminal-colors ) bzw. [grc]( http://korpus.juls.savba.sk/~garabik/software/grc.html ) (pfleidi)
- Sparkleshare (mal wieder) (ingo)
    - [XKCD: Google+]( http://xkcd.com/918/ )
    - [Syncany](http://www.syncany.org )
- [Python Anywhere]( http://www.pythonanywhere.com/ )
- * Koans
    * [JavaScript Koan]( https://github.com/liammclennan/JavaScript-Koans )
    * [Ruby Koans]( http://www.rubykoans.com/ )
    * [Python Koans]( https://github.com/gregmalcolm/python_koans )
- [Codetube federated git hosting]( https://codetu.be/ ) (Jan), [auf Gitorious](http://gitorious.org/codetube)
   
