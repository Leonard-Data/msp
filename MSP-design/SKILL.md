---
name: Web Prototype Design System
description: Notion-inspired warm minimalism for developer documentation — serif display, near-black text, warm neutrals, whisper borders.
user-invocable: true
---

# Web Prototype Design System — Agent Skill

## What Is Inside

A complete design system extracted from the Web Prototype project (MSP Documentation Protocol). Includes:

- Full DESIGN.md with 9 specification sections
- `colors_and_type.css` with all CSS custom property tokens (light + dark)
- 6 focused preview cards (colors, typography, spacing, radius/shadows, components, brand assets)
- Applied UI kit with composed index page, standalone component files, and modular fragments
- Preserved source artifact (`docs-protocol.html`, 46 KB)
- Preserved source examples in `build/source_examples/` (article-header, toc-sidebar, comparison-table)
- Machine-readable token export (`build/tokens.json`) and icon manifest (`build/icon-manifest.json`)
- SVG assets (`assets/`): logo-mark, wordmark, favicon, icon sprite
- Provenance notes in `context/`

## Source Context

This system was generated from a real artifact: `docs-protocol.html` (MSP Documentation Protocol — a docsify-aligned documentation site). The CSS tokens, layout dimensions, component shapes, and interaction patterns were extracted directly from that file. The visual direction inherits from the Notion design system (warm neutrals, whisper borders, multi-layer shadows).

## When to Use

- Developer documentation sites and knowledge bases
- Product documentation with sidebar navigation
- AI/ML engineering educational content
- Protocol or API reference documentation
- Any project needing a warm, readable, minimal docs aesthetic

## How to Use

1. **Bind tokens**: Import `colors_and_type.css` or copy its `:root` block into your project.
2. **Reference DESIGN.md** for all component rules, layout dimensions, and anti-patterns.
3. **Inspect preview cards**: Open `preview/` files in a browser to see applied tokens.
4. **Copy UI kit patterns**: `ui_kits/app/` contains reusable component HTML (standalone files) and modular fragments (`components/`).
5. **Check source examples**: `build/source_examples/` has preserved component snapshots from the source artifact.
6. **Review anti-patterns** (Section 9 in DESIGN.md) before generating.

## Design System Highlights

| Feature | Detail |
|---------|--------|
| **Palette** | White bg, near-black fg, warm neutrals, black accent, Notion Blue for links |
| **Typography** | Source Serif 4 (display) + Inter/system-ui (body) + JetBrains Mono (code) |
| **Borders** | `1px solid rgba(0,0,0,0.08)` — whispers, never heavy |
| **Shadows** | 4–5 layer stacks with max opacity 0.05 |
| **Dark mode** | Built-in via `prefers-color-scheme: dark` |
| **Radius** | 4px (sm), 6px (default), 9px (lg), 12px (xl) |
| **Layout** | Max 1456px, 264px sidebar, 232px TOC, 57px nav |

## Package Structure

```
├── DESIGN.md                 # Full spec
├── README.md                 # Package overview + reuse guide
├── SKILL.md                  # This file
├── colors_and_type.css       # CSS tokens
├── context/                  # Source provenance
├── assets/                   # SVG assets (logo, favicon, icons)
├── build/                    # Machine tokens, manifest, source examples
├── preview/                  # 6 focused preview cards
├── ui_kits/app/              # Applied UI kit (standalone + modular)
└── docs-protocol.html        # Preserved source artifact
```

## Anti-patterns Quick Reference

- No purple gradients or gradient backgrounds
- No heavy borders
- No emoji as functional icons
- No hand-drawn SVG people
- No multiple solid CTAs per viewport
- No Inter/Roboto/Arial for display type
- No cream/warm beige backgrounds
- No `scrollIntoView` or `white-space: nowrap` on display text
