# Binärgewitter Blog

The official blog for the [Binärgewitter](https://blog.binaergewitter.de/) podcast, built with [Hugo](https://gohugo.io/).

## Features

- **100% Native Hugo**: No external scripts or dependencies
- **Podcast Integration**: Dynamic RSS feeds for all categories and codecs
- **FlexSearch Integration**: High-performance client-side search with German linguistic support
- **Optimized Index**: Gzipped `searchindex.json` with maximum compression and local fallback
- **Responsive Design**: Mobile-friendly Bootstrap-based layout
- **Fly.io Deployment**: Automated Docker-based deployment

## Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) v0.111.3 or later (extended version)

### Local Development

```bash
# Start the development server
hugo server

# Build the site
hugo
```

The site will be available at `http://localhost:1313/`.

### Creating New Posts

```bash
# Create a new post (uses archetype for automatic metadata)
hugo new post/YYYY-MM-DD-your-post-title.md
```

The archetype automatically generates:
- Title (derived from filename)
- Date and time
- Legacy `/blog/` aliases for SEO
- Front matter structure

## Project Structure

```
.
├── articles/          # Blog posts (mounted as content/post)
├── pages/            # Static pages (mounted as content/pages)
├── layouts/          # Hugo templates
│   ├── _default/     # Base templates
│   ├── partials/     # Reusable components
│   └── index.json       # Search index template (generates searchindex.json)
├── static/           # Static assets (CSS, JS, images)
├── archetypes/       # Content templates
└── content/
    └── podcast_feed/ # Dynamic feed generation via _content.js
```

## Deployment

The site is automatically deployed to Fly.io via GitHub Actions on every push to `main`.

### Manual Deployment

```bash
# Deploy to Fly.io
flyctl deploy
```

## Technical Highlights

- **Native Content Adapters**: Podcast feeds generated via `_content.js`
- **Optimized Search**: Gzipped FlexSearch index (`searchindex.json`) with German stemming/stopwords
- **Remote Resources**: Podcast metadata and chapters fetched during build
- **Zero Python**: Fully native Hugo build pipeline

## License

Content licensed under [Creative Commons BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).
