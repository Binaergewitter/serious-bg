---
layout: post
title: "Binärgewitter Spezial #4 - Distributed Computing"
date: 2012-05-17 15:30
comments: true
categories: spezial
sharing: true
audioformats:
  mp3: http://download.binaergewitter.de/2012-05-17.Binaergewitter.Spezial.4.mp3
  ogg: http://download.binaergewitter.de/2012-05-17.Binaergewitter.Spezial.4.ogg
---
BOINC gibt es zwar schon lange und es wird immer noch viel benutzt. Felix und Ingo sprechen mit Torbjörn und Andreas über den Rechenkraft.net e.V., Distributed Computing, BOINC, Einsatzszenarien und 
Alternativen zu BOINC.

- WP: [verteiltes Rechnen](https://de.wikipedia.org/wiki/Verteiltes_Rechnen)
- WP: [Bitcoin](https://de.wikipedia.org/wiki/Bitcoin )
- WP: [Cloud](https://de.wikipedia.org/wiki/Cloud_Computing )
- [BOINC Treffen](http://www.boinctreffen.de ) / 17-20.5.2012
* Kategorien:
    - Distributed Computing - SETI@Home
    - Distributed Thinking - [openstreetmap]( http://www.openstreetmap.org/ )
     * die [Zooniverse](http://www.zooniverse.org/ )-Projekte
     *  [Distributed Proofreaders](http://www.pgdp.net/c/) / [Project Gutenberg](http://www.gutenberg.org/ )
     *  [SciStarter](http://www.scistarter.com/ ): Datenbank zahlreicher "Handarbeits"-Citizen-Science-Projekte
    - Citizen Science - [Solar Stormwatch](http://www.solarstormwatch.com/ )
##BOINC
- [Berkeley Open Infrastructure for Network Computing](http://boinc.berkeley.edu/ )
- entwicklet von *Dr. David Anderson* am [Space Science Laboratory](http://ssl.berkeley.edu/ ) der *University of California, Berkeley*
- plattformunabhängiges Server-Client-Framework
- Server
  - hauptsächlich in C geschrieben
  - Webfrontent in PHP
  - MySQL als Datenbank
  - Konfiguration über ein XML-File
  - LGPL
- Client
  - in C geschrieben
  - bestehend aus
     - dem Kommandozeilen-Clienten (boinc) selbst (kann auch als Daemon laufen)
     - dem Kommandozeilen-Commander (boinccmd), um per Kommandozeile einen laufenden Clienten zu administrieren
     - dem grafischen BOINC-Manager (boincmgr), um grafisch einen laufenden Clienten zu managen
     - Commander und Manager können auch zu entfernten Clienten verbinden (z.B. mehrere Maschinen im LAN, aber nur ein Managing-Node)
  - Konfiguration ebenfalls über ein XML-File
- Anwendungen für die eigentlichen Berechnungen werden von einzelnen Projekten bereitgestellt
  - drei Typen von Apps: klassische CPU, low CPU und [GPU](https://boinc.berkeley.edu/wiki/GPU_computing )
      * GPU -> [CUDA(Nvidia)](https://en.wikipedia.org/wiki/CUDA ) und Stream(ATI), sowie [OpenCL](https://en.wikipedia.org/wiki/OpenCL )
  - CPU-Anwendungen können (rein theorerisch) auch [SMP]( http://en.wikipedia.org/wiki/Symmetric_multiprocessing ) sein, in der Praxis haben sich jedoch einige Probleme seitens BOINC damit gezeigt
- Nachteile von BOINC
    * Sicherheit
    * [3D im Browser]( http://de.wikipedia.org/wiki/WebGL )

###BOINC-Alternativen
- einzig uns bekannte: [MAGE - Marburg Ad-hoc Grid Environment](http://www.uni-marburg.de/fb12/verteilte_systeme/forschung/grid_tools )
- entwickelt von Arbeitsgruppe um *Prof. Dr. Bernd Freisleben* an der Universität Marburg, Fachbereich Mathematik und Informatik
- einige (wenige) Projekte nutzen ein individuell entwickletes Server-Client-Framework
  (z.B. [Folding@Home](http://folding.stanford.edu/ ), [Distributed.net](http://www.distributed.net/Main_Page ),
  [Muon](http://www.stephenbrooks.org/muon1/ ))
 
###Anwendungen
- Jedes computational Problem, das sich in viele voneinander unabhängiger Pakete unterteilen lässt und die 
  Datenmenge pro Paket nicht zu groß ist, ist für BOINC prädestiniert
  - Positivbeispiel: Primfaktorzerlegung, Signalanalyse, Rendern
  - Negativbeispiel: Crashtest-Simulation (zu enge Abhängigkeit der Daten), Particle-Tracking (zu große Datenmenge)
  - Stichwort [Embarrassingly Parrallel]( http://en.wikipedia.org/wiki/Embarrassingly_parallel )
- bestehende Programme können in BOINC eingehangen werden ([BOINCWrapper](http://boinc.berkeley.edu/trac/wiki/WrapperApp ))
  - z.B. [Autodock - Molecular Modeling]( http://en.wikipedia.org/wiki/AutoDock )
- [eine relativ vollständige List aller DC-Projekte im Rechenkraft.net-Wiki](https://www.rechenkraft.net/wiki/index.php?title=Projekt%C3%BCbersicht )

###BOINC-Projekte
- die Urgesteine
  - [SETI@Home](http://setiathome.berkeley.edu/ ): Radiosignale nach Außerirdischen durchsuchen
  - [Distributed.net](http://www.distributed.net/Main_Page ): Encryption knacken, Optimalen 
    Gulomb-Maßstab berechnen
  - [Folding@Home](http://folding.stanford.edu ): Proteine falten (auch mit PS3 und GPUs)
- deutsche Aushängeschilder
  - [Einstein@Home](http://einstein.phys.uwm.edu/ ): Gravitationswellen suchen, Radiopulsare finden
  - [POEM@Home](http://boinc.fzk.de/poem/ ): Proteine falten
  - [RNA World](http://www.rnaworld.de/rnaworld/ ): RNAs finden und klassifizieren
- Sensorprojekte
  - [Quake Catcher Network](http://qcn.stanford.edu/ ): Erdbeben erkennen und melden
  - [AirQualityEgg]( http://www.kickstarter.com/projects/edborden/air-quality-egg )
  - [Radioactive@Home](http://radioactiveathome.org/boinc/ ): Radioaktive Strahlung messen und melden
  - [Distributed Rainbow Tables]( http://www.freerainbowtables.com/ ): Rechnen an Rainbow Tables for the greater good

##Rechenkraft.net e.V.
- [Rechenkraft.net](http://rechenkraft.net)
   - [Yoyo@Home](http://www.rechenkraft.net/yoyo/ ): Umbrella-/Wrapper-Projekt
     - [Evolution@Home: Simulation von Evolution](http://www.evolutionary-research.net/ )
     - [Muon: Simulationen zur Planung einer Neutrino-Fabrik](http://www.stephenbrooks.org/muon1/ )
     - [EulerNet]( http://euler.free.fr/details.htm ) (beendet)
     - ECM: Finden von großen Primfaktoren (>40 Stellen)
   - [RNA World](http://www.rnaworld.de/rnaworld ): wissenschaftliches Forschungsprojekt zur Untersuchung von RNAs
 - [Constellation](http://aerospaceresearch.net/constellation/ )
 - Citizen Science
   - [iBats](http://www.ibats.org.uk ): mit dem iPhone Fledermäuse tracken
   - [DontFlushMe](http://www.dontflush.me): für weniger Sch\*\*\*\* im Hudson River (New York)
 - [Boincoid]( http://boincoid.sourceforge.net/ ): BOINC-Clienten übers Smartphone managen
 - [NativeBOINC]( http://krzyszp.info/index.php?option=com_content&view=article&id=29:nativeboinc-for-android&catid=7:linux&Itemid=6 ): derzeit wohl beste Android-Client mit Unterstützung für Milkyway@Home, PrimeGrid, Enigma@Home und Radioactive@Home

