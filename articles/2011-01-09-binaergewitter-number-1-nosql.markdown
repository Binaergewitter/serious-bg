---
layout: post
title: "Binaergewitter #1 - NoSQL"
date: 2011-01-09 09:17
comments: true
categories: spezial
audioformats:
  mp3: http://download.binaergewitter.de/2011-01-08.RadioTux.Binaergewitter.NoSQL.mp3
---
Die erste Ausgabe unseres neuen Formats beschäftigt sich mit Datenbanken und NoSQL. Diese neuen Datenbanken waren im Jahr 2010 schon Hype und werden uns sicher auch im Jahr 2011 stark begleiten. Warum soll man aber diese Datenbanken einsetzen? Welche gibt es und welche Stärken und Schwächen haben diese? Das versuchen <a href="http://twitter.com/ddeimeke" target="_blank">Dirk</a>, <a href="http://twitter.com/rb2k" target="_blank">Marc</a>, <a href="http://twitter.com/pfleidi" target="_blank">Sven</a> und <a href="http://twitter.com/radiotux" target="_blank">Ingo</a> in 2,75 Stunden zu klären.

<strong>Shownotes / Timeline und Links</strong>
<div>
<ul id="internal-source-marker_0.9715123863425106">
<li>Vorstellung der Teilnehmer / Kurze Erklärung von NoSQL
<ul>
<li>Marc: Masterthesis: <a href="http://blog.marc-seeger.de/2010/12/09/my-thesis-building-blocks-of-a-scalable-webcrawler">building blocks of a scalable webcrawler</a></li>
</ul>
</li>
<li>Grundlegende Einsatzgebiete von Datenbanken
<ol>
<li>Persistenz von (Anwendungs)daten
<ol>
<li>Unterschied/Gemeinsamkeit Dateisystem &lt;--&gt; Datenbank</li>
<li>Datensicherheit - WP: <a href="http://en.wikipedia.org/wiki/ACID">ACID</a></li>
<li>Verteilung</li>
</ol>
</li>
<li>Suchen
<ol>
<li>Via Indexierung (<a href="http://de.wikipedia.org/wiki/B%2B-Baum" target="_blank">B+Tree</a>)</li>
<li>Volltextsuche</li>
</ol>
</li>
<li>Navigation über Daten (Joins)</li>
<li>Reporting</li>
</ol>
</li>
<li>Grundlegende Klärung der Bezeichnung NoSQL</li>
<li>Grenzen von DBs (<a href="http://de.wikipedia.org/wiki/CAP-Theorem" target="_blank">CAP-Theorem</a>)</li>
<li>Unterschiede SQL/NoSQL
<ol>
<li>Grober Unterschied</li>
<li>Zeilen/Spalten vs. Key-Value, Column-Stores, Dokumente, Graphen
<ol>
<li><a href="http://de.wikipedia.org/wiki/JSON">JSON</a></li>
<li><a href="http://de.wikipedia.org/wiki/Resource_Description_Framework">Resource Description Framework</a></li>
<li><a href="http://blog.radiotux.de/2010/12/13/sendung-graphdb/">Sendung über GraphDB</a></li>
</ol>
</li>
</ol>
</li>
<li>Patterns bei der Implementierung
<ol>
<li>Papers: Stonebreaker <a href="http://highscalability.com/blog/2009/4/16/paper-the-end-of-an-architectural-era-its-time-for-a-complet.html">Paper: “The End Of An Architectural Era</a>”, <a href="http://s3.amazonaws.com/AllThingsDistributed/sosp/amazon-dynamo-sosp2007.pdf" target="_blank">Amazon Dynamo</a> (KeyValue), <a href="http://static.googleusercontent.com/external_content/untrusted_dlcp/labs.google.com/en//papers/bigtable-osdi06.pdf " target="_blank">Google Bigtable</a> (ColumnStore), <a href="http://de.wikipedia.org/wiki/MapReduce" target="_blank">Map/Reduce</a>, <a href="http://www.google.com/research/pubs/pub36632.html" target="_blank">Dremel</a>, CAP, <a href="http://www.cs.cornell.edu/projects/ladis2009/papers/lakshman-ladis2009.pdf">Cassandra</a> …)</li>
</ol>
</li>
<li>Datenbanksysteme
  <ol>
<li>Vor- und Nachteile (Datenschema, Zugriff)
  <ol>
  <li>Column Store: <a href="http://cassandra.apache.org/" target="_blank">Cassandra</a></li>
  <li>Column Store: <a href="http://hbase.apache.org/" target="_blank">HBase</a> (BigTable)</li>
  <li>Datastructure Store: <a href="http://redis.io/" target="_blank">Redis</a>
  <ol>
  <li><a href="http://www.pauladamsmith.com/articles/redis_under_the_hood.html">Redis: under the hood</a></li>
  <li><a href="http://blog.mjrusso.com/2010/10/17/redis-from-the-ground-up.html">Redis, from the Ground Up</a></li>
  </ol>
  </li>
  <li>DocumentStore: <a href="http://www.mongodb.org/" target="_blank">MongoDB</a>
  <ol>
  <li><a href="http://bsonspec.org/">BSON</a></li>
  <li><a href="http://www.mongodb.org/display/DOCS/GridFS+Specification">GridFS</a></li>
  </ol>
  </li>
  <li>DocumentStore/KV Store: <a href="http://couchdb.apache.org/" target="_blank">CouchDB </a>
  <ol>
  <li><a href="http://couchdb.apache.org/screenshots.html">Futon</a> + <a href="http://couchapp.org/page/index">CouchApps</a></li>
  <li><a href="http://guide.couchdb.org/draft/notifications.html">_changes feed </a>+ Lucene/<a href="http://www.elasticsearch.com/">ElasticSearch</a></li>
  </ol>
  </li>
  <li>Key Value Store: <a href="http://memcachedb.org/" target="_blank">MemcachedDB</a></li>
  <li>Key Value Store: <a href="http://basho.com/Riak.html" target="_blank">Riak</a>
  <ul>
  <li><a href="http://www.basho.com/riaksearch.html">RiakSearch</a> API ist kompatibel zu: Apache <a href="http://lucene.apache.org/solr/" target="_blank">Solr</a>/<a href="http://lucene.apache.org/" target="_blank">Lucene</a></li>
  </ul>
  </li>
  <li>Graph Database: <a href="http://neo4j.org">Neo4J</a> / <a href="http://www.sones.com/" target="_blank">GraphDB</a></li>
  </ol>
  </li>
  <li>Einsatzgebiete
  <ul>
  <li>kkovacs.eu <a href="http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis" target="_blank">Vergleich der NoSQL Datenbanken</a></li>
  <li>readwriteweb.com <a href="http://www.readwriteweb.com/cloud/2011/01/how-twitter-uses-nosql.php" target="_blank">NoSQL bei Twitter</a></li>
  </ul>
  </li>
  <li><a href="http://codemonkeyism.com/nosql-polyglott-persistence/" target="_blank">Polyglot Persistence</a></li>
  </ol>
  </li>
  <li>Ende</li>
  </ul>
  </div>
