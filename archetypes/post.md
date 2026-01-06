---
title: "{{ replace (replaceRE `^\d{4}-\d{2}-\d{2}-` "" .File.ContentBaseName) "-" " " | title }}"
date: {{ now.Format "2006-01-02 15:04:05" }}
comments: true
categories: talk
---
