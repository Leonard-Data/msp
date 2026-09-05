# MSP Portal

Reusable Astro documentation portal for GitHub Pages.

## What it does

- Aggregates markdown from multiple repositories listed in `sources.yml`
- Keeps docs in the owning repo
- Generates docs navigation automatically
- Builds a static searchable portal
- Uses GitHub issue forms and Actions for V1 source requests

## Local development

```bash
npm install
npm run dev
```

## Source contract

Each source repository needs:

- `docs/`
- `.docs-source.yml`

Example metadata:

```yml
id: powerapps-ui
name: Power Apps UI
category: Power Platform
description: Reusable Power Apps components and UI guidance.
docs_path: docs
tags: [powerapps, ui]
navigation: [guides, patterns]
```

## Registry

Register sources in `sources.yml`.

- `localPath` is supported for local/demo sources.
- Without `localPath`, the sync script clones `repo` from GitHub.

## Commands

- `npm run sync` — sync source repositories
- `npm run prepare:docs` — sync + build generated docs metadata
- `npm run build` — sync sources, prepare generated docs, and build Astro
- `npm run build:static` — build from committed generated docs without cloning sources
- `npm run validate:sources` — validate source definitions

## GitHub Pages

`deploy.yml` builds Astro from committed generated docs and deploys `dist/` to GitHub Pages.
Use the scheduled source-sync workflow to refresh cloned source content.

## V1 automation notes

The issue forms and `create-section.yml` are scaffolds.
Wire your org secrets before enabling self-service repo creation:

- `MSP_ADMIN_TOKEN` or a GitHub App token
- `MSP_SYNC_TOKEN` for cross-repo cloning when needed
- `MSP_TEMPLATE_REPOSITORY` repo variable for template generation

`create-section.yml` intentionally stops short of mutating `sources.yml` automatically until those org details are known.

skipped: full GitHub App provisioning, add when org secrets and template repo are finalized.
