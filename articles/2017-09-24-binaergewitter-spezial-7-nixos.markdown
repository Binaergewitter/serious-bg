---
layout: post
title: "Binärgewitter Spezial #7: NixOS"
date: 2017-09-24 16:00:00

comments: true
categories: spezial
sharing: true
audioformats:
  mp3: https://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.mp3
  ogg: https://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.ogg
  m4a: https://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.m4a
  opus: https://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.opus
---
Endlich ist sie da. Die Spezial Sendung zu NixOS. Felix und Jörg sind NixOS Jünger und lassen sich von Ingo mal befragen wie Nix und NixOS so funktionieren.

## Was ist Nix?
- Vieles aber vorallem ein Paketmanager für Linux und andere unixoide Systeme
- Gleiche Liga wie apt (debian-alike), pacman (archlinux), dnf (fedora)
- Aber einzigartige Funktionen, u.a
  - atomare Upgrades/Downgrades
  - konfliktfreie Installation verschiedener Versionen eines Paketes
  - Mehrbenutzerunterstützung

## Vergleich Apt mit Nix
- Befehl: apt install sl (die hässliche Eisenbahn)
- Lädt Paketliste
- Was muss installiert werden? (ncurses, libc)
- Versionskonflikte?
- LSB-Verzeichnisstruktur:
  - /usr/bin/sl
  - /usr/share/man/man1/sl.1.gz
- nix-shell -p sl (zum ausprobieren)
- Paketliste == nixexprs: (ein Art Bauanleitung für alle Pakete)
- berechnet Bauanleitung für sl
- checkt Binärcache
- statt LSB, berechnet Pfad für das Paket `/nix/store/<sha256-bauanleitung>-sl-<versionsnummer>`:
  - ./bin/sl
  - ./man/man1/sl.1.gz
- Bauanleitung einzigartig und vollständig -> einzigartiger Pfad

## Funktionales Paketmanagement
- Jedes Paket ist isoliert (sieht nur seine Abhängigkeiten)
- Reproduzierbar (Selbe Quellen/Befehle beim Bauen -> selbes Ergebnis)
- Generisch (nicht auf Sprache/Technologie beschränkt, baut Skripte, z.B Shell, setzt Umgebungsvariablen)
- verlässlich: alle Abhängigkeiten sind vollständig, Updates überschreiben alte Versionen nicht -> Rollbacks möglich
- Effizient: nur notwendige Schritte beim Neubauen und aktualisieren, Abhängigkeiten nur einmal vorhanden

## Nix-Projekt
- [Nix](https://nixos.org/nix/)
- [Nixpkgs](https://nixos.org/nixpkgs/)
- [NixOS](https://nixos.org/)
- [Hydra](https://nixos.org/hydra/)
- [NixOps](https://nixos.org/nixops/)

## Nixos-Konfiguration

- deklarative Konfiguration
- Konfigurationsmanagement für lau

## Nix - Funktionsweise

- Idee: Alle packages werden isoliert voneinander:
- `/nix/store/rpdqx...-firefox-3.5.4`
- Pfad: 160-bit kryptografischen Hash aller Paketabhängigkeiten:
  - Quellen, Bibliotheken, Kompiler, Buildskripte

## Nix - Expressions

- Nix Pakete werden mit Nix gebaut!
- jede Paketbeschreibung eine Funktion
    - Eingabe: Abhängigkeiten des Paketes
    - Ausgabe: Derivation -> Pfad
- kennt die Reihenfolge: Baut Abhängigkeiten vorher selbst (keine Zyklen)
- implizite Laufzeitabhängigkeiten
- lazy evaluation

## Nixpkgs

- [source on github](https://github.com/NixOS/nixpkgs)
- \>13.000 Pakete für x86_64 linux
  - [contributors](https://github.com/NixOS/nixpkgs/graphs/contributors)
- [Search NixOS packages](https://nixos.org/nixos/packages.html)
- Abstraktionen für die meisten Buildsysteme
  - (\*alle\* Haskellpakete)
- Aktuelle unterstützte Platformen (Binärpakete)
  * Linux: (legacy: i686), x86_64, (aarch64)
  * Mac OS X: x86_64
- bietet Abstraktion (Magie) für Buildsysteme/Sprachspezifische Paketmanager
    - Pakete sind einfach zu bauen

## nixpkgs/nixos

- NixOS ist Bestandteil von Nixpkgs
- 689 Module
  - Systemeinstellungen (Zeitzone, Fonts, Benutzer)
  - Services (sshd, nginx, openstack, gitlab, ...)

## Hydra

- Baut alle Pakete in nixpkgs
- selber betreibbar (binary cache) - interessant für Firmen/Gruppen
- Meisten Pakete müssen nicht selber gebaut werden:
    - allerdings einfach möglich (patches, neue Versionen aka Backports etc)

## Entwicklungsumgebungen (nix-shell)

- nix-shell liest default.nix oder shell.nix ein und startet ein bash mit konfigurierter Umgebung
  in der alle Abhängigkeiten zum Bauen sichtbar sind
- Einheitliche Abhängigkeiten, wenn man im Team arbeitet (ganz ohne docker)

## NixOps
- [NixOps](https://nixos.org/nixops/)
- dockt an verschiedene Cloud-Provider/SSH/VM-Manager:
    - AWS, GCE, Azure, Libvirt, Digitalocean, Hetzner, Virtualbox, NixOS-Container (nspawn)
- Cluster hochziehen (Maschinen erstellen, Netzwerk konfigurieren, Instanzgrößen, Platten)

## Andere coole Nix dinge

- [home-manager](https://github.com/rycee/home-manager/)
- [nix im Shebang shebang](https://gist.github.com/travisbhartwell/f972aab227306edfcfea)
- [nix closures per ssh verschicken](https://nixos.org/nix/manual/#ssec-copy-closure)
- [NixIPFS](https://github.com/NixIPFS/nixipfs-scripts)

## Features in der Zukunft

- Ende Oktober [NixCon](http://nixcon2017.org) in München
- Ende September: Release 17.09
- [PR](https://github.com/NixOS/nixpkgs/pull/26805) für besseres Cross-Kompilieren (z.B. arm32)
- nix 1.12

## Wie fange ich mit nix an

- Paketmanager auch unabhängig von NixOS nutzbar
- kann man in die shell pipen...
  - `sudo install -d -m755 -o $USER -g $USER /nix`
  - `curl https://nixos.org/nix/install | sh`
- ...oder per Paketmanager installieren ([AUR](https://aur.archlinux.org/packages/nix-multiuser/)):
- [Auch ohne root nutzbar](https://wiki.nixos.org/wiki/Nix_Package_Manager#Install_Nix_without_root_permissions)
- [Handbuch](https://nixos.org/nixos/manual/index.html), [Wiki](https://wiki.nixos.org), IRC: #nixos auf freenode, [Nix Pills](https://nixos.org/nixos/nix-pills/index.html)
