# MSP Portal

MSP is a reusable Astro documentation portal that aggregates markdown from multiple repositories into one searchable site.

## Core flow

1. Register a source in `sources.yml`
2. Sync repository docs into the portal
3. Generate navigation and search data
4. Publish to GitHub Pages

## What ships in this starter

- Multi-repository source registry
- Searchable docs experience
- Auto-generated docs navigation: a collapsible desktop/mobile sidebar toggle near the header, a desktop-only table of contents, and a native mobile browse fallback when scripts are unavailable
- GitHub issue forms for source requests
- GitHub Actions for sync and Pages deploy
