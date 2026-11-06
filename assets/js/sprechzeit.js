/* Sprechzeit: who spoke how long, computed in the browser.
 *
 * Episode list: the site's own search index (/index.json). Per episode the
 * WebVTT transcript next to the audio on download.binaergewitter.de is
 * fetched (CORS is open there), cue durations are summed per <v Speaker>,
 * a few word counts are taken on the way, and only those results are kept
 * in IndexedDB (a few MB). The full text is fetched again, once, when
 * someone uses the search, and then stored gzip-compressed.
 * Views are hash routes: #/ #/jahr/2016 #/folge/talk-388[/sec] #/person/Felix #/suche/docker */
(function () {
  "use strict";

  var ROOT = document.getElementById("sprechzeit");
  if (!ROOT) return;

  var CACHE_V = 4;             // bump when the stored per-episode record changes
  var DB_VERSION = 2;
  var LEGACY_CACHE = "sprechzeit-vtt-v1";
  var PARALLEL = 24;           // measured: 8 -> ~4 s, 16-32 -> ~1.7 s for all 402 files
  var UNKNOWN = "Unbekannt";
  var GUESTS = "Gäste";
  // The regular voices. Everyone else is "Gäste" in every cross-episode view;
  // their names stay visible inside an episode and in the Gäste view.
  var REGULARS = ["Felix", "Ingo", "Pfleidi", "Marc", "Mat", "l33tname", "Markus", "Sebastian"];
  // Speaker names from the Auphonic production (reliable); everything else was
  // labelled by voice similarity, see github.com/bmalum/binaergewitter-transcripts.
  var AUPHONIC = { 227: 1, 228: 1, 233: 1, 235: 1, 238: 1, 317: 1, 318: 1, 319: 1, 320: 1, 321: 1, 322: 1 };
  var COLORS = {
    Felix: "#0072B2",
    Ingo: "#D55E00",
    Pfleidi: "#AA3377",
    Marc: "#117733",
    Mat: "#7D7D1E",
    l33tname: "#009E73",
    Markus: "#CC79A7",
    Sebastian: "#E69F00",
    "Gäste": "#8a8a8a",
    Unbekannt: "#c9c9c9",
  };
  var GUEST_SHADES = ["#8a8a8a", "#5f5f5f"];
  var MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  /* Word counts over the full text. Patterns are written for how the ASR
     spells things out loud ("Butter-FS", "free bsd"); each term is one
     capture group so a single scan per episode attributes every hit. */
  var TERM_GROUPS = {
    fs: [
      ["ZFS", "(?:open[ -]?)?zfs|zed[ -]?fs|zet[ -]?fs"],
      ["btrfs", "btrfs|butter[ -]?fs|better[ -]?fs|b[äe]tter[ -]?fs|b-tree[ -]?fs"],
      ["ext4", "ext[ -]?4|ext[ -]?vier"],
      ["XFS", "xfs"],
      ["NTFS", "ntfs"],
      ["bcachefs", "bcache[ -]?fs|b-cache[ -]?fs"],
    ],
    bsd: [
      ["FreeBSD", "free[ -]?bsd"],
      ["OpenBSD", "open[ -]?bsd"],
      ["NetBSD", "net[ -]?bsd"],
      ["BSD ohne Zusatz", "bsd"],
    ],
    swear: [
      ["Scheiße", "schei(?:ß|ss)\\p{L}*"],
      ["Fuck", "fuck\\p{L}*"],
      ["Shit", "shit"],
      ["Bullshit", "bullshit"],
      ["Kacke", "kack\\p{L}*"],
      ["Arsch", "arsch\\p{L}*"],
      ["Verdammt", "verdammt\\p{L}*"],
      ["Ficken", "fick\\p{L}*|verfickt\\p{L}*"],
      ["Hure", "hure\\p{L}*"],
      ["Wichser", "wichs\\p{L}*"],
      ["Pisse", "piss\\p{L}*"],
      ["Depp", "depp\\p{L}*"],
      ["Idiot", "idiot\\p{L}*"],
      ["Dreck", "dreck\\p{L}*"],
      ["Mist", "mist"],
      ["Crap", "crap"],
      ["Damn", "damn"],
    ],
  };

  var $ = function (id) { return document.getElementById(id); };
  var nf = new Intl.NumberFormat("de-DE");
  var nf1 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

  var S = {
    episodes: [],     // newest first
    bySlug: {},
    byBase: {},
    failed: [],
    db: null,
    wordRe: null,     // compiled TERM_GROUPS, null when the browser lacks lookbehind
    route: { view: "overview" },
    lastYear: null,
    lastPerson: null,
    renderedEp: null,
    chapterCache: {},
    renderTimer: null,
    searchToken: 0,
    loading: true,
  };

  /* ------------------------------------------------------------ helpers */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "style") e.style.cssText = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (text != null) e.textContent = text;
    return e;
  }
  function clock(sec, forceH) {
    sec = Math.max(0, Math.round(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return h > 0 || forceH ? h + ":" + p(m) + ":" + p(s) : m + ":" + p(s);
  }
  function hours(sec) {
    if (sec >= 3600) return nf1.format(sec / 3600) + " Std.";
    return Math.round(sec / 60) + " Min.";
  }
  function hoursLong(sec) {
    if (sec >= 3600) return nf1.format(sec / 3600) + " Stunden";
    if (sec >= 90) return Math.round(sec / 60) + " Minuten";
    return Math.round(sec) + " Sekunden";
  }
  function pct(part, whole) {
    if (!whole || !part) return "0 %";
    var p = (part / whole) * 100;
    return p < 0.5 ? "< 1 %" : Math.round(p) + " %";
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return iso.slice(0, 10);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function fmtDateLong(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.getDate() + ". " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function yearOf(ep) { return ep.date.slice(0, 4); }
  function isRegular(name) { return REGULARS.indexOf(name) >= 0; }
  function bucket(name) { return name === UNKNOWN || isRegular(name) ? name : GUESTS; }
  function hashName(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function colorOf(name) {
    if (COLORS[name]) return COLORS[name];
    return GUEST_SHADES[hashName(name) % GUEST_SHADES.length];
  }
  function canon(raw) {
    var n = (raw || "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
    if (!n) return UNKNOWN;
    var k = n.toLowerCase().replace(/\s/g, "");
    var alias = { felix: "Felix", felix2: "Felix", ingo: "Ingo", l33tname: "l33tname", markus: "Markus", madmas: "Markus",
      sebastian: "Sebastian", pfleidi: "Pfleidi", marc: "Marc", mat: "Mat", unknown: UNKNOWN, unbekannt: UNKNOWN, "null": UNKNOWN };
    if (alias[k]) return alias[k];
    var g = /^gast(\d+)$/.exec(k);
    if (g) return "Gast " + parseInt(g[1], 10);
    return n;
  }
  function navigate(hash, replace) {
    if (replace) history.replaceState(null, "", hash);
    else location.hash = hash;
    if (replace) onRoute();
  }
  function epHash(ep, t) { return "#/folge/" + ep.slug + (t != null ? "/" + Math.round(t) : ""); }
  function yearHash(y) { return "#/jahr/" + y; }
  function personHash(name) { return "#/person/" + encodeURIComponent(name); }

  /* ------------------------------------------------------------ episode list */

  function kindOf(entry) {
    var c = entry.categories;
    if (Array.isArray(c)) c = c[0];
    c = String(c || "").toLowerCase();
    return c === "talk" || c === "westcoast" || c === "spezial" ? c : "other";
  }
  function labelOf(base, kind) {
    var m = /\.(Talk|Westcoast|Spezial)\.(\d+)$/.exec(base);
    if (m) return m[1] + " " + parseInt(m[2], 10);
    if (/RadioTux/.test(base)) return "RadioTux";
    return kind === "other" ? "Folge" : kind.charAt(0).toUpperCase() + kind.slice(1);
  }
  function shortTitle(title) {
    var m = /#\s*\d+\s*[:\-–]\s*(.+)$/.exec(title || "");
    return m ? m[1].trim() : (title || "").replace(/^Bin[aä]e?rgewitter\s*/i, "").trim();
  }

  function buildEpisodes(index) {
    var seen = {};
    var eps = [];
    index.forEach(function (e) {
      var mp3 = e.audioformats && e.audioformats.mp3;
      if (!mp3 || typeof mp3 !== "string" || !/\.mp3$/i.test(mp3)) return;
      var base = mp3.replace(/^.*\//, "").replace(/\.mp3$/i, "");
      if (seen[base]) return;
      seen[base] = 1;
      var stem = mp3.replace(/\.mp3$/i, "");
      var kind = kindOf(e);
      var label = labelOf(base, kind);
      var m = /^(Talk|Westcoast|Spezial) (\d+)$/.exec(label);
      var ep = {
        base: base,
        kind: kind,
        label: label,
        slug: m ? m[1].toLowerCase() + "-" + m[2] : base,
        num: e.episodeNumber ? parseInt(e.episodeNumber, 10) : null,
        title: shortTitle(e.title),
        fullTitle: e.title,
        date: e.date || "",
        href: e.permalink,
        mp3: mp3,
        vtt: stem + ".vtt",
        chaptersUrl: e.chapters || stem + ".chapters.txt",
        data: null,    // { dur, who: [[name, sec, words, questions]], segs: [[whoIdx, start, dur]], gap: [len, at] }
        words: null,   // { group: { counts: [], total, bySpeaker: {name: n} } }
        lm: null,      // Last-Modified of the VTT when it was read
        error: null,
      };
      ep.auphonic = kind === "talk" && ep.num != null && (ep.num >= 324 || AUPHONIC[ep.num] === 1);
      eps.push(ep);
    });
    eps.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return eps;
  }

  /* ------------------------------------------------------------ VTT parsing */

  function parseTs(s) {
    var p = s.trim().split(":");
    if (p.length === 2) p.unshift("0");
    return (+p[0]) * 3600 + (+p[1]) * 60 + parseFloat(p[2]);
  }

  function parseVtt(text) {
    var lines = text.split(/\r?\n/);
    var stats = {};
    var runs = [];
    var end = 0, prevEnd = -1, gap = [0, 0];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      var arrow = line.indexOf("-->");
      if (arrow < 0) { i++; continue; }
      var a = parseTs(line.slice(0, arrow));
      var b = parseTs(line.slice(arrow + 3).trim().split(/\s+/)[0]);
      i++;
      var body = [];
      while (i < lines.length && lines[i].trim() !== "") { body.push(lines[i]); i++; }
      if (isNaN(a) || isNaN(b)) continue;
      if (b < a) { var t = a; a = b; b = t; }
      var joined = body.join(" ");
      var name = UNKNOWN;
      var vm = /^\s*<v\s+([^>]*)>/.exec(joined);
      if (vm) { name = canon(vm[1]); joined = joined.slice(vm[0].length); }
      joined = joined.replace(/<[^>]+>/g, "").trim();
      var st = stats[name] || (stats[name] = { sec: 0, words: 0, q: 0 });
      st.sec += b - a;
      st.words += joined ? joined.split(/\s+/).length : 0;
      st.q += (joined.match(/\?/g) || []).length;
      if (prevEnd >= 0 && a - prevEnd > gap[0]) gap = [a - prevEnd, prevEnd];
      if (b > prevEnd) prevEnd = b;
      if (b > end) end = b;
      var last = runs[runs.length - 1];
      if (last && last[0] === name && a - last[2] < 1.0) { if (b > last[2]) last[2] = b; }
      else runs.push([name, a, b]);
    }
    var names = Object.keys(stats).filter(function (n) { return stats[n].sec >= 1; });
    names.sort(function (x, y) { return stats[y].sec - stats[x].sec || x.localeCompare(y); });
    var idx = {};
    var who = names.map(function (n, k) { idx[n] = k; return [n, Math.round(stats[n].sec), stats[n].words, stats[n].q]; });
    var segs = [];
    runs.forEach(function (r) {
      if (!(r[0] in idx)) return;
      var s = Math.round(r[1]), d = Math.round(r[2] - r[1]);
      if (d < 1) return;
      var prev = segs[segs.length - 1];
      if (prev && prev[0] === idx[r[0]] && s <= prev[1] + prev[2] + 1) {
        var e2 = Math.max(prev[1] + prev[2], s + d);
        prev[2] = e2 - prev[1];
      } else segs.push([idx[r[0]], s, d]);
    });
    return { dur: Math.round(end), who: who, segs: segs, gap: [Math.round(gap[0]), Math.round(gap[1])] };
  }

  function parseChapters(text) {
    var out = [];
    text.split(/\r?\n/).forEach(function (line) {
      line = line.trim();
      var m = /^(\d+):(\d+):(\d+(?:\.\d+)?)\s+(.+)$/.exec(line) || /^(\d+):(\d+(?:\.\d+)?)\s+(.+)$/.exec(line);
      if (!m) return;
      var t = m.length === 5 ? (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : (+m[1]) * 60 + parseFloat(m[2]);
      out.push([Math.round(t), m[m.length - 1].trim()]);
    });
    return out;
  }

  /* derived per-episode numbers, excluding the unassigned remainder */
  function speechOf(ep) {
    var s = 0;
    ep.data.who.forEach(function (w) { if (w[0] !== UNKNOWN) s += w[1]; });
    return s;
  }
  function unknownOf(ep) {
    var s = 0;
    ep.data.who.forEach(function (w) { if (w[0] === UNKNOWN) s += w[1]; });
    return s;
  }
  function namedWho(ep) { return ep.data.who.filter(function (w) { return w[0] !== UNKNOWN; }); }
  function openerOf(ep) {
    for (var i = 0; i < ep.data.segs.length; i++) {
      var w = ep.data.who[ep.data.segs[i][0]];
      if (w && w[0] !== UNKNOWN && ep.data.segs[i][2] >= 3) return w[0];
    }
    return null;
  }
  function longestRun(ep) {
    var best = null;
    ep.data.segs.forEach(function (s) {
      var w = ep.data.who[s[0]];
      if (!w || w[0] === UNKNOWN) return;
      if (!best || s[2] > best[2]) best = s;
    });
    return best; // [whoIdx, start, dur]
  }
  function wpm(words, sec) { return sec > 0 ? Math.round(words / (sec / 60)) : 0; }

  /* ------------------------------------------------------------ word counts */

  function compileWordRegexes() {
    try {
      var out = {};
      Object.keys(TERM_GROUPS).forEach(function (g) {
        out[g] = new RegExp("(?<![\\p{L}])(?:" + TERM_GROUPS[g].map(function (t) { return "(" + t[1] + ")"; }).join("|") + ")(?![\\p{L}])", "giu");
      });
      return out;
    } catch (e) { return null; }
  }
  /* blank the timing lines and the <v> tags so a search cannot hit them; same length as text */
  function searchable(text) {
    return text
      .replace(/^(.*-->.*)$/gm, function (l) { return l.replace(/[^\s>-]/g, " "); })
      .replace(/<v [^>]*>/g, function (m) { return " ".repeat(m.length); });
  }
  function speakerAt(text, idx) {
    var arrow = text.lastIndexOf("-->", idx);
    if (arrow < 0) return UNKNOWN;
    var tag = text.indexOf("<v ", arrow);
    if (tag < 0 || tag > idx) return UNKNOWN;
    return canon(text.slice(tag + 3, text.indexOf(">", tag)));
  }
  /* counts for one episode; swear words are attributed to the speaker of the cue */
  function scanText(text, regexes) {
    var hay = searchable(text);
    var out = {};
    Object.keys(regexes).forEach(function (g) {
      var re = regexes[g];
      re.lastIndex = 0;
      var counts = [], bySpeaker = {}, total = 0, m;
      while ((m = re.exec(hay))) {
        for (var i = 1; i < m.length; i++) if (m[i] !== undefined) { counts[i - 1] = (counts[i - 1] || 0) + 1; break; }
        total++;
        if (g === "swear") {
          var sp = speakerAt(text, m.index);
          bySpeaker[sp] = (bySpeaker[sp] || 0) + 1;
        }
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      out[g] = { counts: counts, total: total, bySpeaker: bySpeaker };
    });
    return out;
  }
  /* totals over a list of episodes, from the per-episode counts */
  function wordTotals(list) {
    var groups = {};
    Object.keys(TERM_GROUPS).forEach(function (g) {
      groups[g] = { totals: TERM_GROUPS[g].map(function () { return 0; }), topEp: TERM_GROUPS[g].map(function () { return null; }), top: null, bySpeaker: {} };
    });
    var densest = null, n = 0;
    list.forEach(function (ep) {
      if (!ep.data || !ep.words) return;
      n++;
      Object.keys(groups).forEach(function (g) {
        var r = ep.words[g], G = groups[g];
        if (!r) return;
        r.counts.forEach(function (c, i) {
          if (!c) return;
          G.totals[i] += c;
          if (!G.topEp[i] || c > G.topEp[i].count) G.topEp[i] = { ep: ep, count: c };
        });
        if (r.total && (!G.top || r.total > G.top.count)) G.top = { ep: ep, count: r.total };
        Object.keys(r.bySpeaker).forEach(function (sp) { G.bySpeaker[sp] = (G.bySpeaker[sp] || 0) + r.bySpeaker[sp]; });
      });
      if (ep.words.swear && ep.data.dur >= 1800) {
        var rate = ep.words.swear.total / (ep.data.dur / 3600);
        if (!densest || rate > densest.rate) densest = { ep: ep, count: ep.words.swear.total, rate: rate };
      }
    });
    return { groups: groups, densest: densest, n: n };
  }

  /* ------------------------------------------------------------ storage */

  function openDb() {
    return new Promise(function (resolve) {
      try {
        var req = indexedDB.open("sprechzeit", DB_VERSION);
        req.onupgradeneeded = function (ev) {
          var db = req.result;
          if (!db.objectStoreNames.contains("eps")) db.createObjectStore("eps");
          else if (ev.oldVersion < 2) req.transaction.objectStore("eps").clear(); // old record format
          if (!db.objectStoreNames.contains("texts")) db.createObjectStore("texts");
        };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(null); };
        req.onblocked = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }
  function dbReadAll(db) {
    return new Promise(function (resolve) {
      if (!db) return resolve({});
      try {
        var out = {};
        var tx = db.transaction("eps", "readonly");
        var cur = tx.objectStore("eps").openCursor();
        cur.onsuccess = function () {
          var c = cur.result;
          if (!c) return;
          if (c.value && c.value.v === CACHE_V && c.value.data) out[c.key] = c.value;
          c.continue();
        };
        tx.oncomplete = function () { resolve(out); };
        tx.onerror = function () { resolve(out); };
      } catch (e) { resolve({}); }
    });
  }
  function dbPut(db, store, key, value) {
    if (!db) return;
    try { db.transaction(store, "readwrite").objectStore(store).put(value, key); } catch (e) { /* quota or private mode */ }
  }
  function dbGet(db, store, key) {
    return new Promise(function (resolve) {
      if (!db) return resolve(null);
      try {
        var req = db.transaction(store, "readonly").objectStore(store).get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }
  function dbClear(db) {
    return new Promise(function (resolve) {
      if (!db) return resolve();
      try {
        var tx = db.transaction(["eps", "texts"], "readwrite");
        tx.objectStore("eps").clear();
        tx.objectStore("texts").clear();
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      } catch (e) { resolve(); }
    });
  }
  /* full texts: stored gzip-compressed, only after someone searched */
  var canCompress = typeof CompressionStream === "function" && typeof DecompressionStream === "function";
  function deflate(text) {
    if (!canCompress) return Promise.resolve(null);
    try { return new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).blob(); }
    catch (e) { return Promise.resolve(null); }
  }
  function inflate(blob) {
    return new Response(blob.stream().pipeThrough(new DecompressionStream("gzip"))).text();
  }
  function fetchVtt(ep) {
    return fetch(ep.vtt).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      var lm = r.headers.get("last-modified"); // CORS-safelisted, readable cross-origin
      return r.text().then(function (text) { return { text: text, lm: lm }; });
    });
  }
  function textOf(ep) {
    return dbGet(S.db, "texts", ep.base).then(function (rec) {
      if (rec && rec.blob && canCompress) return inflate(rec.blob).catch(function () { return null; });
      return null;
    }).then(function (text) {
      if (text != null) return text;
      return fetchVtt(ep).then(function (res) {
        deflate(res.text).then(function (blob) { if (blob) dbPut(S.db, "texts", ep.base, { lm: res.lm, blob: blob }); });
        return res.text;
      });
    });
  }

  /* ------------------------------------------------------------ loading */

  function setProgress(done, total) {
    $("sz-progress-bar").style.width = (total ? Math.round((done / total) * 100) : 0) + "%";
    if (done < total) {
      $("sz-progress").textContent = "Lade Transkripte … " + nf.format(done) + " von " + nf.format(total);
      return;
    }
    var wasLoading = S.loading;
    S.loading = false;
    $("sz-progress-wrap").hidden = true;
    var status = $("sz-status");
    if (!S.failed.length) status.hidden = true;
    else {
      status.hidden = false;
      $("sz-progress").textContent = nf.format(S.failed.length) + " Folgen ohne lesbares Transkript:";
      var old = status.querySelector("ul");
      if (old) old.remove();
      var ul = el("ul", { class: "small text-muted" });
      S.failed.forEach(function (ep) {
        var li = el("li");
        li.appendChild(el("a", { href: ep.href }, ep.label + " · " + ep.title));
        li.appendChild(document.createTextNode(" (" + ep.error + ")"));
        ul.appendChild(li);
      });
      status.appendChild(ul);
    }
    // a search that started while transcripts were still arriving saw only part of them
    if (wasLoading && S.route.view === "search" && S.route.q) runSearch(S.route.q, $("se-prefix").checked);
  }

  function loadEpisode(ep) {
    return fetchVtt(ep).then(function (res) {
      if (res.text.indexOf("WEBVTT") < 0) throw new Error("kein WebVTT");
      ep.data = parseVtt(res.text);
      ep.words = S.wordRe ? scanText(res.text, S.wordRe) : null;
      ep.lm = res.lm;
      dbPut(S.db, "eps", ep.base, { v: CACHE_V, lm: ep.lm, data: ep.data, words: ep.words });
    }).catch(function (err) {
      ep.error = err.message || String(err);
      S.failed.push(ep);
    });
  }

  function loadAll() {
    var queue = S.episodes.filter(function (ep) { return !ep.data; });
    var total = S.episodes.length;
    var done = total - queue.length;
    setProgress(done, total);
    if (!queue.length) { scheduleRender(true); return Promise.resolve(); }
    // the open episode first, then newest first
    if (S.route.view === "episode" && S.bySlug[S.route.slug]) {
      var cur = S.bySlug[S.route.slug];
      var at = queue.indexOf(cur);
      if (at > 0) { queue.splice(at, 1); queue.unshift(cur); }
    }
    return new Promise(function (resolve) {
      var active = 0;
      function next() {
        if (!queue.length && active === 0) { setProgress(total, total); scheduleRender(true); resolve(); return; }
        while (active < PARALLEL && queue.length) {
          var ep = queue.shift();
          active++;
          loadEpisode(ep).then(function () {
            active--;
            done++;
            setProgress(done, total);
            scheduleRender(false);
            next();
          });
        }
      }
      next();
    });
  }

  function scheduleRender(now) {
    if (now) { clearTimeout(S.renderTimer); S.renderTimer = null; renderView(); return; }
    if (S.renderTimer) return;
    S.renderTimer = setTimeout(function () { S.renderTimer = null; renderView(); }, 800);
  }

  /* ------------------------------------------------------------ aggregation */

  function withData(list) { return list.filter(function (ep) { return ep.data; }); }
  function years() {
    var seen = {};
    S.episodes.forEach(function (ep) { seen[yearOf(ep)] = 1; });
    return Object.keys(seen).sort();
  }
  /* sec/words/eps per bucketed person over a list, Unbekannt left out */
  function aggregate(list) {
    var sec = {}, words = {}, eps = {}, first = {}, last = {}, opened = {}, speech = 0, n = 0;
    list.forEach(function (ep) {
      if (!ep.data) return;
      n++;
      var seen = {};
      ep.data.who.forEach(function (w) {
        if (w[0] === UNKNOWN) return;
        var k = bucket(w[0]);
        sec[k] = (sec[k] || 0) + w[1];
        words[k] = (words[k] || 0) + w[2];
        speech += w[1];
        if (seen[k]) return;
        seen[k] = 1;
        eps[k] = (eps[k] || 0) + 1;
        if (!first[k] || ep.date < first[k]) first[k] = ep.date;
        if (!last[k] || ep.date > last[k]) last[k] = ep.date;
      });
      var o = openerOf(ep);
      if (o) { o = bucket(o); opened[o] = (opened[o] || 0) + 1; }
    });
    var names = Object.keys(sec).sort(function (a, b) { return sec[b] - sec[a]; });
    return { sec: sec, words: words, eps: eps, first: first, last: last, opened: opened, speech: speech, n: n, names: names };
  }
  function stackOrder(names) {
    var order = REGULARS.concat([GUESTS]);
    return names.slice().sort(function (a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
  }

  /* ------------------------------------------------------------ shared widgets */

  function chip(name, text, href) {
    var a = el("a", { class: "btn btn-default btn-sm sz-chip", style: "--c:" + colorOf(name), href: href || personHash(name) });
    a.appendChild(el("span", { class: "dot" }));
    a.appendChild(document.createTextNode(name + " "));
    if (text) a.appendChild(el("small", null, text));
    return a;
  }
  function chips(container, agg, minSec) {
    container.textContent = "";
    agg.names.forEach(function (name) {
      if (agg.sec[name] < (minSec || 0) && !isRegular(name)) return;
      var c = chip(name, pct(agg.sec[name], agg.speech));
      c.title = hoursLong(agg.sec[name]) + " in " + nf.format(agg.eps[name]) + " Folgen";
      container.appendChild(c);
    });
  }
  /* a stacked bar: parts = {name: sec}; width relative to max (or 100% when max is null) */
  function stack(parts, max, full, solo) {
    var s = el("div", { class: "sz-stack" + (full ? " full" : "") });
    var total = 0;
    Object.keys(parts).forEach(function (k) { total += parts[k]; });
    if (!full) s.style.width = (max ? (total / max) * 100 : 100) + "%";
    stackOrder(Object.keys(parts)).forEach(function (name) {
      if (!parts[name]) return;
      var i = el("i", { style: "--c:" + colorOf(name) + ";flex:" + parts[name] + " 1 0" });
      i.title = name + ": " + hoursLong(parts[name]) + " (" + pct(parts[name], total) + ")";
      if (solo && name !== solo) i.classList.add("dim");
      s.appendChild(i);
    });
    return s;
  }
  function row(href, label, barNode, valueHtml, active) {
    var r = el(href ? "a" : "div", { class: "sz-row" + (active ? " active" : "") });
    if (href) r.href = href;
    r.appendChild(el("span", { class: "lbl" }, label));
    r.appendChild(barNode);
    var v = el("span", { class: "val" });
    v.innerHTML = valueHtml;
    r.appendChild(v);
    return r;
  }
  function episodeRow(ep, showYear) {
    var a = el("a", { class: "sz-episode" + (ep.data ? "" : " pending"), href: epHash(ep) });
    a.appendChild(el("span", { class: "when" }, showYear ? fmtDate(ep.date) : fmtDate(ep.date).slice(0, 6)));
    var what = el("span", { class: "what" });
    what.appendChild(el("b", null, ep.title || ep.fullTitle));
    var sub = ep.label;
    if (ep.data) {
      var speech = speechOf(ep);
      sub += " · " + namedWho(ep).slice(0, 5).map(function (w) { return w[0] + " " + pct(w[1], speech); }).join(", ");
    } else if (ep.error) sub += " · kein Transkript";
    what.appendChild(el("small", null, sub));
    a.appendChild(what);
    var how = el("span", { class: "how" });
    if (ep.data) {
      var parts = {};
      namedWho(ep).forEach(function (w) { parts[w[0]] = w[1]; });
      how.appendChild(stack(parts, null, true));
      how.appendChild(document.createTextNode(clock(ep.data.dur) + " · " + hoursLong(speechOf(ep)) + " Sprache"));
    } else how.appendChild(document.createTextNode(ep.error ? "–" : "lädt …"));
    a.appendChild(how);
    return a;
  }

  /* ------------------------------------------------------------ routing */

  function parseRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/").map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
    if (!parts[0]) return { view: "overview" };
    if (parts[0] === "jahr") return { view: "year", year: parts[1] || null };
    if (parts[0] === "folge") return { view: "episode", slug: parts[1], t: parts[2] != null && parts[2] !== "" ? +parts[2] : null };
    if (parts[0] === "person") return { view: "person", name: parts[1] || null };
    if (parts[0] === "suche") return { view: "search", q: parts.slice(1).join("/") };
    if (S.bySlug[parts[0]]) return { view: "episode", slug: parts[0] };
    return { view: "overview" };
  }

  function onRoute() {
    S.route = parseRoute();
    if (S.route.view === "year" && !S.route.year) {
      var ys = years();
      S.route.year = S.lastYear || ys[ys.length - 1];
    }
    if (S.route.view === "year") S.lastYear = S.route.year;
    if (S.route.view === "person" && !S.route.name) S.route.name = S.lastPerson || REGULARS[0];
    if (S.route.view === "person") S.lastPerson = S.route.name;
    if (S.route.view === "episode") {
      var ep = S.bySlug[S.route.slug];
      if (ep) S.lastYear = yearOf(ep);
    }
    $("sz-tab-year").href = yearHash(S.lastYear || years().slice(-1)[0] || "");
    $("sz-tab-person").href = personHash(S.lastPerson || REGULARS[0]);
    Array.prototype.forEach.call($("sz-tabs").children, function (li) {
      var v = li.getAttribute("data-view");
      li.classList.toggle("active", v === S.route.view || (v === "year" && S.route.view === "episode"));
    });
    Array.prototype.forEach.call(ROOT.querySelectorAll(".sz-view"), function (sec) {
      sec.hidden = sec.id !== "view-" + S.route.view;
    });
    if (S.route.view !== "episode") { S.renderedEp = null; $("ep-audio").pause(); }
    renderView();
    if (S.route.view === "search") {
      var q = S.route.q || "";
      if ($("se-q").value !== q) $("se-q").value = q;
      if (q) runSearch(q, $("se-prefix").checked); else { $("se-head").textContent = ""; $("se-years").textContent = ""; $("se-results").textContent = ""; }
    }
    window.scrollTo({ top: Math.min(window.scrollY, Math.max(0, ROOT.getBoundingClientRect().top + window.scrollY - 20)) });
  }

  function renderView() {
    var v = S.route.view;
    if (v === "overview") renderOverview();
    else if (v === "year") renderYear(S.route.year);
    else if (v === "episode") renderEpisode(S.bySlug[S.route.slug], S.route.t);
    else if (v === "person") renderPerson(S.route.name);
    renderMethod();
  }

  function renderMethod() {
    var unk = 0, all = 0;
    S.episodes.forEach(function (ep) { if (ep.data) { unk += unknownOf(ep); all += unknownOf(ep) + speechOf(ep); } });
    $("sz-unknown").textContent = all ? "insgesamt " + hoursLong(unk) + ", " + pct(unk, all) + " der Sprechzeit" : "…";
  }

  /* ------------------------------------------------------------ view: overview */

  function renderOverview() {
    var list = withData(S.episodes);
    var agg = aggregate(list);
    var head = $("ov-totals");
    if (!agg.n) { head.textContent = S.loading ? "Die ersten Folgen werden gerade ausgewertet …" : "Keine Transkripte gefunden."; }
    else {
      var ys = years();
      var top = agg.names[0], second = agg.names[1];
      head.textContent = nf.format(agg.n) + " Folgen von " + ys[0] + " bis " + ys[ys.length - 1] + ", " + hoursLong(agg.speech) +
        " gesprochen. " + top + " hat " + pct(agg.sec[top], agg.speech) + " davon" +
        (second ? ", " + second + " " + pct(agg.sec[second], agg.speech) : "") + ".";
    }
    chips($("ov-chips"), agg, 3600);

    // hours per year
    var box = $("ov-years");
    box.textContent = "";
    var byYear = {};
    list.forEach(function (ep) {
      var y = yearOf(ep);
      var m = byYear[y] || (byYear[y] = {});
      namedWho(ep).forEach(function (w) { var k = bucket(w[0]); m[k] = (m[k] || 0) + w[1]; });
    });
    var max = 1;
    Object.keys(byYear).forEach(function (y) {
      var t = 0; Object.keys(byYear[y]).forEach(function (k) { t += byYear[y][k]; }); if (t > max) max = t;
    });
    years().forEach(function (y) {
      var parts = byYear[y] || {};
      var total = 0; Object.keys(parts).forEach(function (k) { total += parts[k]; });
      var n = S.episodes.filter(function (ep) { return yearOf(ep) === y; }).length;
      box.appendChild(row(yearHash(y), y, stack(parts, max, false), Math.round(total / 3600) + " h <small>" + n + " Folgen</small>"));
    });

    renderRecords(list, agg);

    // people table
    var tb = $("ov-people");
    tb.textContent = "";
    agg.names.forEach(function (name) {
      if (agg.sec[name] < 60) return;
      var tr = el("tr", { style: "--c:" + colorOf(name), tabindex: "0", role: "link" });
      tr.innerHTML =
        '<td class="name"><span class="dot"></span> <b>' + esc(name) + "</b></td>" +
        '<td class="num">' + esc(hoursLong(agg.sec[name])) + "</td>" +
        '<td class="num">' + esc(pct(agg.sec[name], agg.speech)) +
        '<span class="sz-bar" aria-hidden="true"><i style="width:' + Math.max(1, (agg.sec[name] / agg.sec[agg.names[0]]) * 100) + '%"></i></span></td>' +
        '<td class="num">' + nf.format(agg.eps[name]) + "</td>" +
        '<td class="num">' + wpm(agg.words[name], agg.sec[name]) + " W/min</td>" +
        '<td class="when">' + esc(fmtDate(agg.first[name])) + " bis " + esc(fmtDate(agg.last[name])) + "</td>";
      var go = function () { location.hash = personHash(name); };
      tr.addEventListener("click", go);
      tr.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      tb.appendChild(tr);
    });
  }

  function renderRecords(list, agg) {
    var dl = $("ov-records");
    dl.textContent = "";
    if (!list.length) return;
    var longest = null, shortest = null, biggest = null, mono = null, fastest = null, wordiest = null, pause = null, quiz = null;
    list.forEach(function (ep) {
      var d = ep.data;
      if (!longest || d.dur > longest.data.dur) longest = ep;
      if (d.dur > 600 && (!shortest || d.dur < shortest.data.dur)) shortest = ep;
      var nWho = namedWho(ep).filter(function (w) { return w[1] >= 120; }).length;
      if (!biggest || nWho > biggest.n) biggest = { ep: ep, n: nWho };
      var r = longestRun(ep);
      if (r && (!mono || r[2] > mono.run[2])) mono = { ep: ep, run: r, name: d.who[r[0]][0] };
      namedWho(ep).forEach(function (w) {
        if (w[1] >= 600) {
          var v = wpm(w[2], w[1]);
          if (!fastest || v > fastest.v) fastest = { ep: ep, name: w[0], v: v };
        }
        if (!wordiest || w[2] > wordiest.words) wordiest = { ep: ep, name: w[0], words: w[2] };
        if (w[1] >= 600) {
          var q = w[3] / (w[1] / 3600);
          if (!quiz || q > quiz.q) quiz = { ep: ep, name: w[0], q: q, n: w[3] };
        }
      });
      if (d.gap && d.gap[0] > 20 && (!pause || d.gap[0] > pause.data.gap[0])) pause = ep;
    });
    function add(term, html) {
      dl.appendChild(el("dt", null, term));
      var dd = el("dd");
      dd.innerHTML = html;
      dl.appendChild(dd);
    }
    var link = function (ep, t) { return '<a href="' + epHash(ep, t) + '">' + esc(ep.label) + " · " + esc(ep.title) + "</a>"; };
    if (longest) add("Längste Folge", link(longest) + " mit " + clock(longest.data.dur) + ".");
    if (shortest) add("Kürzeste Folge", link(shortest) + " mit " + clock(shortest.data.dur) + ".");
    if (biggest) add("Größte Runde", biggest.n + " Stimmen in " + link(biggest.ep) + ".");
    if (mono) add("Längster Redeanteil am Stück", esc(mono.name) + ", " + hoursLong(mono.run[2]) + " in " + link(mono.ep, mono.run[1]) + " ab " + clock(mono.run[1]) + ".");
    if (fastest) add("Schnellste Zunge", esc(fastest.name) + " mit " + fastest.v + " Wörtern pro Minute in " + link(fastest.ep) + ".");
    if (wordiest) add("Meiste Wörter in einer Folge", esc(wordiest.name) + ", " + nf.format(wordiest.words) + " Wörter in " + link(wordiest.ep) + ".");
    if (quiz) add("Meiste Fragen pro Stunde", esc(quiz.name) + " mit " + Math.round(quiz.q) + " Fragen pro Stunde in " + link(quiz.ep) + ".");
    if (pause) add("Längste Pause", hoursLong(pause.data.gap[0]) + " ohne Wort in " + link(pause, pause.data.gap[1]) + " ab " + clock(pause.data.gap[1]) + ".");
    var openers = Object.keys(agg.opened).sort(function (a, b) { return agg.opened[b] - agg.opened[a]; });
    if (openers.length) add("Eröffnet die Sendung am häufigsten", openers.slice(0, 3).map(function (n) { return esc(n) + " (" + nf.format(agg.opened[n]) + " Folgen)"; }).join(", ") + ".");
    renderTextRecords(add, link, agg, list);
  }

  function renderTextRecords(add, link, agg, list) {
    if (!S.wordRe) { add("Wörter", "Dieser Browser kann die Wortzählung nicht ausführen."); return; }
    var ts = wordTotals(list);
    if (!ts.n) return;
    var epLink = function (top) { return top ? link(top.ep) + " (" + nf.format(top.count) + " Mal)" : ""; };
    function ranked(g) {
      return TERM_GROUPS[g].map(function (t, i) { return { label: t[0], n: ts.groups[g].totals[i], top: ts.groups[g].topEp[i] }; })
        .filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; });
    }
    function terms(items, max) {
      return items.slice(0, max).map(function (x) {
        return '<a href="#/suche/' + encodeURIComponent(x.label.split(" ")[0]) + '">' + esc(x.label) + "</a> " + nf.format(x.n);
      }).join(", ");
    }
    var fs = ranked("fs");
    if (fs.length) {
      var html = terms(fs, 6) + " Mal genannt.";
      fs.slice(0, 2).forEach(function (x) { if (x.top) html += " Die " + esc(x.label) + "-Folge: " + epLink(x.top) + "."; });
      add("Dateisysteme", html);
    }
    var bsd = ranked("bsd");
    if (bsd.length) add("BSD", terms(bsd, 4) + " Mal genannt." + (ts.groups.bsd.top ? " Die BSD-Folge: " + epLink(ts.groups.bsd.top) + "." : ""));
    var sw = ranked("swear");
    var G = ts.groups.swear;
    var swTotal = G.totals.reduce(function (a, b) { return a + b; }, 0);
    if (swTotal) {
      // per bucketed person, only those with at least 10 hours of speech
      var bySp = {};
      Object.keys(G.bySpeaker).forEach(function (n) { if (n !== UNKNOWN) { var k = bucket(n); bySp[k] = (bySp[k] || 0) + G.bySpeaker[n]; } });
      var perHour = Object.keys(bySp).filter(function (n) { return (agg.sec[n] || 0) >= 10 * 3600; })
        .map(function (n) { return { name: n, rate: bySp[n] / (agg.sec[n] / 3600), count: bySp[n] }; })
        .sort(function (a, b) { return b.rate - a.rate; });
      add("Schimpfwörter", nf.format(swTotal) + " Mal geflucht: " + terms(sw, 6) + ". " +
        (perHour.length ? "Pro Stunde Sprechzeit: " + perHour.slice(0, 5).map(function (p) {
          return '<a href="' + personHash(p.name) + '">' + esc(p.name) + "</a> " + nf1.format(p.rate);
        }).join(", ") + "." : ""));
      if (G.top) {
        var top = G.top.ep;
        var html2 = link(top) + " mit " + nf.format(G.top.count) + " Mal (" + nf1.format(G.top.count / (top.data.dur / 3600)) + " pro Stunde).";
        if (ts.densest && ts.densest.ep !== top) html2 += " Am dichtesten: " + link(ts.densest.ep) + " mit " + nf1.format(ts.densest.rate) + " pro Stunde.";
        add("Folge mit den meisten Schimpfwörtern", html2);
      }
    }
  }

  /* ------------------------------------------------------------ view: year */

  function renderYear(year) {
    var nav = $("yr-nav");
    nav.textContent = "";
    years().forEach(function (y) {
      var li = el("li", { class: y === year ? "active" : "" });
      li.appendChild(el("a", { href: yearHash(y) }, y));
      nav.appendChild(li);
    });
    var list = S.episodes.filter(function (ep) { return yearOf(ep) === year; });
    var agg = aggregate(list);
    var head = $("yr-head");
    if (!agg.n) head.textContent = year + ": " + nf.format(list.length) + " Folgen" + (S.loading ? ", Transkripte laden noch …" : ".");
    else {
      var kinds = {};
      list.forEach(function (ep) { kinds[ep.kind] = (kinds[ep.kind] || 0) + 1; });
      var kindText = Object.keys(kinds).length > 1 ? " (" + Object.keys(kinds).map(function (k) { return kinds[k] + " " + k.charAt(0).toUpperCase() + k.slice(1); }).join(", ") + ")" : "";
      head.textContent = year + ": " + nf.format(list.length) + " Folgen" + kindText + ", " + hoursLong(agg.speech) + " gesprochen. " +
        agg.names.slice(0, 3).map(function (n) { return n + " " + pct(agg.sec[n], agg.speech); }).join(", ") + ".";
    }
    chips($("yr-chips"), agg, 600);
    var box = $("yr-list");
    box.textContent = "";
    list.forEach(function (ep) { box.appendChild(episodeRow(ep, false)); });
  }

  /* ------------------------------------------------------------ view: episode */

  function renderEpisode(ep, t) {
    var nav = $("ep-nav");
    if (!ep) {
      nav.textContent = "";
      $("ep-title").textContent = "Folge nicht gefunden";
      $("ep-meta").textContent = "";
      return;
    }
    var i = S.episodes.indexOf(ep);
    nav.textContent = "";
    nav.appendChild(el("a", { href: yearHash(yearOf(ep)) }, "← Alle Folgen " + yearOf(ep)));
    nav.appendChild(el("span", { class: "spacer" }));
    if (i < S.episodes.length - 1) nav.appendChild(el("a", { href: epHash(S.episodes[i + 1]), title: S.episodes[i + 1].title }, "← " + S.episodes[i + 1].label));
    if (i > 0) nav.appendChild(el("a", { href: epHash(S.episodes[i - 1]), title: S.episodes[i - 1].title }, S.episodes[i - 1].label + " →"));

    var audio = $("ep-audio");
    if (S.renderedEp === ep && ep.data) { if (t != null) { seek(t, true); S.route.t = null; } return; }
    S.renderedEp = ep;

    var h2 = $("ep-title");
    h2.textContent = "";
    h2.appendChild(document.createTextNode(ep.title || ep.fullTitle));
    var small = el("small", null, ep.label + " · " + fmtDateLong(ep.date) + " · ");
    small.appendChild(el("a", { href: ep.href }, "Shownotes im Blog"));
    h2.appendChild(small);
    var meta = $("ep-meta");
    if (!ep.data) {
      meta.textContent = ep.error ? "Für diese Folge liegt kein lesbares Transkript vor (" + ep.error + ")." : "Transkript lädt noch …";
      $("ep-lanes").textContent = ""; $("ep-shares").textContent = ""; $("ep-chapters").textContent = ""; $("ep-facts").textContent = "";
      S.renderedEp = ep.error ? ep : null;
      return;
    }
    var speech = speechOf(ep);
    var unk = unknownOf(ep);
    meta.textContent = clock(ep.data.dur) + " lang, " + hoursLong(speech) + " davon gesprochen" +
      (unk >= 30 ? ", " + hoursLong(unk) + " nicht zugeordnet" : "") + ". " +
      (ep.auphonic ? "Namen aus der Auphonic-Produktion." : "Namen per Stimmvergleich.");
    audio.pause();
    audio.setAttribute("src", ep.mp3);
    audio.load();

    var lanes = $("ep-lanes");
    lanes.textContent = "";
    var head = el("div", { class: "sz-playhead" });
    head.hidden = true;
    lanes.appendChild(head);
    var svgNS = "http://www.w3.org/2000/svg";
    ep.data.who.forEach(function (w, idx) {
      if (w[0] === UNKNOWN) return;
      var lane = el("div", { class: "sz-lane", style: "--c:" + colorOf(w[0]) });
      lane.appendChild(el("span", { class: "name", title: w[0] }, w[0]));
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + Math.max(1, ep.data.dur) + " 10");
      svg.setAttribute("preserveAspectRatio", "none");
      ep.data.segs.forEach(function (s) {
        if (s[0] !== idx) return;
        var r = document.createElementNS(svgNS, "rect");
        r.setAttribute("x", s[1]); r.setAttribute("y", 0); r.setAttribute("width", Math.max(2, s[2])); r.setAttribute("height", 10);
        svg.appendChild(r);
      });
      svg.addEventListener("click", function (e) {
        var rect = svg.getBoundingClientRect();
        seek(((e.clientX - rect.left) / rect.width) * ep.data.dur, true);
      });
      lane.appendChild(svg);
      lanes.appendChild(lane);
    });

    var tb = $("ep-shares");
    tb.textContent = "";
    var maxSec = namedWho(ep).length ? namedWho(ep)[0][1] : 1;
    namedWho(ep).forEach(function (w) {
      var tr = el("tr", { style: "--c:" + colorOf(w[0]) });
      var who = isRegular(w[0]) ? '<a href="' + personHash(w[0]) + '">' + esc(w[0]) + "</a>" : esc(w[0]) + ' <span class="text-muted small">Gast</span>';
      tr.innerHTML =
        '<td class="name"><b>' + who + "</b></td>" +
        '<td class="num">' + esc(hours(w[1])) + "</td>" +
        '<td class="num">' + esc(pct(w[1], speech)) + '<span class="sz-bar" aria-hidden="true"><i style="width:' + (w[1] / maxSec) * 100 + '%"></i></span></td>' +
        '<td class="num">' + wpm(w[2], w[1]) + "</td>" +
        '<td class="num">' + nf.format(w[3]) + "</td>";
      tb.appendChild(tr);
    });
    var facts = [];
    var opener = openerOf(ep);
    if (opener) facts.push(opener + " spricht als Erstes.");
    var run = longestRun(ep);
    if (run) facts.push("Längster Redeanteil am Stück: " + ep.data.who[run[0]][0] + ", " + hoursLong(run[2]) + " ab " + clock(run[1]) + ".");
    if (ep.data.gap && ep.data.gap[0] >= 20) facts.push("Längste Pause " + hoursLong(ep.data.gap[0]) + " ab " + clock(ep.data.gap[1]) + ".");
    if (ep.words && ep.words.swear && ep.words.swear.total) facts.push(nf.format(ep.words.swear.total) + " Schimpfwörter.");
    $("ep-facts").textContent = facts.join(" ");

    renderChapters(ep);
    if (t != null) { seek(t, true); S.route.t = null; }
  }

  function renderChapters(ep) {
    var ol = $("ep-chapters");
    ol.textContent = "";
    ol.appendChild(el("li", { class: "text-muted" }, "Kapitel laden …"));
    var p = S.chapterCache[ep.base];
    if (!p) {
      p = S.chapterCache[ep.base] = fetch(ep.chaptersUrl).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).then(parseChapters).catch(function () { return []; });
    }
    p.then(function (chapters) {
      if (S.renderedEp !== ep) return;
      ol.textContent = "";
      if (!chapters.length) { ol.appendChild(el("li", { class: "text-muted" }, "Für diese Folge gibt es keine Kapiteldatei.")); return; }
      chapters.forEach(function (ch) {
        var li = el("li");
        var b = el("button", { type: "button", "data-t": ch[0] });
        b.appendChild(el("span", { class: "ts" }, clock(ch[0], ep.data && ep.data.dur >= 3600)));
        b.appendChild(el("span", { class: "t" }, ch[1]));
        b.addEventListener("click", function () { seek(ch[0], true); });
        li.appendChild(b);
        ol.appendChild(li);
      });
    });
  }

  function seek(t, play) {
    var audio = $("ep-audio");
    var go = function () { audio.currentTime = Math.max(0, t); if (play) audio.play().catch(function () {}); };
    if (audio.readyState >= 1) go();
    else { audio.addEventListener("loadedmetadata", go, { once: true }); audio.load(); }
  }
  function onTime() {
    var ep = S.renderedEp;
    var audio = $("ep-audio");
    if (!ep || !ep.data) return;
    var head = $("ep-lanes").querySelector(".sz-playhead");
    var svg = $("ep-lanes").querySelector("svg");
    if (head && svg) {
      var wrap = $("ep-lanes").getBoundingClientRect();
      var r = svg.getBoundingClientRect();
      head.hidden = audio.paused && audio.currentTime === 0;
      head.style.left = (r.left - wrap.left + (audio.currentTime / ep.data.dur) * r.width) + "px";
    }
    var now = -1;
    var buttons = $("ep-chapters").querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) if (+buttons[i].getAttribute("data-t") <= audio.currentTime + 0.3) now = i;
    for (var k = 0; k < buttons.length; k++) buttons[k].classList.toggle("now", k === now);
  }

  /* ------------------------------------------------------------ view: person */

  /* `name` is a regular, "Gäste", or one individual guest (reachable from the Gäste table) */
  function renderPerson(name) {
    var all = aggregate(withData(S.episodes));
    var nav = $("pe-nav");
    nav.textContent = "";
    all.names.forEach(function (n) {
      var li = el("li", { class: n === name ? "active" : "", style: "--c:" + colorOf(n) });
      var a = el("a", { href: personHash(n) });
      a.appendChild(el("span", { class: "dot" }));
      a.appendChild(document.createTextNode(" " + n));
      li.appendChild(a);
      nav.appendChild(li);
    });
    var isMe = name === GUESTS
      ? function (w) { return w[0] !== UNKNOWN && !isRegular(w[0]); }
      : function (w) { return w[0] === name; };
    var mine = withData(S.episodes).filter(function (ep) { return ep.data.who.some(isMe); });
    var head = $("pe-head");
    var namesSec = $("pe-names-sec");
    namesSec.hidden = name !== GUESTS;
    if (!mine.length) {
      head.textContent = S.loading ? "Transkripte laden noch …" : name + " kommt in keinem Transkript vor.";
      $("pe-years").textContent = ""; $("pe-stats").textContent = ""; $("pe-top").textContent = ""; $("pe-names").textContent = "";
      return;
    }
    var sec = 0, words = 0, qs = 0, first = null, last = null, opened = 0, swears = 0;
    var co = {}, people = {};
    mine.forEach(function (ep) {
      ep.data.who.forEach(function (w) {
        if (isMe(w)) {
          sec += w[1]; words += w[2]; qs += w[3];
          var p = people[w[0]] || (people[w[0]] = { sec: 0, eps: 0, first: null, last: null });
          p.sec += w[1]; p.eps++;
          if (!p.first || ep.date < p.first) p.first = ep.date;
          if (!p.last || ep.date > p.last) p.last = ep.date;
        } else if (w[0] !== UNKNOWN) {
          var k = bucket(w[0]);
          co[k] = (co[k] || 0) + 1;
        }
      });
      if (!first || ep.date < first) first = ep.date;
      if (!last || ep.date > last) last = ep.date;
      var o = openerOf(ep);
      if (o && isMe([o])) opened++;
      if (ep.words && ep.words.swear) Object.keys(ep.words.swear.bySpeaker).forEach(function (sp) { if (isMe([sp])) swears += ep.words.swear.bySpeaker[sp]; });
    });
    var role = name === GUESTS ? " Alle, die nicht zur Stammbesetzung gehören, zusammen." : isRegular(name) ? "" : " Gast.";
    head.textContent = name + ": " + hoursLong(sec) + " in " + nf.format(mine.length) + " Folgen, " + pct(sec, all.speech) + " der gesamten Sprechzeit, " +
      fmtDate(first) + " bis " + fmtDate(last) + "." + role;

    // per year: hours of this person + share of that year's speech
    var box = $("pe-years");
    box.textContent = "";
    var byYear = {}, yearTotal = {};
    withData(S.episodes).forEach(function (ep) {
      var y = yearOf(ep);
      namedWho(ep).forEach(function (w) {
        yearTotal[y] = (yearTotal[y] || 0) + w[1];
        if (isMe(w)) byYear[y] = (byYear[y] || 0) + w[1];
      });
    });
    var max = 1;
    Object.keys(byYear).forEach(function (y) { if (byYear[y] > max) max = byYear[y]; });
    var color = colorOf(name);
    years().forEach(function (y) {
      if (!yearTotal[y]) return;
      var parts = {};
      parts[name] = byYear[y] || 0;
      var bar = stack(parts, max, false);
      Array.prototype.forEach.call(bar.children, function (i) { i.style.setProperty("--c", color); });
      box.appendChild(row(yearHash(y), y, bar, (byYear[y] ? nf1.format(byYear[y] / 3600) + " h <small>" + pct(byYear[y], yearTotal[y]) + "</small>" : "<small>–</small>")));
    });

    // stats
    var dl = $("pe-stats");
    dl.textContent = "";
    function add(term, html) { dl.appendChild(el("dt", null, term)); var dd = el("dd"); dd.innerHTML = html; dl.appendChild(dd); }
    var others = all.names.filter(function (n) { return n !== name && all.sec[n] >= 3600; }).map(function (n) { return wpm(all.words[n], all.sec[n]); });
    var avgOthers = others.length ? Math.round(others.reduce(function (a, b) { return a + b; }, 0) / others.length) : 0;
    add("Tempo", wpm(words, sec) + " Wörter pro Minute" + (avgOthers ? " (die anderen im Schnitt " + avgOthers + ")" : "") + ", " + nf.format(words) + " Wörter insgesamt.");
    add("Fragen", nf.format(qs) + " Sätze mit Fragezeichen, " + Math.round(qs / Math.max(1, sec / 3600)) + " pro Stunde.");
    var mono = null;
    mine.forEach(function (ep) {
      ep.data.segs.forEach(function (s) {
        var w = ep.data.who[s[0]];
        if (w && isMe(w) && (!mono || s[2] > mono.run[2])) mono = { ep: ep, run: s, who: w[0] };
      });
    });
    if (mono) add("Längster Redeanteil am Stück", hoursLong(mono.run[2]) + (name === GUESTS ? " (" + esc(mono.who) + ")" : "") + ' in <a href="' + epHash(mono.ep, mono.run[1]) + '">' + esc(mono.ep.label) + " · " + esc(mono.ep.title) + "</a> ab " + clock(mono.run[1]) + ".");
    add("Eröffnet die Sendung", nf.format(opened) + " Mal.");
    if (S.wordRe) add("Schimpfwörter", nf.format(swears) + " Mal, " + nf1.format(swears / Math.max(1, sec / 3600)) + " pro Stunde Sprechzeit.");
    var coNames = Object.keys(co).sort(function (a, b) { return co[b] - co[a]; }).slice(0, 5);
    if (coNames.length) add("Am häufigsten zusammen mit", coNames.map(function (n) { return '<a href="' + personHash(n) + '">' + esc(n) + "</a> (" + nf.format(co[n]) + ")"; }).join(", ") + ".");

    // the individual names behind "Gäste"
    var tbn = $("pe-names");
    tbn.textContent = "";
    if (name === GUESTS) {
      Object.keys(people).sort(function (a, b) { return people[b].sec - people[a].sec; }).forEach(function (n) {
        var p = people[n];
        var tr = el("tr", { style: "--c:" + colorOf(n), tabindex: "0", role: "link" });
        tr.innerHTML =
          '<td class="name"><b>' + esc(n) + "</b></td>" +
          '<td class="num">' + esc(hoursLong(p.sec)) + "</td>" +
          '<td class="num">' + nf.format(p.eps) + "</td>" +
          '<td class="when">' + (p.first === p.last ? esc(fmtDate(p.first)) : esc(fmtDate(p.first)) + " bis " + esc(fmtDate(p.last))) + "</td>";
        var go = function () { location.hash = personHash(n); };
        tr.addEventListener("click", go);
        tr.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
        tbn.appendChild(tr);
      });
    }

    // top episodes by share
    var top = mine.map(function (ep) {
      var s = 0;
      ep.data.who.forEach(function (w) { if (isMe(w)) s += w[1]; });
      return { ep: ep, share: s / Math.max(1, speechOf(ep)), sec: s };
    }).filter(function (x) { return x.sec >= 300 || mine.length <= 3; }).sort(function (a, b) { return b.share - a.share; }).slice(0, 8);
    var list = $("pe-top");
    list.textContent = "";
    top.forEach(function (x) { list.appendChild(episodeRow(x.ep, true)); });
  }

  /* ------------------------------------------------------------ view: search */

  function searchRegex(q, prefix) {
    var escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var lookbehind = "(?<![\\p{L}\\p{N}])";
    var lookahead = prefix ? "" : "(?![\\p{L}\\p{N}])";
    try { return new RegExp(lookbehind + escaped + lookahead, "giu"); }
    catch (e) { return new RegExp("(^|[^A-Za-zÄÖÜäöüß0-9])" + escaped + (prefix ? "" : "(?![A-Za-zÄÖÜäöüß0-9])"), "gi"); }
  }
  /* A query that names one of the counted terms searches with that term's
     spelling variants, so the search agrees with the numbers under Rekorde. */
  function knownTerm(q) {
    var k = q.trim().toLowerCase();
    var hit = null;
    Object.keys(TERM_GROUPS).forEach(function (g) {
      TERM_GROUPS[g].forEach(function (t) { if (t[0].toLowerCase() === k || t[0].split(" ")[0].toLowerCase() === k) hit = t; });
    });
    if (!hit) return null;
    try { return { label: hit[0], re: new RegExp("(?<![\\p{L}])(?:" + hit[1] + ")(?![\\p{L}])", "giu") }; }
    catch (e) { return null; }
  }
  function mentions(text, re, maxSnippets) {
    var hay = searchable(text);
    var count = 0, snippets = [], m;
    re.lastIndex = 0;
    while ((m = re.exec(hay))) {
      count++;
      if (snippets.length < maxSnippets) {
        var arrow = text.lastIndexOf("-->", m.index);
        if (arrow >= 0) {
          var lineStart = text.lastIndexOf("\n", arrow) + 1;
          var ts = parseTs(text.slice(lineStart, arrow));
          var lineEnd = text.indexOf("\n", arrow);
          var blockEnd = text.indexOf("\n\n", lineEnd);
          if (blockEnd < 0) blockEnd = text.length;
          var body = text.slice(lineEnd + 1, blockEnd).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
          var speaker = /<v ([^>]*)>/.exec(text.slice(lineEnd + 1, blockEnd));
          snippets.push([ts, body, speaker ? canon(speaker[1]) : null]);
        }
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    return { count: count, snippets: snippets };
  }

  function runSearch(q, prefix) {
    q = q.trim();
    var token = ++S.searchToken;
    var head = $("se-head"), yearsBox = $("se-years"), results = $("se-results");
    yearsBox.textContent = ""; results.textContent = "";
    if (q.length < 2) { head.textContent = "Mindestens zwei Zeichen."; return; }
    var known = prefix ? null : knownTerm(q);
    var re = known ? known.re : searchRegex(q, prefix);
    var shown = known ? known.label + " (mit Schreibvarianten der Spracherkennung)" : q;
    var list = withData(S.episodes);
    head.textContent = "Suche „" + shown + "“ in " + nf.format(list.length) + " Folgen …";
    var found = [], byYear = {}, total = 0, done = 0;
    var queue = list.slice();
    var active = 0;
    function finish() {
      if (token !== S.searchToken) return;
      found.sort(function (a, b) { return b.count - a.count || (a.ep.date < b.ep.date ? 1 : -1); });
      head.textContent = total ? nf.format(total) + (total === 1 ? " Erwähnung" : " Erwähnungen") + " von „" + shown + "“ in " + nf.format(found.length) + " von " + nf.format(list.length) + " Folgen" +
        (S.loading ? " (Transkripte laden noch, die Suche läuft danach noch einmal)" : "") + "."
        : S.loading ? "Noch nichts gefunden, die Transkripte laden noch. Die Suche läuft danach noch einmal."
        : "„" + shown + "“ kommt in keiner Folge vor.";
      yearsBox.textContent = "";
      var max = 1;
      Object.keys(byYear).forEach(function (y) { if (byYear[y] > max) max = byYear[y]; });
      if (total) years().forEach(function (y) {
        var parts = {}; parts["Treffer"] = byYear[y] || 0;
        var bar = stack(parts, max, false);
        Array.prototype.forEach.call(bar.children, function (i) { i.style.setProperty("--c", "#7FAF1B"); i.title = y + ": " + (byYear[y] || 0); });
        yearsBox.appendChild(row(null, y, bar, nf.format(byYear[y] || 0)));
      });
      results.textContent = "";
      found.slice(0, 60).forEach(function (f) {
        var box = el("div", { class: "sz-result" });
        var h = el("div", { class: "head" });
        h.appendChild(el("a", { href: epHash(f.ep) }, f.ep.label + " · " + f.ep.title));
        h.appendChild(el("span", { class: "text-muted small" }, fmtDate(f.ep.date)));
        h.appendChild(el("span", { class: "count" }, f.count + (f.count === 1 ? " Erwähnung" : " Erwähnungen")));
        box.appendChild(h);
        var ul = el("ul");
        f.snippets.forEach(function (s) {
          var li = el("li");
          li.appendChild(el("span", { class: "ts" }, clock(s[0], f.ep.data.dur >= 3600)));
          var a = el("a", { href: epHash(f.ep, s[0]) });
          var txt = s[1].length > 220 ? s[1].slice(0, 220) + "…" : s[1];
          re.lastIndex = 0;
          a.innerHTML = (s[2] ? '<span class="text-muted">' + esc(s[2]) + ": </span>" : "") + esc(txt).replace(re, function (mm) { return "<mark>" + mm + "</mark>"; });
          li.appendChild(a);
          ul.appendChild(li);
        });
        if (f.count > f.snippets.length) {
          var more = el("li", { class: "text-muted" });
          more.appendChild(el("span"));
          more.appendChild(el("span", null, "… und " + (f.count - f.snippets.length) + " weitere"));
          ul.appendChild(more);
        }
        box.appendChild(ul);
        results.appendChild(box);
      });
      if (found.length > 60) results.appendChild(el("p", { class: "text-muted small" }, "Nur die 60 Folgen mit den meisten Erwähnungen werden gezeigt."));
    }
    function next() {
      if (token !== S.searchToken) return;
      if (!queue.length && active === 0) { finish(); return; }
      while (active < 12 && queue.length) {
        (function (ep) {
          active++;
          textOf(ep).then(function (text) {
            if (token !== S.searchToken) return;
            var r = mentions(text, re, 3);
            if (r.count) { found.push({ ep: ep, count: r.count, snippets: r.snippets }); total += r.count; byYear[yearOf(ep)] = (byYear[yearOf(ep)] || 0) + r.count; }
          }).catch(function () {}).then(function () {
            active--; done++;
            if (done % 25 === 0 && token === S.searchToken) head.textContent = "Suche „" + shown + "“ … " + nf.format(done) + " von " + nf.format(list.length) + " Folgen";
            next();
          });
        })(queue.shift());
      }
    }
    next();
  }

  /* ------------------------------------------------------------ boot */

  function wire() {
    window.addEventListener("hashchange", onRoute);
    var audio = $("ep-audio");
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onTime);
    $("se-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("se-q").value.trim();
      navigate("#/suche/" + encodeURIComponent(q), false);
      if (S.route.view === "search" && S.route.q === q) runSearch(q, $("se-prefix").checked);
    });
    $("se-prefix").addEventListener("change", function () {
      var q = $("se-q").value.trim();
      if (q) runSearch(q, $("se-prefix").checked);
    });
    if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { renderView(); });
    var clear = el("button", { type: "button", class: "btn btn-link btn-xs" }, "Zwischenspeicher leeren und neu laden");
    clear.addEventListener("click", function () { dbClear(S.db).then(function () { location.reload(); }); });
    ROOT.querySelector(".sz-method").appendChild(clear);
  }

  function boot() {
    wire();
    S.wordRe = compileWordRegexes();
    if (window.caches) caches.delete(LEGACY_CACHE).catch(function () {}); // ~90 MB from the first version
    var indexUrl = ROOT.getAttribute("data-index") || "/index.json";
    fetch(indexUrl).then(function (r) {
      if (!r.ok) throw new Error("Suchindex nicht erreichbar (HTTP " + r.status + ")");
      return r.json();
    }).then(function (index) {
      S.episodes = buildEpisodes(index);
      S.episodes.forEach(function (ep) { S.bySlug[ep.slug] = ep; S.byBase[ep.base] = ep; });
      $("sz-progress").textContent = nf.format(S.episodes.length) + " Folgen gefunden.";
      return openDb();
    }).then(function (db) {
      S.db = db;
      return dbReadAll(db);
    }).then(function (cached) {
      var fromCache = 0;
      S.episodes.forEach(function (ep) {
        var rec = cached[ep.base];
        if (rec) { ep.data = rec.data; ep.words = rec.words || null; ep.lm = rec.lm || null; fromCache++; }
      });
      onRoute();
      var missing = S.episodes.length - fromCache;
      var saveData = navigator.connection && navigator.connection.saveData;
      if (missing && saveData) {
        setProgress(fromCache, S.episodes.length);
        $("sz-start-wrap").hidden = false;
        $("sz-start").addEventListener("click", function () {
          $("sz-start-wrap").hidden = true;
          loadAll();
        }, { once: true });
      } else loadAll();
    }).catch(function (err) {
      $("sz-progress-wrap").hidden = true;
      $("sz-progress").textContent = "Die Seite konnte die Folgenliste nicht laden: " + (err.message || err);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
