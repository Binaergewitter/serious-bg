---
layout: post
title: "Binärgewitter Talk #22 - teilweise sehe ich Dinge"
date: 2012-07-20 13:30
comments: true
categories: talk
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2012-07-20.Binaergewitter.Talk.22.mp3
  ogg: http://download.binaergewitter.de/2012-07-20.Binaergewitter.Talk.22.ogg
  m4a: http://download.binaergewitter.de/2012-07-20.Binaergewitter.Talk.22.m4a
---
Das muss man wirklich wissen, ist man nun bei 0 Grad Kelvin ganz tot? Neben den üblichen IT- und Security-News weinen wir über Alsa und Archlinux.

# Interne Dinge
* [eminem anpassen]( https://github.com/Binaergewitter/eminem )

## Toter der Woche
* [Nokia](http://www.heise.de/newsticker/meldung/Nokia-stuerzt-weiter-ab-1647473.html )
* [Neckermann ist Insolvent](http://www.heise.de/newsticker/meldung/Neckermann-de-meldet-Insolvenz-an-1646755.html ) 
* [kein Nero Linux mehr](http://www.phoronix.com/scan.php?page=news_item&px=MTE0MjI )
* [Botnetz Grum]( http://www.bbc.com/news/technology-18898971 )
* [Jolla](http://www.pro-linux.de/news/1/18614/jolla-erhaelt-grossauftrag-aus-china.html )
* [Terrorismus]( http://www.dailymail.co.uk/news/article-2173122/Royal-Navys-largest-warship-sails-Thames-armed-forces-strength-Olympics.html )

## Blast from the Past
* [Apple ist zurueck bei EPEAT - "all eligible Devices"]( http://news.ycombinator.net/item?id=4240788 )
    * [Retina Mac bei EPEAT](http://ww2.epeat.net/PublicSearchResults.aspx?return=pm&epeatcountryid=1&manufacturer=32 )

## News
* [Steam auf Ubuntu]( http://blogs.valvesoftware.com/linux/steamd-penguins/ ) 
* [SSD bei AWS]( http://aws.typepad.com/aws/2012/07/new-high-io-ec2-instance-type-hi14xlarge.html ) 
* [Nexus 7 geht nicht auf]( http://www.youtube.com/watch?v=32DD4DF7Qpo )
    * [oder doch]( https://www.youtube.com/watch?v=GWl1m0Cd4eI )
* [Das einzige problem: Sie halten sich an Geschwindigkeitsbegrenzungen]( http://www.slate.com/blogs/future_tense/2012/07/13/eric_schmidt_on_self_driving_cars_biggest_problem_they_obey_speed_limits.html 
* [Hack the hackers: pcap_log Privilege Escalation]( http://packetstormsecurity.org/files/114784/metasploit-localroot.txt )
* [Nao Evolution of Dance]( http://www.youtube.com/watch?v=2laujomh0JY )    
* [Twitter gibt RedPhone frei]( https://github.com/WhisperSystems/RedPhone )
* [Skype Supernodes unterstuetzen Decryption aka. Abhoernubsis]( http://news.ycombinator.net/item?id=4254925 )
* [geo-IP Blocking verbieten]( http://delimiter.com.au/2012/07/19/choice-wants-geo-ip-blocking-abolished/ )
* [An analysis of the Yahoo! passwords]( http://isc.sans.edu/diary.html?storyid=13720&rss )
* [Intel Core 2 Duo Remote Exec Exploit IN JAVASCRIPT]( http://news.ycombinator.net/item?id=4245982 )
* [SkyDrive Code of Conduct - durchsucht deine Box nach Schmuddel]( http://wmpoweruser.com/watch-what-you-store-on-skydriveyou-may-lose-your-microsoft-life/ )
* [The Linux shell will always be with us]( http://www.zdnet.com/the-linux-shell-will-always-be-with-us-7000000742/ )
* [Google Wetter auf Tablets](http://www.engadget.com/2012/07/18/google-adds-interactive-weather-to-tablets/ )
* [Is Facebook Toast?]( http://www.datamation.com/feature/is-facebook-toast-1.html )
    * [Google+ waechst um 43 prozent in Juni]( http://news.ycombinator.net/item?id=4257108 )
* [Dropox Spam steigt, was ist passiert?]( http://news.techworld.com/security/3370518/spike-in-dropbox-spam-raises-security-worries/ )
* [Firefox 14 mit "secure search"]( http://arstechnica.com/information-technology/2012/07/firefox-14-arrives-with-secure-search/ )
* [Atomwaffen sind garnicht schlimm]( http://www.npr.org/blogs/krulwich/2012/07/16/156851175/five-men-agree-to-stand-directly-under-an-exploding-nuclear-bomb?ps=cprs )
* [Apple's Dilemma: The 7-inch IPad](http://connectedmonster.com/2012/07/17/apples-dilemma-the-7-inch-ipad/ )
* [Apple muss sich oeffentlich bei Samsung entschuldigen]( http://www.bloomberg.com/news/2012-07-18/apple-must-publish-notice-samsung-didn-t-copy-ipad-judge-says.html )
   * [Bildvergleich](http://i.imgur.com/TmUj2.jpg )
* [Shell Crowdsources Ads - "Let's Go!"]( http://arcticready.com/social/gallery )
    * [... ist ein gut gemachter Hoax von Green Peace]( http://www.upi.com/blog/2012/07/17/Shell-Lets-Go-campaign-a-brilliant-elaborate-hoax-UPDATED/5651342541859/#!/2/ )
* [Punycode]( http://en.wikipedia.org/wiki/Punycode )
    
## Lesefoo
* [Glenn Vanderburg - Software Engineering Doesn't Work!]( http://www.youtube.com/watch?v=NCns726nBhQ#t=9m42s )
* [I invoke]( http://pastebin.com/q0hTkwFh )
- [Epic fraud]( http://arstechnica.com/science/2012/07/epic-fraud-how-to-succeed-in-science-without-doing-any/ )
* [Automatic Summarization]( http://en.wikipedia.org/wiki/Automatic_summarization )

## Mimimi der Woche
- [Archlinux, WTF? - The /lib symlink hell]( https://wiki.archlinux.org/index.php/DeveloperWiki:usrlib )
    - first things first, do not try to manually move the /lib folder...
    - pacman -Syu --ignore glibc #pacman install
    - pacman -Syu --ignore glibc #upgrade all the stuff possible
    - pacman -Sud --ignore glibc #upgrade all the other packages which depend on glibc
    - find /lib -exec pacman -Qo -- {} + # find files in /lib which are unowned or owned by old packages, delete these packages or files
    - grep '^lib/' /var/lib/pacman/local/*/files #find packages which still might have some files in /lib
- [Alsa nervt]( https://twitter.com/rb2k/status/225737496334577664 )
  - [Fluendo](http://fluendo.com )

## Picks
* [Self aware Roomba]( http://twitter.com/SelfAwareROOMBA )
* [Dr Axel Stoll Part 1]( http://www.youtube.com/watch?v=NYiZR6-_37I )
* [Dr Axel Stoll Part 2]( http://www.youtube.com/watch?v=EKMUOY8YSW8 )
* [Dr Axel Stoll Buch]( http://amzn.to/Lvj27J )
* [QWOP]( http://www.foddy.net/Athletics.html )
    * [Japanischer Live QWOP](http://25.media.tumblr.com/tumblr_m6khue2PGA1qdlh1io1_250.gif )
* [DEF CON Videos]( https://media.defcon.org/ )
* [What if]( http://what-if.xkcd.com )

