---
layout: post
title: "Binärgewitter Talk #384: 2 Half life ist ein Leben"
date: 2026-07-18 15:00:00
description: "In dieser Folge sprechen wir über Twint und die Besonderheiten von Bezahlen in der Schweiz, auch im Vergleich zu anderen Zahlungslösungen. Außerdem behandeln wir Konferenzen wie die FrostCon sowie verschiedene Technikmeldungen, darunter Telegram, Windows 11, OnePlus und die EU-Chatkontrolle. Ein weiterer Schwerpunkt liegt auf KI, neuen Modellen und der Kritik an Vibe-Coding. Zum Schluss gehen wir auf Sicherheitslücken, Infrastrukturthemen und einige Bastel- und 3D-Druck-Themen ein."

comments: true
categories: talk
sharing: true
published: true
chapters: https://download.binaergewitter.de/2026-07-17.Binaergewitter.Talk.384.chapters.txt
transcript: https://download.binaergewitter.de/2026-07-17.Binaergewitter.Talk.384-speech.json
audioformats:
  mp3: https://download.binaergewitter.de/2026-07-17.Binaergewitter.Talk.384.mp3
  ogg: https://download.binaergewitter.de/2026-07-17.Binaergewitter.Talk.384.ogg
  opus: https://download.binaergewitter.de/2026-07-17.Binaergewitter.Talk.384.opus
voices:
  l33tname: false
  madmas: true
  ingo: false
  felix: true
  sebastian: true
---
In dieser Folge sprechen wir über Twint und die Besonderheiten von Bezahlen in der Schweiz, auch im Vergleich zu anderen Zahlungslösungen. Außerdem behandeln wir Konferenzen wie die FrostCon sowie verschiedene Technikmeldungen, darunter Telegram, Windows 11, OnePlus und die EU-Chatkontrolle.
Ein weiterer Schwerpunkt liegt auf KI, neuen Modellen und der Kritik an Vibe-Coding. Zum Schluss gehen wir auf Sicherheitslücken, Infrastrukturthemen und einige Bastel- und 3D-Druck-Themen ein.

## Blast from the Past

- [werotracker]( https://www.werotracker.eu/ )
- Sebastian bezahlt mit Wero!
- Wäre es nicht vertrauenswürdiger, einfacher, günstiger wenn man ein Tool schreiben würde, das mit logik die
  informationen ermittelt und ein code-graph erstellt?
- [Codebase-memory-mcp]( https://github.com/DeusData/codebase-memory-mcp )
- [Für Sebi: Studio-Link binary patch]( https://cgit.euer.krebsco.de/makefu/nixos-config/src/branch/master/5pkgs/studio-link/patch-webui.py )
- [BGT Sentiment]( https://github.com/Binaergewitter/bgt-sentiment )

```
$ nix run .#summary -- speech/2026-07-17.Binaergewitter.Talk.384-sentiment.json --bar
Episode: 2026-07-17.Binaergewitter.Talk.384
        Lustig <--------------------> Ernst
    mean       |#########-----------|  4.39
    Felix      |########------------|  3.96
    Ingo       |######--------------|  2.79
    Markus     |##############------|  7.00
    Sebastian  |#######-------------|  3.68
    l33tname   |###########---------|  5.60
        AI Gut <--------------------> AI Schlecht
    mean       |##########----------|  5.18
    Felix      |#########-----------|  4.64
    Ingo       |############--------|  5.93
    Markus     |############--------|  6.00
    Sebastian  |######--------------|  2.91
    l33tname   |##############------|  6.86
```

## Toter der Woche

- [A founder of Assassin’s Creed maker Ubisoft killed in a plane crash in western France](https://apnews.com/article/france-assassins-creed-ubisoft-plane-crash-2df2ea469c3fca0a45c38ae8805a6033)
- Der PlayStation Store auf PS3 und PS Vita schließt im Juli 2027
  - [Physische Medien für Sony Playstation]( https://arstechnica.com/gaming/2026/07/sony-will-stop-making-physical-copies-of-playstation-games-in-2028/ )
  - [Online TV Recorder]( https://de.wikipedia.org/wiki/OnlineTVRecorder )
- [Plex Lifetime]( https://www.plex.tv/blog/new-lifetime-plex-pass-pricing/ )
- [Cern](  )

## Untoter der Woche

- [Mageia]( https://linuxnews.de/mageia-10-haelt-32-bit-unterstuetzung-aufrecht/ )
- [Untoter der Woche: Qualcomm Linux 2.0 / Dragonwing](https://www.heise.de/news/Qualcomm-Linux-Neustart-fuer-Dragonwing-Plattform-11341860.html)

## DotCom der Woche

- [Einspruch gegen Auslieferung gescheitert]( https://www.heise.de/news/Kim-Dotcom-scheitert-erneut-mit-Einspruch-gegen-Auslieferung-11351181.html )
  - [2016 Dotcom macht mit sich selbst ein Kind und es ist großartig]( https://blog.binaergewitter.de/2016/08/11/binaergewitter-talk-number-154-dotcom-macht-mit-sich-selbst-ein-kind-und-es-ist-grossartig/ )
  - [2018 BGT 191 Kim ist unser Elon Musk]( https://blog.binaergewitter.de/2018/02/08/binaergewitter-talk-number-191-kim-ist-unser-elon-musk/ )

## AI der Woche

- [Why AI Tokens are so expensive (video)]( https://www.youtube.com/watch?v=-0HRzXk8vlk )
- [Fable 5 ist wieder Da!!!]()
- [Midjourney macht Körperscanner]( https://www.heise.de/news/Midjourney-Nach-KI-Bildgenerator-nun-ein-Koerperscanner-fuer-die-Menschheit-11336817.html )

## News

- [AI Seed scam]( https://archive.is/zXR4g )
  - [original link]( https://www.404media.co/scammers-sell-seeds-for-exotic-ai-generated-flowers-that-dont-exist/ )
- [Heise: EuGH bestätigt Rekordstrafe gegen Google wegen Android-Praktiken](https://www.heise.de/news/EuGH-bestaetigt-Rekordstrafe-gegen-Google-wegen-Android-Praktiken-11351395.html)
- [Mit 2.000 alten Smartphones: Forscher bauen funktionsfähiges Rechenzentrum](https://t3n.de/news/2000-alte-pixel-smartphones-forscher-rechenzentrum-1748440/)
- [74k Firewalls geknackt]( https://www.heise.de/news/Massiver-Angriff-auf-Fortinet-Firewalls-74-000-Geraete-von-FortiBleed-betroffen-11336220.html )
- [Mecklenburg-Vorpommern setzt "komplett" auf Open Source und Nextcloud](https://mastodon.social/@Karlitschek/116854853808480500)
- [LHC run 3 shutdown]( https://home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/ )
- [Brasilien Alarm an alle Leute]( https://news.ycombinator.com/item?id=48612502 )
- [NixOS Trademark]( https://discourse.nixos.org/t/announcing-nixos-trademark/78585 )
- [Rust startet kommerzielles Netzwerk \(RCN\)](https://www.heise.de/news/Rust-startet-kommerzielles-Netzwerk-11344130.html)

## 3D-Druck der Woche

- [Oomwoo]( https://3druck.com/case-studies/oomwoo-open-source-saugroboter-aus-dem-3d-drucker-mit-ros-2-und-raspberry-pi-09159396/ )
  - [Valetudo]( https://valetudo.cloud/ )
- [Adapter hdd-ssd 2.5 auf 3.5]( https://makerworld.com/de/models/178624-adapter-hdd-ssd-2-5-to-3-5#profileId-196803 )
- [Kugel]( https://makerworld.com/en/models/1129488-sphere-support-free-smooth-surface#profileId-1129474 )

## Lesefoo

- [Diving into the depths of Widevine L3]( https://neodyme.io/en/blog/widevine_l3/#profit )

## Picks

- [Ponytail](https://github.com/DietrichGebert/ponytail)
- [make look scanned]( https://github.com/overflowy/make-look-scanned )
- [Heise: DHL lässt Fracht über den Atlantik segeln](https://www.heise.de/news/DHL-laesst-Fracht-ueber-den-Atlantik-segeln-11343137.html)
- [Release Please](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Jazz Sketch](https://jazzsketch.gumroad.com/l/jazz-sketch?a=399260275)
- [Lord of the Weed]( https://www.youtube.com/watch?v=0gsvJSH7nK0 )
