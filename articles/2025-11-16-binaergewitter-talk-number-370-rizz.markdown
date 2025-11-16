---
layout: post
title: "Binärgewitter Talk #370: Ein Skibidi Rizz"
date: 2025-11-16 10:00
comments: true
categories: talk
sharing: true
published: true
chapters: https://download.binaergewitter.de/2025-11-14.Binaergewitter.Talk.370.chapters.txt
transcript: https://download.binaergewitter.de/2025-11-14.Binaergewitter.Talk.370-speech.json
audioformats:
  mp3: https://download.binaergewitter.de/2025-11-14.Binaergewitter.Talk.370.mp3
  ogg: https://download.binaergewitter.de/2025-11-14.Binaergewitter.Talk.370.ogg
  opus: https://download.binaergewitter.de/2025-11-14.Binaergewitter.Talk.370.opus
voices:
  l33tname: true
  madmas: true
  ingo: true
  felix: true
  sebastian: false
---
Im Binärgewitter-Talk #370 stolpern wir gemeinsam durch die glitzernde Tech-Welt – von Linux-Liebeserklärungen bis Mac-Mimimi.
Unser Gast erklärt uns, warum Stromnetze spannender sind als jede Netflix-Serie, während Cloud-Dienste reihenweise „Tote der Woche“ melden.
Zwischendurch philosophieren wir über Kubernetes, KI-Hacking und ob Gateway-API wirklich das neue heiße Ding ist.
Zum Schluss gibt’s Zukunftsvisionen zu E-Mobilität, Smart Homes und Mini-Windrädern – Tech-Chaos zum Mitlachen garantiert!

## Toter der Woche

- [graveyard has a new logo]( https://www.phoronix.com/news/New-Apache-Software-Logo )
- [Neato Cloud Services]( https://www.heise.de/news/Vorwerk-Tochter-Neato-legt-Cloud-Server-still-Staubsauger-verlieren-Funktionen-10748922.html )
- [MinIO](https://github.com/minio/minio/issues/21647#issuecomment-3439134621)
- [Ingress NGINX Retirement]( https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/ )
- [Externe Facebook "like" und "comment" buttons]( https://www.heise.de/news/Nach-15-Jahren-Facebook-nimmt-Like-und-Kommentar-Buttons-offline-11073094.html )
- [Exotische Debian Ports]( https://www.heise.de/news/Debian-APT-bekommt-ab-Mai-2026-harte-Rust-Abhaengigkeit-10968522.html )
- [Plain HTTP in Chrome]( https://www.heise.de/news/Chrome-warnt-ab-2026-standardmaessig-vor-HTTP-Verbindungen-10962838.html )
  - [Lennarts Blog]( http://0pointer.net/blog/ )

## Untoter der Woche

- [Linux-Konsole: Valve kündigt neue Steam Machine an]( https://www.heise.de/news/Linux-Konsole-Valve-kuendigt-neue-Steam-Machine-an-11076221.html )
  * [Steam Hardware Announcement](https://www.youtube.com/watch?v=OmKrKTwtukE)


## AI der Woche

- [AI Darwin Awards]( https://aidarwinawards.org/ )
* [Securevibes]( https://github.com/anshumanbh/securevibes )

    - [Volkwagen for Unit Tests] (https://github.com/auchenberg/volkswagen)

- [Where's the Shovelware? Why AI Coding Claims Don't Add Up]( https://mikelovesrobots.substack.com/p/wheres-the-shovelware-why-ai-coding )

- [Anthropic: AI Espionage]( https://www.anthropic.com/news/disrupting-AI-espionage )
  - [Researchers Question claim]( https://arstechnica.com/security/2025/11/researchers-question-anthropic-claim-that-ai-assisted-attack-was-90-autonomous/ )

- [AI slop attacks on the curl project (video)](https://media.ccc.de/v/froscon2025-3407-ai_slop_attacks_on_the_curl_project)
   - [Blog Post von Daniel Stenberg](https://daniel.haxx.se/blog/2025/08/18/ai-slop-attacks-on-the-curl-project/)

- [AI Song an der Spitze der Charts (in den USA)]( https://www.heise.de/news/Walk-My-Walk-KI-generierter-Song-erstmals-an-Spitze-einer-Billboard-Liste-11073272.html )
  - [Human Music (video)]( https://www.youtube.com/watch?v=JWtC87gdsgo )
- [Cometjacking attack]( https://www.bleepingcomputer.com/news/security/commetjacking-attack-tricks-comet-browser-into-stealing-emails/ )
  - [Unseeable prompt injections in Comet and other AI browsers]( https://brave.com/blog/unseeable-prompt-injections/ )
- [AI World Clocks]( https://clocks.brianmoore.com/ )

## News

- [Fedora Linux 43]( https://www.heise.de/en/news/Fedora-Linux-43-Goodbye-X11-Hello-WebUI-10915382.html )
- [Meta wants to read your DMs]( https://www.gadinsider.com/meta-may-read-your-dms-soon-heres-what-you-need-to-know-27513 )
- [Operaton has reached 1.0](https://github.com/operaton/operaton/releases/tag/v1.0.0)  — [Camunda 7.0 CE repo has been archived]( https://github.com/camunda/camunda-bpm-platform ) 
- [FreeBSD shortly before 15.0: Trust is good, reproducibility is better]( https://www.heise.de/en/news/FreeBSD-shortly-before-15-0-Trust-is-good-reproducibility-is-better-10965171.html )
  * [FreeBSD now builds reproducibly and without root privilege](https://freebsdfoundation.org/blog/freebsd-now-builds-reproducibly-and-without-root-privilege/)
- [PS5 Funktionierender User + Kernel Exploit]( https://tarnkappe.info/artikel/jailbreaks/y2jb-funktionierender-ps5-jailbreak-veroeffentlicht-322923.html )
- [Affinity’s new design platform combines everything into one app]( https://www.theverge.com/news/810251/canva-affinity-design-suite-free-app-relaunch )

- [Ausbruch aus Dockercontainer]( https://www.golem.de/news/sicherheitsluecken-in-runc-angreifer-koennen-aus-docker-containern-ausbrechen-2511-202019.html )

## Themen

### eAuto laden und Energienetze (follow up zur FrosCon Folge)

- [Wikipedia: Grobe Struktur eines Stromnetzes](https://upload.wikimedia.org/wikipedia/commons/b/b0/Stromversorgung.svg)
- [Frische News]( https://www.heise.de/news/E-Mobilitaet-Bundestag-macht-Weg-frei-fuer-bidirektionales-Laden-11079565.html )
- [Schuko für PV]( https://www.pv-magazine.de/2025/11/14/schuko-stecker-meistens-ausreichend-vde-veroeffentlicht-produktnorm-fuer-stecker-solar-geraete/ )
- [Maus: Pumpspeicherwerk]( https://www.wdrmaus.de/extras/mausthemen/wasser/filme/pumpspeicherwerk.php5 )
- [DLF Forschung Aktuell — Podcast: Wasserstofferzeugung](https://www.deutschlandfunk.de/hydrogen-lab-testfeld-fuer-wasserstofferzeugung-durch-offshore-windenergie-100.html)
- Wikipedia: (Hochspannungs-Gleichstrom-Übertragung)[https://de.wikipedia.org/wiki/Hochspannungs-Gleichstrom-%C3%9Cbertragung]
- [Karte Offshore-Windparks in der Deutschen Bucht](https://de.wikipedia.org/wiki/Offshore-Windpark#/media/Datei:Karte_Offshore-Windparks_in_der_Deutschen_Bucht.svg)


## 3D-Druck der Woche
- [I Broke the Sound Barrier with a 3D Printed Rocket! (video)]( https://www.youtube.com/watch?v=HU3YnVzqExA )
- [C-Hook]( https://makerworld.com/en/models/1031229-c-hook-closet-hanger )
- [Battery Cover]( https://makerworld.com/en/search/models?keyword=battery%20cover )

## Mimimi der Woche

* [Anycubic Slicer Next für Linux nur mit "execute Shellscript from internet"]( https://wiki.anycubic.com/en/software-and-app/anycubic-slicer-next-linux )
  - welches CN schriftzeichen als Meldungen ausgibt
  - die Installationsziele auf Ubuntu Only einschränkt
  - im endeffekt doch nur eine paket-source einträgt und via apt ein paket installiert
* [NixOS static ip]( https://discourse.nixos.org/t/static-ip-configuration-on-raspberry-pi-3b/71935 )
```
let
  ext-if = "et0";
  external-mac = "00:11:22:33:44:55";
  external-ip6 = "2a01::2342";
  external-netmask6 = "64";
in
{
  services.udev.extraRules = ''
    SUBSYSTEM=="net", ATTR{address}=="${external-mac}", NAME="${ext-if}"
  '';
  networking = {
    enableIPv6 = true;
    nat.enableIPv6 = true;
    interfaces."${ext-if}" = {
      useDHCP = true;
      ipv6.addresses = [{
          address = external-ip6;
          prefixLength = external-netmask6;
      }];
    };
    defaultGateway6 = { address = external-gw6; interface = ext-if; };
    nameservers = [ "1.1.1.1" ];
  };
}
```
- Ab-er Finger macht kein Touch

## Lesefoo

[OpenSource Alternativen zu Cloudflare]( https://teufelswerk.net/open-source-alternativen-zu-cloudflare-datenschutz-sicherheit-digitale-souveraenitaet/ ) 

## Picks

- [thingino]( https://thingino.com/ )
- [Severance S02]( https://en.wikipedia.org/wiki/Severance_(TV_series)#Season_2_(2025) )
- [Kittysplit](https://www.kittysplit.com/en)
- [seized.fyi]( https://seized.fyi/ )
* Tooling

    https://volta.sh/

    https://github.com/Schniz/fnm

    https://mise.jdx.dev/

- [Fwupd 2.0.16 Released]( https://www.phoronix.com/news/Fwupd-2.0.16-Released )
- [Mit OSS Termine buchen beim Arzt]( https://www.heise.de/hintergrund/Open-Reception-Open-Source-Terminbuchungstool-fuer-Arztpraxen-steht-bald-bereit-11076033.html )
- [Bahnstationen in 3D-Karte](http://stations.albertguillaumes.cat/)

