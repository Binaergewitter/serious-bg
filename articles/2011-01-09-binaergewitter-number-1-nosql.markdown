---
layout: post
title: "Binaergewitter #1 - NoSQL"
date: 2011-01-09 09:17
comments: true
categories: spezial
audioformats:
mp3: http://download.binaergewitter.de/2011-01-08.RadioTux.Binaergewitter.NoSQL.mp3
---
# Binaergewitter #1 - NoSQL - Binärgewitter

Die erste Ausgabe unseres neuen Formats beschäftigt sich mit Datenbanken und NoSQL. Diese neuen Datenbanken waren im Jahr 2010 schon Hype und werden uns sicher auch im Jahr 2011 stark begleiten. Warum soll man aber diese Datenbanken einsetzen? Welche gibt es und welche Stärken und Schwächen haben diese? Das versuchen [Dirk][1], [Marc][2], [Sven][3] und [Ingo][4] in 2,75 Stunden zu klären.

**Shownotes / Timeline und Links**

*   Vorstellung der Teilnehmer / Kurze Erklärung von NoSQL 
*   Grundlegende Einsatzgebiete von Datenbanken 
    1.  Persistenz von (Anwendungs)daten 
        1.  Unterschied/Gemeinsamkeit Dateisystem  Datenbank
        2.  Datensicherheit - WP: [ACID][5]
        3.  Verteilung
    2.  Suchen 
        1.  Via Indexierung ([B%2BTree][6])
        2.  Volltextsuche
    3.  Navigation über Daten (Joins)
    4.  Reporting
*   Grundlegende Klärung der Bezeichnung NoSQL
*   Grenzen von DBs ([CAP-Theorem][7])
*   Unterschiede SQL/NoSQL 
    1.  Grober Unterschied
    2.  Zeilen/Spalten vs. Key-Value, Column-Stores, Dokumente, Graphen 
        1.  [JSON][8]
        2.  [Resource Description Framework][9]
        3.  [Sendung über GraphDB][10]
*   Patterns bei der Implementierung 
    1.  Papers: Stonebreaker [Paper: “The End Of An Architectural Era][11]”, [Amazon Dynamo][12] (KeyValue), [Google Bigtable][13] (ColumnStore), [Map/Reduce][14], [Dremel][15], CAP, [Cassandra][16] …)
*   Datenbanksysteme 
    1.  Vor- und Nachteile (Datenschema, Zugriff) 
        1.  Column Store: [Cassandra][17]
        2.  Column Store: [HBase][18] (BigTable)
        3.  Datastructure Store: [Redis][19] 
            1.  [Redis: under the hood][20]
            2.  [Redis, from the Ground Up][21]
        4.  DocumentStore: [MongoDB][22] 
            1.  [BSON][23]
            2.  [GridFS][24]
        5.  DocumentStore/KV Store: [CouchDB ][25] 
            1.  [Futon][26] %2B [CouchApps][27]
            2.  [_changes feed ][28]%2B Lucene/[ElasticSearch][29]
        6.  Key Value Store: [MemcachedDB][30]
        7.  Key Value Store: [Riak][31] 
        8.  Graph Database: [Neo4J][32] / [GraphDB][33]
    2.  Einsatzgebiete 
    3.  [Polyglot Persistence][34]
*   Ende

 [1]: http://twitter.com/ddeimeke
 [2]: http://twitter.com/rb2k
 [3]: http://twitter.com/pfleidi
 [4]: http://twitter.com/radiotux
 [5]: http://en.wikipedia.org/wiki/ACID
 [6]: http://de.wikipedia.org/wiki/B%2B-Baum
 [7]: http://de.wikipedia.org/wiki/CAP-Theorem
 [8]: http://de.wikipedia.org/wiki/JSON
 [9]: http://de.wikipedia.org/wiki/Resource_Description_Framework
 [10]: http://blog.radiotux.de/2010/12/13/sendung-graphdb/
 [11]: http://highscalability.com/blog/2009/4/16/paper-the-end-of-an-architectural-era-its-time-for-a-complet.html
 [12]: http://s3.amazonaws.com/AllThingsDistributed/sosp/amazon-dynamo-sosp2007.pdf
 [13]: http://static.googleusercontent.com/external_content/untrusted_dlcp/labs.google.com/en//papers/bigtable-osdi06.pdf
 [14]: http://de.wikipedia.org/wiki/MapReduce
 [15]: http://www.google.com/research/pubs/pub36632.html
 [16]: http://www.cs.cornell.edu/projects/ladis2009/papers/lakshman-ladis2009.pdf
 [17]: http://cassandra.apache.org/
 [18]: http://hbase.apache.org/
 [19]: http://redis.io/
 [20]: http://www.pauladamsmith.com/articles/redis_under_the_hood.html
 [21]: http://blog.mjrusso.com/2010/10/17/redis-from-the-ground-up.html
 [22]: http://www.mongodb.org/
 [23]: http://bsonspec.org/
 [24]: http://www.mongodb.org/display/DOCS/GridFS%2BSpecification
 [25]: http://couchdb.apache.org/
 [26]: http://couchdb.apache.org/screenshots.html
 [27]: http://couchapp.org/page/index
 [28]: http://guide.couchdb.org/draft/notifications.html
 [29]: http://www.elasticsearch.com/
 [30]: http://memcachedb.org/
 [31]: http://basho.com/Riak.html
 [32]: http://neo4j.org
 [33]: http://www.sones.com/
 [34]: http://codemonkeyism.com/nosql-polyglott-persistence/