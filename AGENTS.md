# AGENTS.md

Notes for coding agents working on **serious-bg**, the website for the Binärgewitter podcast
(https://blog.binaergewitter.de/). Since January 2026 (PR #489, `191f3c8`) the site is a plain
Hugo site. The Jekyll/Ruby setup it came from is gone. `README.md` has the user-facing overview;
this file covers what you need to change the code safely.

## Stack at a glance

- **Hugo v0.154.2 extended.** CI and the Dockerfile pin this version, so use the same one locally.
  Templates are Go templates with no npm/JS build step.
- **Content mounts** (`hugo.toml` `[module]`): `articles/` becomes `content/post`, `pages/` becomes
  `content/pages`, and `static/img` is also served as `/images`.
- **Hosting:** Fly.io (`fly.toml`, app `bg`, region `fra`). A multi-stage `Dockerfile` builds with
  Hugo and serves `public/` from nginx on Alpine (`nginx.conf`). Fly terminates TLS and forces HTTPS.
- **CI** (`.github/workflows/main.yml`): `hugo --minify`, then `gzip -k public/index.json`, then
  `node tests/test.js`. On `main` it deploys with `flyctl deploy --remote-only`. It also runs a
  **nightly cron at 04:17 UTC** plus `workflow_dispatch`, both with `--no-cache`, so the Sprechzeit
  numbers pick up corrected transcripts without a new commit.
- **PR screenshots** (`.github/workflows/pr-screenshots.yml`, `.github/scripts/`): every PR builds
  the site and runs Playwright to capture the front page at desktop (1280px, full page) and mobile
  (390px, viewport only). The images go to the orphan branch `pr-previews` and appear in a sticky
  PR comment. This only works for same-repo PRs, not forks.

## Commands

```sh
hugo server                 # dev server on :1313
hugo --minify               # production build into public/
gzip -k public/index.json   # tests expect the .gz next to it
node tests/test.js          # needs a built public/; some checks hit download.binaergewitter.de
```

The full build downloads every episode's transcript (~400 VTT files) from
`download.binaergewitter.de` and needs about 1.2 GB of RAM. The Dockerfile uses
`GOGC=off GOMEMLIMIT=900MiB` for this. `hugo.toml` caches remote resources for 24h, so a local
build is fast after the first run.

## Content

### Episodes (`articles/`)

- File name: `YYYY-MM-DD-binaergewitter-talk-number-NNN.md`. Older files use `.markdown`.
  Permalink: `/:year/:month/:day/:slug`. Legacy `/blog/...` URLs get a 301 from nginx.
- Front matter used by the templates (see `articles/2026-11-11-binaergewitter-talk-number-389.md`):

  ```yaml
  layout: post
  title: "Binärgewitter Talk #389: …"   # the "#NNN" is parsed for the episode number
  date: 2026-11-11 15:00:00
  description: "…"                      # short plain-text summary, used for the front-page teaser and meta tags
  comments: true                        # Isso comments
  categories: talk                      # talk | spezial | westcoast (these drive the feeds)
  chapters: https://download.binaergewitter.de/<base>.chapters.txt
  transcript: https://download.binaergewitter.de/<base>-speech.json   # must match the audio base name
  audioformats: { mp3: …, ogg: …, opus: …, m4a: … }
  voices: { ingo: true, felix: true, … } # keys must exist in hugo.toml [params.contributors]
  ```

- The tests require `title` and `date` on every article. Every episode with audio needs a
  `transcript` whose URL is `<audio base>-speech.json`. The `.vtt` URL is derived from it
  (`layouts/partials/transcript_vtt.html`).
- **Creating a new episode:** use `articles/scripts/new_episode.py <YYYY-MM-DD.Binaergewitter.Talk.NNN> --posts-dir articles`.
  It copies the newest post as a template. It fetches title, description (from Auphonic's
  `summaries.brief`), audio, chapters and transcript links from `download.binaergewitter.de`. It
  logs in to the Keycloak-protected Etherpad (`ETHERPAD_USER`/`ETHERPAD_PASSWORD` or `~/.netrc`)
  to fetch the shownotes. Run `--help` for the options. Don't commit `__pycache__`.
- New contributors: add them to `[params.contributors]` in `hugo.toml`, and for Sprechzeit also to
  `aliases` in `data/sprechzeit.yaml`.

### Pages (`pages/`)

`abonnieren`, `impressum`, `live`, `spenden` (Steady comes first), `ueber-uns` (includes the
transcript attribution, CC BY-SA). Isso comments are excluded on pages, and a test checks this.

## Features and where they live

| Feature | Files | Notes |
|---|---|---|
| Base layout, nav, sidebar | `layouts/_default/baseof.html`, `partials/navigation.html`, `sidebar.html`, `social_icons.html` | `<meta charset>` must stay in the first 1024 bytes (tested). GitHub fork ribbon is top-left on desktop and bottom-left below 768px (`static/css/github-ribbon.css`, keep the `-webkit-` prefixes for iOS). |
| Front page | `layouts/index.html`, `partials/article_summary.html` | The newest episode shows `description` plus whole shownote sections up to ~1500 chars, cut only before an `<h2>`. Other teasers use `description`. Don't use `.Summary`: it cuts through lists and leaves broken HTML. |
| Episode page | `layouts/post/single.html`, `partials/episode_extras.html`, `episode_meta.html` | `episode_meta.html` is the single source for chapters, duration (also HH:MM:SS), file sizes, transcript URL, formats and episode number. It fetches chapters and Auphonic JSON at build time. Chapters are rendered server-side as an `<ol>`. |
| Podlove Web Player | `partials/podlove.html`, `podlove_config.html`, `podcast_controls.html`; self-hosted in `static/podlove-web-player/` (5.13.0) | `podlove.html` builds the episode object and `podlove_config.html` the player config. The blog and Sprechzeit share them. |
| Podcast feeds | `content/podcast_feed/_content.gotmpl` (content adapter), `layouts/_default/podcast_feed.rss.xml` | 4 categories (`all talk spezial westcoast`) × 4 codecs (`mp3 ogg opus m4a`) at `/podcast_feed/<cat>/<codec>/rss.xml` (100 items) and `/archive/` (unlimited). They carry `psc:chapters`, `podcast:transcript` (JSON and VTT), `podcast:funding` (Steady and the donate page), and integer enclosure lengths. nginx redirects legacy `atom.xml` and `itunes/` URLs. |
| Site/list RSS | `layouts/_default/rss.xml` | Category term pages list only their own posts. Home, `/post/`, `/pages/`, `/podcast_feed/` and `/categories/` fall back to all posts. GUIDs always use `isPermaLink="false"` and must not change. |
| Search | `layouts/index.json` (home JSON output), `partials/search.html`, `static/js/flexsearch.bundle.js` | FlexSearch with German settings. One fetch of `/index.json`, served Brotli/gzip-precompressed by nginx. Queries are regex- and HTML-escaped. `/?q=term` works and is the JSON-LD `SearchAction`. The index also exposes per-episode metadata (date, categories, number, formats, chapter/transcript URLs) for machine readers, so keep that public shape stable. |
| Structured data | `partials/schema.html`, `head_meta.html` | JSON-LD `PodcastEpisode` (duration, number, actors, transcript, formats), `WebSite` and `SearchAction` on home, OG/Twitter tags. Canonical and `og:url` use trailing-slash URLs. |
| `latest-show` | `layouts/index.latestshow` | Plain-text output at `/latest-show` with the number of the newest *talk* episode. External tooling uses it. |
| Live indicator | `partials/live_check.html` | Polls `/api/stream-status`, which nginx proxies to the RadioTux Icecast. |
| Comments | `partials/isso.html` | Isso at `comments.binaergewitter.de`; on localhost a placeholder is shown instead. |
| Archives | `content/archives.md`, `layouts/_default/archives.html` | |
| **Sprechzeit** | `content/sprechzeit.md`, `layouts/_default/sprechzeit.html`, `layouts/partials/sprechzeit/*`, `assets/js/sprechzeit.js`, `assets/css/sprechzeit.css`, `data/sprechzeit.yaml` | See below. |

## Sprechzeit (`/sprechzeit/`)

Speaking-time statistics for every episode, computed from the WebVTT transcripts (`<v Speaker>` cues).

- **Computed at build time, not in the browser.** `partials/sprechzeit/data.html` loops over all
  posts with an mp3. `partialCached "sprechzeit/episode.html"` fetches each VTT and computes
  per-speaker times, segments, tempo, term counts and a word list. This work happens while episode
  pages render, because those render in parallel. Done on a single page, it would block the build
  for over a minute.
- **Output:** a fingerprinted `/sprechzeit/data.<hash>.json` and a word index
  `/sprechzeit/words.<hash>.txt`, with one `word id id …` line per word, so the search downloads only
  the transcripts that can match. Each episode also gets a fingerprinted
  `/sprechzeit/player/<base>.<hash>.json` (the Podlove episode, loaded when you open that episode).
  The episode's chapters come from that file too.
- **Segment starts are delta-encoded** (`segsDelta`). `buildEpisodes()` in `sprechzeit.js` decodes
  them, and `tests/test.js` runs that function in a VM, so keep its name and the IIFE shape.
- `data/sprechzeit.yaml` holds speaker **aliases** and the **term** regexes (filesystems, BSDs,
  swear words). The build (Go RE2) and the browser (JS) both use the same regexes, so **patterns
  must be valid in both: no lookaround, no backreferences.**
- A fixed core cast gets its own row, colour and page. Everyone else is grouped under "Gäste".
- Fetch errors: a 404 (transcript not uploaded yet) is a warning. Other errors (5xx, timeout) are
  `errorf` and **fail the build**, so a half-empty dataset never goes live.
- **Hash routes in the UI:** `#/`, `#/jahr/2016`, `#/folge/talk-388[/sec]`, `#/person/Felix`, `#/suche/docker`.
- JS and CSS live in `assets/` and go through `minify | fingerprint`, because nginx serves `*.js`
  and `*.css` as `immutable` for a year. Anything new in `static/js` or `static/css` would also be
  cached for a year, so put new JS/CSS in `assets/`.
- Performance matters here (build time, memory, payload size). Performance refactors have kept the
  generated output byte-identical, so compare `public/` before and after.

## nginx and deploy gotchas

- `absolute_redirect off`: Fly sees plain HTTP, so absolute redirects would bounce through `http://`.
- `gzip_proxied any`: without it, nginx skips compression behind Fly's proxy, which adds a `Via` header.
- `brotli_static on`: the Dockerfile precompresses `index.json` and the Sprechzeit data/word files
  with `brotli -q 9`. If you add another large generated asset, add it to that `RUN brotli` line.
- `hugo.toml` `[security.http]` allows only `GET` to `download.binaergewitter.de`. Any other remote
  host used through `resources.GetRemote` must be added there.
- `.git` is in `.dockerignore`.

## Conventions

- Site copy, commit messages and PR titles are mostly **German**. Write commit bodies that explain
  *why*.
- When you change templates, extend `tests/test.js`. It is a single dependency-free Node script with
  one `testXxx()` function per area.
- Episode-only commits are usually named `bgtNNN`.
