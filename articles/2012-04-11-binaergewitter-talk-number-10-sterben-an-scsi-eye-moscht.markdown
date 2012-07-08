---
layout: post
title: "Binärgewitter Talk #010 - Sterben an SCSI Eye-Moscht"
date: 2012-04-12 12:00
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2012-04-11.Binaergewitter.Talk.10.mp3
  ogg: http://download.binaergewitter.de/2012-04-11.Binaergewitter.Talk.10.ogg
---
Kulturkampf in der Talk-Runde: Schwaben gegen Berliner oder so ähnlich. Neben diesem Schaukampf beschäftigen wir uns diesmal mit Automation.

## Toter der Woche
- [Der gute Geschmack]( http://robmientjes.nl/item/comic-serif )
- [Comodore Grüner ist tot](http://www.heise.de/newsticker/meldung/Computer-fuer-die-Massen-zum-Tode-des-Commodore-Gruenders-Jack-Tramiel-1517599.html )
- [Linux Kernel 2.4]( http://www.heise.de/newsticker/meldung/Pflege-des-Linux-Kernels-2-4-endet-1517604.html )
- [Jim Marshall - Father of Loud verstorben]( http://www.wochenblatt.de/nachrichten/altoetting/ueberregionales/Verstaerker-Erfinder-Jim-Marshall-tot;art5572,106046 )
- [Ferdinand Alexander Porsche]( http://de.wikipedia.org/wiki/Ferdinand_Alexander_Porsche )
## Untoter der Woche
* [Zombie Baby aus der Kaeltekammer]( http://www.rp-online.de/panorama/ausland/fruehchen-ueberlebt-stundenlang-in-kuehlraum-1.2787719 )
## News
- [Instagram von Facebook gekauft fuer `ONE BILLION DOLLARS`]( http://www.businessinsider.com/instagram-billion-dollar-valuation-2012-4 )
    - [Instagram Account loeschen bevor es bei Facebook landet]( https://instagram.com/accounts/remove/request/ )
    - [Exportiere ALL DEINE BILDER]( http://instaport.me/ )
- [Flashback Drive-By Virus auf jedem 100ten Mac - Worse than Conficker]( http://www.computerworld.com/s/article/9225937/Mac_Malware_Outbreak_Is_Bigger_than_39_Conficker_39_ )
- [Samba Remote Code Execution als root](https://www.samba.org/samba/security/CVE-2012-1182 )
- [Google Glasses in Q3]( https://plus.google.com/111626127367496192147/posts )
    - [What it means to be human]( http://blog.bit9.com/bid/80774/Project-Glass-Google-s-Augmented-Reality-Changes-What-it-is-to-be-Human?utm_source=BLOG-Project-Glass-Google-s-Augmented-Reality-Changes-What-it-is-to-be-Human-4.9.2012 )
    - [Windows Project Glass]( http://www.youtube.com/watch?v=ZwModZmOzDs )
    - [Apple Fanboyism]( http://www.cultofmac.com/159453/why-apple-wont-turn-you-into-a-cyborg/ )
- [House of Stark](https://p.twimg.com/AoNUIKYCIAA0eip.jpg )  
- [CouchDB 1.2]( http://couchdb.apache.org/ )
- [Agilebits fixt potentielle Schwachstellen in 1password]( http://blog.agilebits.com/2012/04/09/1password-ios-pbkdf2-goodness/ )
- [AT&T Security microcell fail]( http://fail0verflow.com/blog/2012/microcell-fail.html ) (marc)
- [Mosh: Moderner SSH Ersatz?]( http://mosh.mit.edu/ )
    * [Protocol Buffers]( https://developers.google.com/protocol-buffers/ )
    * [Installation unter Debian und OS X]( http://www.freshblurbs.com/installing-mosh-debian-squeeze-and-mac-os-x-lion )
- [MySQL at Twitter]( http://engineering.twitter.com/2012/04/mysql-at-twitter.html ) (marc)
- [GO 32Bit Memory Issues](http://news.ycombinator.net/item?id=3805302 )
- [mod_redis]( https://github.com/sneakybeaky/mod_redis ) (marc)
- [DCPU-16 Code]( https://github.com/blog/1098-take-over-the-galaxy-with-github )
    * [0x10c Game]( http://0x10c.com/ )
    * [Minecraft]( http://www.minecraft.net/ )
    * [DCPU-16 Spezifikation]( http://0x10c.com/doc/dcpu-16.txt )
    * [VMs in JS, Haskell, Java, ...]( https://github.com/dcpu16 )
## Themen
### Automation

- Scripten
    * Shell/Ruby/Python/Perl
        * [viddl-rb]( https://github.com/rb2k/viddl-rb )
        * [Advanved Bash Scripting Guide]( http://tldp.org/LDP/abs/html/ )
        * [einzellne Konfigdateien syncron halten dann csync2](http://oss.linbit.com/csync2/ )
        * [etckeeper](http://joey.kitenet.net/code/etckeeper/ )
    * Cron
    * [incron]( http://inotify.aiken.cz/?section=incron&page=doc&lang=en )
    * atd
- Softwareverteilung
    * [pulp](http://pulpproject.org/)
    * [m23](http://m23.sourceforge.net/PostNuke-0.750/html/index.php)
    * [spacewalk](http://spacewalk.redhat.com/)
    * [opsi](http://www.opsi.org/en) (windowsverteilung)
    * [AutoIT]( http://www.autoitscript.com/site/autoit/ )
    * Active Directory
- Rechner automatisiert installieren/provisionieren
    * Netboot cobbler
        * [PXE]( http://de.wikipedia.org/wiki/Preboot_Execution_Environment )
    * Images
    * [Puppet]( http://puppetlabs.com/puppet/what-is-puppet/ )
    * [Chef]( http://www.opscode.com/chef/ )
    * [Making it virtually easy to deploy on day one]( http://codeascraft.etsy.com/2012/03/13/making-it-virtually-easy-to-deploy-on-day-one/ )
    * [Vagrant]( http://vagrantup.com/ )
      - [vagrantbox.es]( http://vagrantbox.es/ )
      - [Interview]( http://thechangelog.com/post/17325686068/episode-0-7-2-vagrant-with-mitchell-hashimoto )
    * [Fog]( http://fog.io/ )
- Backup
    * [RadioTux Talk 144](http://www.radiotux.de/index.php?/archives/7597-Talk-144-RAID0-Backup.html )
    * [rsync](https://rsync.samba.org/)
    * unison
    * [rsnapshot](http://rsnapshot.org/)
    * [lsyncd]( https://code.google.com/p/lsyncd/ )
    * [Time Machine](https://www.apple.com/macosx/apps/#timemachine)
    * [back in time](http://backintime.le-web.org/)
    * [duplicity](http://duplicity.nongnu.org/)
    * [amanda](http://amanda.org/)
    * [arkeia](http://www.arkeia.com/)
    * [bacula](http://www.bacula.org/)
    * [sep sesam](http://sepsoftware.com/)
- Audio/Video konvertieren
    * [ffmpeg](http://ffmpeg.org/)
    * [mplayer](http://www.mplayerhq.hu/)
    * [Handbrake](http://handbrake.fr/)
## Lesefoo
- [Beginners guide to one modern web development stack]( http://coffeespoonsofcode.wordpress.com/2012/04/07/beginners-guide-to-one-modern-web-development-stack/ ) (pfleidi)
- [How to count a billion disctinct objects in 1,5 KB of memory]( http://highscalability.com/blog/2012/4/5/big-data-counting-how-to-count-a-billion-distinct-objects-us.html ) (marc)
- [How to hire a programmer]( http://www.codinghorror.com/blog/2012/03/how-to-hire-a-programmer.html ) (pfleidi)
- [PHP a fractal of bad design]( http://me.veekun.com/blog/2012/04/09/php-a-fractal-of-bad-design/ ) (marc)
- [Linus on kernel management style]( http://lwn.net/Articles/105375/ ) (pfleidi)
- [How I(Richard Stallman) do my Computing](http://stallman.org/stallman-computing.html ) (makefu)
- [Annotated docco code]( http://jashkenas.github.com/docco/ ) (pfleidi)
- [Animal Magnetism: Making O'Reilly Animals]( http://oreilly.com/news/lejeune_0400.html# ) (makefu)
    * [The acid is kicking in]( http://www.kontraband.com/pics/15421/OReilly-On-Acid/ )

## Mimimi der Woche
- [Brother Drucker DCPJ925DW](http://www.amazon.de/gp/product/B005HQPNWW/ref=as_li_ss_tl?ie=UTF8&tag=trektrip&linkCode=as2&camp=1638&creative=19454&creativeASIN=B005HQPNWW) und Arch (Ingo)
- OS X und Bluetooth
- sky2 - ethtool -K eth0 rx off (ingo)
- Cacert und Chrome Warnungen
    * [StartSSL]( http://www.startssl.com/ )
- [MP3/Ogg Chapter Support in die freien Player](https://plus.google.com/100883264249933714273/posts/GJM9D5VxX4G )(ingo)

## Picks
- [Texts from dog]( http://textfromdog.tumblr.com/ ) (marc)
    * [Yes hello, this is dog]( http://knowyourmeme.com/memes/yes-this-is-dog )
    * [Yes hello, this is balls]( http://memerial.net/4319-hello-yes-this-is-balls )
- [screenquery.es]( http://screenqueri.es/ ) (pfleidi)
- [Talk vom "Catch me if you can" kerl]( http://www.youtube.com/watch?v=vHOvl_D_tdU )
- [Talk von Steve Klabnik zu Hypermedia APIs]( http://vimeo.com/40084288 ) (pfleidi)
- [W3CLove]( http://w3clove.com/ ) (pfleidi)
   * Marcs Idee: W3C Violator
- [IP Geo]( http://ip-geo.appspot.com/ ) [Im Einsatz hier]( http://blog.marc-seeger.de/books.html ) (marc)
- [Chris Strom: You ain't SPDY]( http://confreaks.com/videos/652-gogaruco2011-you-ain-t-spdy ) [yt]( http://www.youtube.com/watch?v=zqst-oaXIHQ ) (pfleidi)
- [Titanik SUPER 3D]( http://www.youtube.com/watch?v=dJxj1mou03M )
   * [ZOMG TITANIC]( http://twitpic.com/97vogu )
   
