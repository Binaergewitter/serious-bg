---
layout: post
title: "Binärgewitter Spezial #7: NixOS"
date: 2017-09-24 16:00
comments: true
categories: spezial
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.mp3
  ogg: http://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.ogg
  m4a: http://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.m4a
  opus: http://download.binaergewitter.de/2017-09-20.Binaergewitter.Spezial.7.opus
---
Endlich ist sie da. Die Spezial Sendung zu NixOS. Felix und Jörg sind NixOS Jünger und lassen sich von Ingo mal befragen wie Nix und NixOS so funktionieren.

## Was ist Nix?
- Vieles aber vorallem ein Packetmanager für Linux und andere unixoide Systeme
- Gleiche Liga wie apt (debian-alike), pacman (archlinux), dnf (fedora)
- Aber einzigartige Funktionen, u.a

## Wie funktioniert das? Beispiel: Apt

## Funktionales Paketmanagement

## Nix-Projekt
- **Nix:** 
- **Nixpkgs:**
- **NixOS:** 
- **Hydra**
- **NixOps**

## Nixos-Konfiguration

- deklarative Konfiguration
- Konfigurationsmanagement für lau

## Nix - Funktionsweise

- Idee: Alle packages werden isoliert voneinander:
- `/nix/store/rpdqx...-firefox-3.5.4`
- Pfad: 160-bit kryptografischen Hash aller Packetabhängigkeiten:
  - Quellen, Bibliotheken, Kompiler, Buildskripte

## Nix - Expressions

- Nix packete werden mit Nix gebaut!
- jede Packetbeschreibung eine Funktion 
    - Eingabe: Abhängigkeiten des Packetes
    - Ausgabe: Derivation -> Pfad
- kennt die Reihenfolge: Baut Abhängigkeiten vorher selbst (keine Zyklen)
- implizite Laufzeitabhängigkeiten
- (dev/bin/debug/man) outputs
- lazy evaluation

## Nixpkgs

- github.com/NixOS/nixpkgs
- \>13.000 Packete für x86_64 linux
  - https://github.com/NixOS/nixpkgs/graphs/contributors
- https://nixos.org/nixos/packages.html
- Abstraktionen für die meisten Buildsysteme
  - (\*alle\* Haskellpakete)
- Aktuelle unterstützte Platformen (Binärpakete)
  * Linux: (legacy: i686), x86_64, (aarch64)
  * Mac OS X: x86_64
- bietet Abstraktion (Magie) für Buildsysteme/Sprachspezifische Packetmanager
    - Pakete sind einfach zu bauen

## nixpkgs/nixos

- NixOS ist Bestandteil von Nixpkgs
- 689 Module:

## Hydra

## Entwicklungsumgebungen (nix-shell)

## NixOps
- [NixOps](https://nixos.org/nixops/ )

## Features in der Zukunft

- Ende Oktober NixCon in München
- Ende September: 17.09
- PR für besseres Cross-Kompilieren (z.B. arm32)
- nix 1.12

## Wie fange ich mit nix an

- Paketmanager auch unabhängig von NixOS
- kann man in die shell pipen oder per Paketmanager installieren (AUR)
- sudo install -d -m755 -o $USER -g $USER /nix
- `curl https://nixos.org/nix/install | sh`
- Auch ohne root nutzbar (Uni-Cluster -> besser als modules) -> Wikilink
- Handbuch, [Wiki](https://nixos.wiki), IRC, [Nix Pills](https://nixos.org/nixos/nix-pills/index.html)
