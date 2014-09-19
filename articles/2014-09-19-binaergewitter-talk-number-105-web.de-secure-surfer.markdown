---
layout: post
title: "Binärgewitter Talk #105: web.de secure surfer"
date: 2014-09-19 19:00
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2014-09-18.Binaergewitter.Talk.105.mp3
  ogg: http://download.binaergewitter.de/2014-09-18.Binaergewitter.Talk.105.ogg
  m4a: http://download.binaergewitter.de/2014-09-18.Binaergewitter.Talk.105.m4a
  opus: http://download.binaergewitter.de/2014-09-18.Binaergewitter.Talk.105.opus
---
Mat, Felix und Ingo reden diesmal vorallem über Sidechannel Attacks, DNSSec, Mailpile und warum U2, BtrFS sowie FreeNAS blöd sind.

## Blast
- [MSN Messenger gibt das @messenger-Handle an FB weiter]( https://twitter.com/Messenger/status/509536926827700224 )
- [Common Mark(down)]( http://blog.codinghorror.com/standard-markdown-is-now-common-markdown/ )
   * [CommonMark]( http://commonmark.org/ )

## Toter der Woche
- iPod classic

## Untoter der Woche
- [Minix](http://www.heise.de/newsticker/meldung/Freies-Betriebssystem-Minix-3-3-0-veroeffentlicht-2392287.html )
- [Uber darf weiter fahren]( http://www.gulli.com/news/24666-landgericht-frankfurt-uber-darf-vorerst-weiterfahren-2014-09-16 )
    * [Logbuch Netzpolitik 114]( http://logbuch-netzpolitik.de/lnp114-cyber-cyber )
    * [Taxirufer high-fiven]( http://www.kraftfuttermischwerk.de/blogg/taxirufende-high-fiven/ )

## Tumblr der Woche
- [who is U2?]( http://www.whoisu2.com/ )
    * [SOI Removal]( http://itunes.com/soi-remove )


## News
- [in China darf mal jetzt mit Smartphone auf dem Gehweg laufen](http://de.engadget.com/2014/09/14/china-hat-seine-ersten-fussgangerweg-nur-fur-smartphone-geisterf/ )
    * [XKCD Swag: Actual Size Stickers]( http://store.xkcd.com/ )
- [AVM sperrt Bastler aus]( http://www.heise.de/newsticker/meldung/AVM-Router-Fritzbox-Update-haengt-Bastler-ab-2391292.html )
    * [Freez]( http://freetz.org/ )
- [ZFS on Linux jetzt produktionsreif]( http://www.computerbase.de/2014-09/zfs-fuer-linux-gilt-als-produktionsreif/ )
    * [Projekt-Seite]( http://zfsonlinux.org/ )
- [GoatSimulator für iOS und Android](http://www.heise.de/newsticker/meldung/Goat-Simulator-jetzt-auch-fuer-Android-und-iOS-2394816.html )
- [Bei Google kann man apps 2h testen]( https://support.google.com/googleplay/answer/134336?hl=en )
- [maidsafe](http://maidsafe.net/ ) -> schon fast ein bisschen cheesefs - via Merlink
- [iOS 8 und andere Updates von Apple]( http://www.apple.com/ios/ )
    * [popkey]( http://popkey.co/ )
    * [typedown]( http://typedownapp.com/ )
- [Mailpile]( http://www.heise.de/newsticker/meldung/E-Mail-Umgebung-Mailpile-als-Beta-freigegeben-2391901.html )
- [systemd für openbsd]( http://www.pro-linux.de/news/1/21500/systemd-funktionalitaet-fuer-openbsd-geplant.html )
    * [Linus ist systemd egal]( http://linux-beta.slashdot.org/story/14/09/17/1258203/torvalds-no-opinion-on-systemd )
- [wir waren die icloud hacker](http://www.heise.de/security/meldung/Nach-Affaere-um-Promi-Nacktbilder-Phishing-Kampagne-gegen-iCloud-Nutzer-2370067.html )
- [netflix]( https://www.netflix.com/?locale=de-DE )
    * [Binge Watching - Komaglotzen]( https://en.wikipedia.org/wiki/Binge-watching )
    * [Stars "warnen" vor Binge Watching]( http://insidetv.ew.com/2014/08/14/binge-watching-tv-psa/ )
- [Todogroup]( http://todogroup.org/ )


## Themen

### DNSSec
- [DNSSec tester]( https://www.tlsa.info/detail/mail.jitcreatives.de )
- [DNSSec allgemein]( https://de.wikipedia.org/wiki/Domain_Name_System_Security_Extensions )
    * DNS Poisoning
    * Man in the middle
    * [DANE]( https://de.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities )
- [ldnsutils / ldns]( http://linux.die.net/man/1/ldns-dane )
- Bind
    * [dynamische Zonen]( https://sys4.de/en/blog/2014/05/24/einen-tlsa-record-fuer-dane-mit-bind-9-publizieren/ )
    * [old way]( http://www.howtoforge.com/configuring-dnssec-on-bind9-9.7.3-on-debian-squeeze-ubuntu-11.10-p2 )
    * [new way]( https://kb.isc.org/article/AA-00626/0/Inline-Signing-in-ISC-BIND-9.9.0-Examples.html ) - inline signing (so habs ich auch gemacht) ab BIND 9.9 (debian backports) - 
-[Check your mail servers encryption]( https://ssl-tools.net/mailservers )
- Unbound
    * unbound-anchor -v (ggf. [extra paket]( https://wiki.archlinux.org/index.php/Unbound )) 
    * [dnssec-trigger]( http://www.nlnetlabs.nl/projects/dnssec-trigger/ )
    
## Lesefoo

- [Physical Sidechannel Attacks über USB-Grounding]( http://www.cs.tau.ac.il/~tromer/handsoff/ ) - Side Channel + chosen plaintext attack by the dudes which brought you the audio side channel
    * [Heise Artikel]( http://www.heise.de/security/meldung/Krypto-Schluessel-ueber-das-Erdungspotential-ausspionierbar-2294085.html )
    * Why does this happen? 
       The  electric potential on a laptop computer's chassis (metal panels,  shields     and ports) is ideally equal to that of the mains earth  ground potential, but     in reality it fluctuates greatly. Even when  the laptop is grounded (via its     power supply or via shielded cables  such as Ethernet, USB or VGA), there is     non-negligible impedance  between the grounding point(s) and other points in     the chassis. Due  to currents and electromagnetic fields inside the computer,     voltages  of large magnitude develop across this impedance     (often 10mV RMS or more, after filtering out the 50 or 60 Hz mains     frequency). This is the voltage we measure.

- [Apple on Privacy]( http://www.apple.com/privacy/ )
    * [Tim Cook Interview mit Charlie Rose]( http://www.charlierose.com/watch/60444569 )

## Mimimi der Woche
- BTRFS... why you betrayin me?
- FreeNAS
    * [OpenMediaVault]( http://www.openmediavault.org/ )
    * [PFsense]( https://www.pfsense.org/ )
- Android Battery immer leer dank ständigem Vibrieren, Nexus 7 Batterie suckt hart

## Picks
- Mat hat neuen Mac aufgesetzt, dank [brew cask]( http://caskroom.io/ ) alles super easy!
- [Jhipster]( http://jhipster.github.io/ ) via [@l33tname]( https://twitter.com/l33tname )
- [Phantomspeisung fuers Studioheadset]( http://www.amazon.de/dp/B00FFIGYOI/?tag=krebsco-21 )
- [slack.com]( https://slack.com/ )
- [Arduino Leonardo in nano und offiziell supportet (atmega 32u4) ](  http://s.click.aliexpress.com/klk/MFZNv6Rf )
- [Factorio]( http://www.factorio.com/ )
- [Larry Ellison tritt als Oracle-CEO zurück]( http://recode.net/2014/09/18/larry-ellison-will-step-down-as-ceo-of-oracle/ )
- [Voice recognition in Scottish elevator]( https://www.youtube.com/watch?v=5FFRoYhTJQQ )

