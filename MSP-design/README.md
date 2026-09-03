# Web Prototype Design System

A reusable design system extracted from the Web Prototype project. Notion-inspired warm minimalism applied to developer documentation — serif display headings, near-black text, warm neutrals, whisper-weight borders, multi-layer shadows.

## Product Overview

**Source product**: MSP Documentation Protocol — a docsify-aligned documentation site template for AI engineering content. The source artifact (`docs-protocol.html`, 46 KB) is a complete documentation page with sticky topnav, left sidebar (264px), main content (max 70ch), and optional right TOC sidebar (232px).

**Primary surface**: Developer documentation / knowledge base websites.

**Core capabilities**:
- Three-column documentation layout with responsive collapse
- Warm neutral palette with dark mode support
- Serif + sans-serif type pairing for editorial readability
- Component system: callout cards, CTA cards, comparison tables, pill badges, navigation

## Package Contents

```
├── DESIGN.md                    # Full spec (9 sections, source-context backed)
├── README.md                    # This file
├── SKILL.md                     # Agent skill with YAML frontmatter
├── colors_and_type.css          # Reusable CSS custom properties (light + dark tokens)
├── context/
│   ├── source-context.md        # Original source project metadata
│   └── provenance.md            # Design system generation notes
├── assets/
│   ├── logo-mark.svg            # 28×28 brand icon (black badge with "M")
│   ├── wordmark.svg             # Logo mark + "MSP Docs" wordmark
│   ├── favicon.svg              # 32×32 browser favicon
│   ├── icons.svg                # SVG sprite with 10 source-extracted icons
│   └── README.md                # Asset directory documentation
├── build/
│   ├── icon-manifest.json       # PWA web app manifest
│   ├── tokens.json              # Machine-readable DTCG token export
│   ├── source_examples/         # Preserved component snapshots from source
│   │   ├── article-header.html  # Article header with breadcrumb, byline, actions
│   │   ├── toc-sidebar.html     # Right TOC sidebar with share buttons
│   │   └── comparison-table.html# ML vs AI Engineer comparison table
│   └── README.md                # Build artifacts documentation
├── preview/                     # Focused preview cards
│   ├── colors-primary.html      # Color palette swatches + contrast verification
│   ├── typography-specimens.html# Font specimens with hierarchy examples
│   ├── spacing-tokens.html      # Spacing scale, layout dimensions, radius
│   ├── radius-shadows.html      # Border radius + multi-layer shadow levels
│   ├── components-buttons.html  # Buttons, badges, pills, nav, callouts, tables
│   └── brand-assets.html        # Logo marks, favicons, font previews, source ref
├── ui_kits/app/
│   ├── index.html               # Composed full-page UI (loads modular components)
│   ├── README.md                # Kit documentation with full reuse guide
│   ├── navigation.html          # Topnav, sidebar, TOC patterns
│   ├── cards.html               # Card system (standard, shadow, CTA, callout, grid)
│   ├── forms.html               # Buttons, inputs, badges, forms, focus states
│   └── components/              # Modular fragments for dynamic loading
│       ├── navigation.html      # Topnav + sidebar fragment
│       ├── cards.html           # Card system fragment
│       └── forms.html           # Forms & inputs fragment
└── docs-protocol.html           # Preserved source artifact (46 KB)
```

## Preview Manifest

Reviewers should inspect these files in order:

| Order | File | What to Check |
|-------|------|---------------|
| 1 | `preview/colors-primary.html` | Color palette accuracy, contrast ratios |
| 2 | `preview/typography-specimens.html` | Font pairing, hierarchy, readability |
| 3 | `preview/spacing-tokens.html` | Spacing scale, section alternation |
| 4 | `preview/components-buttons.html` | Button states, badges, navigation |
| 5 | `preview/radius-shadows.html` | Shadow levels, card examples |
| 6 | `preview/brand-assets.html` | Logo, favicon, font specimens, source reference |
| 7 | `ui_kits/app/index.html` | Applied interface — full page composition |
| 8 | `docs-protocol.html` | Source artifact — original design reference |

## Tokens Summary

- **6 light tokens** (`--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent`)
- **6 dark tokens** (same structure via `--dark-*` prefixed vars, activated by `prefers-color-scheme: dark`)
- **3 font stacks** (display: Source Serif 4, body: Inter/system-ui, mono: JetBrains Mono)
- **7 type sizes** (h1–h4, body, sm, xs)
- **7 spacing tokens** (xs through 2xl)
- **4 radius tokens** (sm, default, lg, xl)
- **6 Notion semantic colors** (Notion Blue, Warm White, Warm Dark, etc.)

## Design Principles

1. **Warm minimalism** — Notion's warm neutrals, never cold grays or purple
2. **Whisper borders** — `1px solid rgba(0,0,0,0.08)` for structure without weight
3. **Serif + sans pairing** — Source Serif 4 for display, Inter/system-ui for body
4. **Multi-layer shadows** — 4–5 layer shadow stacks with opacity ≤ 0.05
5. **One accent** — Black (#000000) for CTAs; Notion Blue (#0075de) for links
6. **Dark mode** — Built-in via `prefers-color-scheme: dark`

## Claude Design Package Reuse Guide

### Source / Context References

| Reference | Path | Description |
|-----------|------|-------------|
| Source artifact | `docs-protocol.html` | Original MSP Documentation Protocol (46 KB) |
| Source metadata | `context/source-context.md` | Project provenance and creation metadata |
| Provenance notes | `context/provenance.md` | Design system generation documentation |

### Package Contents for Reuse

| Category | Paths |
|----------|-------|
| Design tokens | `colors_and_type.css` |
| Full spec | `DESIGN.md` |
| Agent skill | `SKILL.md` |
| Preview cards | `preview/colors-primary.html`, `preview/typography-specimens.html`, `preview/spacing-tokens.html`, `preview/radius-shadows.html`, `preview/components-buttons.html`, `preview/brand-assets.html` |
| Preserved source | `docs-protocol.html` |
| Source examples | `build/source_examples/` (article-header, toc-sidebar, comparison-table) |
| Machine tokens | `build/tokens.json` |
| Icon manifest | `build/icon-manifest.json` |
| SVG assets | `assets/` (logo-mark, wordmark, favicon, icons sprite) |
| UI kit (standalone) | `ui_kits/app/navigation.html`, `ui_kits/app/cards.html`, `ui_kits/app/forms.html` |
| UI kit (composed) | `ui_kits/app/index.html` |
| UI kit (modular) | `ui_kits/app/components/` |

### Reuse Workflow

1. **Inspect** the source artifact (`docs-protocol.html`) for the reference implementation.
2. **Bind** `colors_and_type.css` tokens into your project's `:root`.
3. **Preview** each preview card to verify token application.
4. **Copy** component patterns from `ui_kits/app/` as needed.
5. **Review** Section 9 (Anti-patterns) in DESIGN.md before generating.

### Review Workflow

1. Open `preview/colors-primary.html` — verify palette matches source.
2. Open `preview/typography-specimens.html` — verify font pairing and hierarchy.
3. Open `ui_kits/app/index.html` — verify applied composition.
4. Open `docs-protocol.html` — compare against the original source.
5. Check `DESIGN.md` Sections 6–9 for component rules and anti-patterns.
