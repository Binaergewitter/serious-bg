---
layout: post
title: "Binärgewitter Talk #382: Skin für VS Code"
date: 2026-06-21 15:00:00
description: "In dieser Ausgabe sprechen wir zunächst über Rückmeldungen zur letzten Sendung und über die Frage, wie digitale Souveränität bei Zahlungen, Banken und Finanzbildung praktisch aussehen kann. Außerdem behandeln wir aktuelle technische Themen wie Cursor, alte P2P-Projekte, lokale LLM-Nutzung auf Apple-Hardware sowie Tools zur Analyse großer Codebasen und zum statistischen Testen nicht-deterministischer Systeme. Im weiteren Verlauf geht es um mehrere Sicherheits- und Open-Source-Themen, darunter einen FreeBSD-Exploit, eine Schwachstelle im Arch User Repository, Systemd als CNA für CVE-Nummern und Probleme mit KI-Agenten in Fedora. Wir sprechen außerdem über Public Money, Public Code, den Umstieg auf Linux in Frankreich, Secure Boot und auslaufende Zertifikate sowie über verschiedene Hardware-, Smart-Home- und 3D-Druck-Projekte."

comments: true
categories: talk
sharing: true
published: true
chapters: https://download.binaergewitter.de/2026-06-19.Binaergewitter.Talk.382.chapters.txt
transcript: https://download.binaergewitter.de/2026-06-19.Binaergewitter.Talk.382-speech.json
audioformats:
  mp3: https://download.binaergewitter.de/2026-06-19.Binaergewitter.Talk.382.mp3
  ogg: https://download.binaergewitter.de/2026-06-19.Binaergewitter.Talk.382.ogg
  opus: https://download.binaergewitter.de/2026-06-19.Binaergewitter.Talk.382.opus
voices:
  l33tname: true
  madmas: true
  ingo: false
  felix: true
  sebastian: true
---
In dieser Ausgabe sprechen wir zunächst über Rückmeldungen zur letzten Sendung und über die Frage, wie digitale Souveränität bei Zahlungen, Banken und Finanzbildung praktisch aussehen kann. Außerdem behandeln wir aktuelle technische Themen wie Cursor, alte P2P-Projekte, lokale LLM-Nutzung auf Apple-Hardware sowie Tools zur Analyse großer Codebasen und zum statistischen Testen nicht-deterministischer Systeme.
Im weiteren Verlauf geht es um mehrere Sicherheits- und Open-Source-Themen, darunter einen FreeBSD-Exploit, eine Schwachstelle im Arch User Repository, Systemd als CNA für CVE-Nummern und Probleme mit KI-Agenten in Fedora. Wir sprechen außerdem über Public Money, Public Code, den Umstieg auf Linux in Frankreich, Secure Boot und auslaufende Zertifikate sowie über verschiedene Hardware-, Smart-Home- und 3D-Druck-Projekte.

## Blast from the Past

https://social.guelker.eu/@quintus/statuses/01KTHPY18K784J6XEBMVQ2ZF2Z
Ausführlicher Kommentar zur Schutzwürdigkeit von vibecodetem Code

- [Wero Kommentar]( https://blog.binaergewitter.de/2026/06/05/binaergewitter-talk-number-381/#isso-2746 )
- [Commerzbank Wero]( https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/bezahldienst-warum-die-commerzbank-doch-bei-wero-mitmacht/100199454.html )

## Toter der Woche
- [Lagerplatz für ausgemusterte Telefonzellen in Michendorf wird aufgelöst]( https://www.tagesschau.de/inland/regional/brandenburg/rbb-lagerplatz-fuer-ausgemusterte-telefonzellen-in-michendorf-wird-aufgeloest-100.html )
- [Motorola WiFi]( https://mashable.com/tech/motorola-wifi-routers-stop-working-motosync-plus-app-down )

## Untoter der Woche

- [Cursor to be aquired by SpaceX]( https://arstechnica.com/ai/2026/06/spacex-will-acquire-coding-tool-cursor-to-compete-with-anthropic-openai/ )
  * [Factory New Karambit Case Hardened Pattern #387 ($2.5 million+)]( https://skinflow.gg/blog/most-expensive-csgo-skin )
- [aMule 3.0.0]( https://amule-org.github.io/changelog/3.0.0 )
- [uhub 0.6.0]( https://github.com/janvidar/uhub/releases/tag/0.6.0 )

## AI der Woche

- [Google Gemma 4: Multi-Token Prediction beschleunigt lokale KI um bis zu 3x](https://www.it-daily.net/shortnews/google-gemma-4-das-dreifache)
Frage: **wie wird google gemma ausgesprochen? das ai ding**
Google Gemini über Google Gemma:
```
Das KI-Modell von Google wird genau so ausgesprochen, wie man es schreibt: „Dschemma“ (mit einem weichen „Dsch“-Laut am Anfang, wie bei Gemma Arterton oder dem englischen Namen Jamal).
Das „e“ wird kurz gesprochen und das „mm“ wie ein ganz normales, doppeltes M.
Es leitet sich übrigens vom lateinischen Wort für „Edelstein“ ab. Also nicht wundern, wenn du im englischen Sprachraum oft die Parallele zu „Gem“ (engl. für Edelstein) hörst!
```
Google Gemma über Google Gemma:
```
Google Gemma wird im Grunde genau so ausgesprochen, wie man es im Deutschen lesen würde:
[ˈɡɛma]
Hier ist die detaillierte Aufschlüsselung:

    Das G: Ein hartes G, wie in „Garten“ oder „gut“ (nicht wie ein „Dsch“).

    Das e: Ein kurzes e, wie in „Bett“.

    Das mma: Ganz normal wie im Deutschen.

Zusammengefasst: Es klingt fast identisch mit dem weiblichen Vornamen Gemma.
Ein kleiner Hinweis zum Hintergrund:
Das Wort kommt aus dem Lateinischen und bedeutet „Edelstein“ (englisch: gem). Da Google ein US-Unternehmen ist, sprechen sie das „a“ am Ende oft etwas kürzer und neutraler aus (eher wie ein „uh“-Laut), aber mit der deutschen Aussprache liegst du völlig richtig und jeder wird dich verstehen.
```

- https://github.com/AdamBien/lightmetal
  - ["Nicht so OpenSource"]( https://github.com/goauthentik/authentik )
- [Understand Anything - API Test](https://understand-anything.com/)
- [PUnit: Propibalistic Testing]( https://github.com/mavai-org/punit ) - [feotest for Rust]( https://github.com/mavai-org/feotest )

## News

- [BUMSRAKETE]( https://bumsrake.de/ )
- [FreeBSD 15.1]( https://www.freebsd.org/releases/15.1R/relnotes/ )
- [AURcalypse]( https://jguer.space/blog/2026-06-15-yay-v13 )
- [ReactOS spielt Half-Life]( https://www.phoronix.com/news/ReactOS-Running-Half-Life )
- [swisscom ipv6]( https://community.swisscom.ch/d/861354-ipv6-via-5g )
- [SPARK: Open-Source-KI soll Genehmigungszeiten halbieren](https://www.golem.de/news/open-source-ki-soll-genehmigungszeiten-bei-infrastrukturprojekten-halbieren-2606-209935.html)
- [Avira Antivirus hacking]( https://www.heise.de/news/Praeparierte-PDF-Datei-kann-Avira-Antivirus-gefaehrlich-werden-11332323.html )
- [systemd ist CNA]( https://www.cve.org/PartnerInformation/ListofPartners/partner/systemd )
- [AI agenten bei Fedora]( https://lwn.net/Articles/1077035/ )
- [Audacity Feature Survey]( https://audacityteam.org/survey )
- [EVB-IT Reform: Open Source als Regelfall bei öffentlicher Beschaffung](https://www.heise.de/hintergrund/Erneuerung-der-Vertragsmuster-fuer-IT-Beschaffung-Open-Source-als-Regelfall-11300824.html)
  - [Abrufbar]( evb-it.gov.de )
- [Digitale Souveränität: Frankreich ersetzt 25 millionen Win durch Linux]( https://www.assetware-technology.com/de/frankreich-ersetzt-25-millionen-windows-rechner-durch-linux-eine-detaillierte-ubersicht-uber-den-wechsel/ )

## Themen

- [SecureBoot Deadline to upgrade]( https://arstechnica.com/security/2026/06/windows-and-linux-users-the-deadline-to-update-secure-boot-keys-is-near/ )
- [Windräder]( https://www1.wdr.de/nrw/niederrhein/kreis-kleve/forscher-kleve-windrad-ahornprinzip-100.html )

## 3D-Druck der Woche

- [Unterlegscheibe für Treppe](https://cad.onshape.com/documents/c89566c47fdbaa3486e92690/w/fd8b615433e119f4a7b8af37/e/fd3a5085a2c6afff5482e535?renderMode=0&uiState=6a35a7b2c68ee69fbb8eb387) -> Link bringt Loginfenster - gibts das auch ohne Login? <- Probier bitte nochmal
- [Ladestecker Halterung]( https://makerworld.com/de/models/610216-ev-charger-typ-2-wall-mount#profileId-533244 )
  - [Ikea Samla Clips "never lost"]( https://makerworld.com/en/models/89815-ikea-samla-22l-clip-never-lost )

## Mimimi der Woche

- [py-setuptools]( https://bugs.freebsd.org/bugzilla/show_bug.cgi?id=270358 )
- Hetzner Storagebox
- [Storage Box Preise]( https://www.hetzner.com/de/storage/storage-box/ )

## Lesefoo

- [An interactive introduction to the terrific experience of rendering Arabic typography and its technical debt]( https://lr0.org/blog/p/arabic/ )
- ["Übergewinne" bei Stromnetzbetreibern]( https://www.tagesschau.de/investigativ/swr/stromnetzbetreiber-rendite-100.html )
  - [Demonstrationen für die Energiewende vom 18.4.]( https://www1.wdr.de/nrw/koeln/demonstration-energiewende-100.html ) [Tagesschau]( https://www.tagesschau.de/inland/gesellschaft/energiewende-proteste-100.html )

## Picks
- [tinywind]( https://tinywind.io/play?firstvisit=1 )
- [Git is not the only option (video)]( https://www.youtube.com/watch?v=GQ15U4NJftA )
- [Glitch Graveyard]( https://trash-can.net/ )
- [SpectrumKNX]( https://github.com/martinhoefling/SpectrumKNX )
- [jura-connect]( https://github.com/makefu/jura-connect-hass )
  - [ha-mcp]( https://github.com/homeassistant-ai/ha-mcp )
- [Diagnosegerät für Maker und Hardware-Entwickler](https://www.heise.de/news/Dieses-Tool-spuert-I2C-Probleme-in-Sekunden-auf-11329380.html)
- [Debugging The Nokia Streaming Box 8000]( https://l33tsource.com/blog/2026/06/14/Debugging-the-Nokia-Streaming-box-8000/ )
- [Holz schlagen]( https://screen.toys/firewood/ )
