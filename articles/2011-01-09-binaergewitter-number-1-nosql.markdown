---
layout: post
title: "Binaergewitter #1 - NoSQL"
date: 2011-01-09 09:17
comments: true
categories: spezial
audioformats:
  mp3: http://download.binaergewitter.de/2011-01-08.RadioTux.Binaergewitter.NoSQL.mp3
  ogg: http://download.binaergewitter.de/2011-01-08.RadioTux.Binaergewitter.NoSQL.ogg
---
# Binaergewitter #1 - NoSQL - Binärgewitter

Die erste Ausgabe unseres neuen Formats beschäftigt sich mit Datenbanken und NoSQL. Diese neuen Datenbanken waren im Jahr 2010 schon Hype und werden uns sicher auch im Jahr 2011 stark begleiten. Warum soll man aber diese Datenbanken einsetzen? Welche gibt es und welche Stärken und Schwächen haben diese? Das versuchen [Dirk](http://twitter.com/ddeimeke), [Marc](http://twitter.com/rb2k), [Sven](http://twitter.com/pfleidi) und [Ingo](http://twitter.com/radiotux) in 2,75 Stunden zu klären.

**Shownotes / Timeline und Links**

*   Vorstellung der Teilnehmer / Kurze Erklärung von NoSQL 
*   Grundlegende Einsatzgebiete von Datenbanken 
    1.  Persistenz von (Anwendungs)daten 
        1.  Unterschied/Gemeinsamkeit Dateisystem  Datenbank
        2.  Datensicherheit - WP: [ACID](http://en.wikipedia.org/wiki/ACID)
        3.  Verteilung
    2.  Suchen 
        1.  Via Indexierung ([B+ Tree](http://de.wikipedia.org/wiki/B%2B-Baum))
        2.  Volltextsuche
    3.  Navigation über Daten (Joins)
    4.  Reporting
*   Grundlegende Klärung der Bezeichnung NoSQL
*   Grenzen von DBs ([CAP-Theorem](http://de.wikipedia.org/wiki/CAP-Theorem))
*   Unterschiede SQL/NoSQL 
    1.  Grober Unterschied
    2.  Zeilen/Spalten vs. Key-Value, Column-Stores, Dokumente, Graphen 
        1.  [JSON](http://de.wikipedia.org/wiki/JSON)
        2.  [Resource Description Framework](http://de.wikipedia.org/wiki/Resource_Description_Framework)
        3.  [Sendung über GraphDB](http://blog.radiotux.de/2010/12/13/sendung-graphdb/)
*   Patterns bei der Implementierung 
    1.  Papers: Stonebreaker 
[Paper: "The End Of An Architectural Era"](http://highscalability.com/blog/2009/4/16/paper-the-end-of-an-architectural-era-its-time-for-a-complet.html), [Amazon Dynamo](http://s3.amazonaws.com/AllThingsDistributed/sosp/amazon-dynamo-sosp2007.pdf) (KeyValue), 
[Google Bigtable](http://static.googleusercontent.com/external_content/untrusted_dlcp/labs.google.com/en//papers/bigtable-osdi06.pdf) (ColumnStore), 
[Map/Reduce](http://de.wikipedia.org/wiki/MapReduce), 
[Dremel](http://www.google.com/research/pubs/pub36632.html), 
CAP, 
[Cassandra](http://www.cs.cornell.edu/projects/ladis2009/papers/lakshman-ladis2009.pdf)
*   Datenbanksysteme 
    1.  Vor- und Nachteile (Datenschema, Zugriff) 
        1.  Column Store: [Cassandra](http://cassandra.apache.org/)
        2.  Column Store: [HBase](http://hbase.apache.org/) (BigTable)
        3.  Datastructure Store: [Redis](http://redis.io/) 
            1.  [Redis: under the hood](http://www.pauladamsmith.com/articles/redis_under_the_hood.html)
            2.  [Redis, from the Ground Up](http://blog.mjrusso.com/2010/10/17/redis-from-the-ground-up.html)
        4.  DocumentStore: [MongoDB](http://www.mongodb.org/)
            1.  [BSON](http://bsonspec.org/)
            2.  [GridFS](http://www.mongodb.org/display/DOCS/GridFS%2BSpecification)
        5.  DocumentStore/KV Store: [CouchDB](http://couchdb.apache.org/)
            1.  [Futon](http://couchdb.apache.org/screenshots.html) + [CouchApps](http://couchapp.org/page/index)
            2.  [changes feed](http://guide.couchdb.org/draft/notifications.html) + Lucene/[ElasticSearch](http://www.elasticsearch.com/)
        6.  Key Value Store: [MemcachedDB](http://memcachedb.org/)
        7.  Key Value Store: [Riak](http://basho.com/Riak.html)
        8.  Graph Database: [Neo4J](http://neo4j.org) / [GraphDB](http://www.sones.com/)
    2.  Einsatzgebiete 
    3.  [Polyglot Persistence](http://codemonkeyism.com/nosql-polyglott-persistence/)
*   Ende
