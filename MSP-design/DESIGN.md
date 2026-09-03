# Project As Complete OpenDesign Design System

> Category: Project Design System
> Surface: web
> Source project: "Web Prototype" (2b7d77f4-c6c3-472e-b851-eea1beb21ace)
> Design system id: user:web-prototype-design-system-2
> Active design system: Notion (inspired)

This design system was extracted from the Web Prototype project and the MSP Documentation Protocol artifact (`docs-protocol.html`). It inherits Notion's warm minimalism — serif display headings, near-black text, warm neutrals, whisper-weight borders — and applies it to a developer documentation context.

## Source Context

The primary source evidence is `docs-protocol.html` (46 KB), a complete documentation site artifact showing:
- A three-column layout (sticky topnav + left sidebar + main content + right TOC)
- Black-accented theme with warm/cool neutral balance
- Geist-family sans + Source Serif 4 headings + JetBrains Mono code
- Multi-layer shadow stacks and whisper-weight borders
- Dark mode via `prefers-color-scheme`
- Components: callout cards, CTA cards, comparison tables, next-lesson nav, pill badges

The secondary source is the Notion design system (notion/DESIGN.md), which provided the warm neutral palette, border philosophy, shadow system, and typographic principles. The source artifact's actual CSS tokens were extracted directly — colors, fonts, spacing, radius, and shadow values are not guessed but read from the file.

### Extracted Token Values (from docs-protocol.html CSS)

**Color:** `#ffffff` bg, `#0a0a0b` fg, `#6b6b78` muted, `#000000` accent, `rgba(0,0,0,0.08)` border
**Fonts:** Source Serif 4 (display), Inter/system-ui (body), JetBrains Mono (code)
**Scale:** `clamp(32px,4vw,44px)` h1 → `12px` micro
**Spacing:** 4px through 48px scale, 264px sidebar, 232px TOC, 57px nav height
**Radius:** 4px/6px/9px/12px scale
**Dark mode:** All tokens mirrored via `--dark-*` variants

---

## 1. Visual Theme & Atmosphere

**Warm documentation minimalism.** The system blends Notion's tactile warmth with the clarity of developer docs. The page canvas is pure white (`#ffffff`) with near-black text (`rgba(0,0,0,0.95)`), warm neutral surfaces (`#f6f5f4`), and Source Serif 4 for display headings paired with Inter for body and UI. Borders are `1px solid rgba(0,0,0,0.1)` — whispers that create structure without weight. Shadows are multi-layer stacks with cumulative opacity never exceeding 0.05, creating depth that feels natural rather than artificial.

The source artifact (`docs-protocol.html`) demonstrates a docsify-aligned documentation site with a sticky topnav, left sidebar (264px), main content (max 70ch), and optional right TOC sidebar (232px). It uses Geist-family sans, Source Serif 4 for headings, and JetBrains Mono for code — a pairing carried forward here.

**Key characteristics:**
- White background, warm neutrals, near-black text
- Serif display headings (Source Serif 4) + sans body (Inter/Geist)
- JetBrains Mono for code with `0.85em` relative sizing
- Ultra-thin borders, multi-layer shadow stacks
- Black accent (Notion-style) for primary CTAs
- Dark mode via `prefers-color-scheme` — deep neutral surfaces

---

## 2. Color

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ffffff` | Page background |
| `--surface` | `#ffffff` | Card surface, container fill |
| `--fg` | `#0a0a0b` | Primary text, headings |
| `--muted` | `#6b6b78` | Secondary text, descriptions |
| `--muted-fg` | `#8b8b98` | Captions, metadata, placeholders |
| `--faint` | `#b0b0bb` | Disabled text, decorative |
| `--border` | `rgba(0,0,0,0.08)` | Standard division border |
| `--accent` | `#000000` | Primary CTA, active indicators |
| `--accent-on` | `#ffffff` | Text on accent backgrounds |
| `--accent-soft` | `rgba(0,0,0,0.10)` | Soft accent tint for badges, hover surfaces |
| `--sidebar-bg` | `#fafafa` | Sidebar background |
| `--sidebar-hover` | `rgba(0,0,0,0.04)` | Sidebar link hover |
| `--sidebar-active` | `rgba(0,0,0,0.10)` | Sidebar link active/selected |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--dark-bg` | `#0a0a0b` | Page background |
| `--dark-surface` | `#111113` | Card surface |
| `--dark-fg` | `#ededee` | Primary text |
| `--dark-muted` | `#8b8b98` | Secondary text |
| `--dark-muted-fg` | `#6b6b78` | Captions |
| `--dark-faint` | `#4a4a55` | Disabled text |
| `--dark-border` | `rgba(255,255,255,0.06)` | Division border |
| `--dark-accent` | `#000000` | Primary CTA (black retains identity) |
| `--dark-accent-on` | `#ffffff` | Text on accent |
| `--dark-accent-soft` | `rgba(255,255,255,0.15)` | Soft accent tint |
| `--dark-sidebar-bg` | `#111113` | Sidebar background |
| `--dark-sidebar-hover` | `rgba(255,255,255,0.04)` | Sidebar hover |
| `--dark-sidebar-active` | `rgba(255,255,255,0.12)` | Sidebar active |

### Semantic Colors (from Notion source)

| Token | Light | Usage |
|-------|-------|-------|
| Notion Blue | `#0075de` | Primary link, CTA accent |
| Active Blue | `#005bab` | Button active state |
| Warm White | `#f6f5f4` | Section alternation |
| Warm Dark | `#31302e` | Dark surface text |
| Warm Gray 500 | `#615d59` | Secondary text (Notion tone) |
| Warm Gray 300 | `#a39e98` | Placeholder text |

---

## 3. Typography

### Font Stacks

| Role | Stack |
|------|-------|
| **Display** | `'Source Serif 4', 'Georgia', 'Times New Roman', serif` |
| **Body / UI** | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif` |
| **Mono / Code** | `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace` |

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--fs-h1` | `clamp(32px, 4vw, 44px)` | 700 | 1.06 | Page title |
| `--fs-h2` | `clamp(24px, 3vw, 32px)` | 700 | 1.25 | Section heading |
| `--fs-h3` | `20px` | 600 | 1.30 | Sub-section heading |
| `--fs-h4` | `17px` | 600 | 1.40 | Card heading |
| `--fs-body` | `16px` | 400 | 1.55 | Body text |
| `--fs-sm` | `14px` | 400–500 | 1.43 | Captions, metadata |
| `--fs-xs` | `12px` | 500–600 | 1.33 | Badges, micro labels |

### Typographic Principles

- **Display headings** use Source Serif 4 (serif) for editorial weight and readability.
- **Body text** uses Inter/system-ui (sans) for clean reading at 16px/1.55.
- **Code** uses JetBrains Mono at `0.85em` relative to body size.
- **Four-weight system**: 400 (body), 500 (UI/interactive), 600 (emphasis/nav), 700 (headings).
- **Badge text** at 12px uses `0.125px` positive letter-spacing for legibility at small sizes.
- **Prose max-width**: `65ch` for comfortable reading.

---

## 4. Spacing

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--gap-xs` | `4px` | Tight inline gaps |
| `--gap-sm` | `8px` | Element spacing |
| `--gap-md` | `16px` | Standard gap |
| `--gap-lg` | `24px` | Section padding |
| `--gap-xl` | `32px` | Large section gaps |
| `--gap-2xl` | `48px` | Major section spacing |

### Layout Tokens

| Token | Value |
|-------|-------|
| `--prose` | `65ch` |
| `--sidebar-w` | `264px` |
| `--toc-w` | `232px` |
| `--gutter` | `18px` |
| `--nav-height` | `57px` |

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Buttons, inputs |
| `--radius` | `6px` | Standard elements |
| `--radius-lg` | `9px` | Cards, containers |
| `--radius-xl` | `12px` | Featured cards, modals |

---

## 5. Layout & Composition

### Page Structure

The canonical layout from `docs-protocol.html`:

```
+------------------+          +------------------+------------------+
|  topnav (sticky, 57px)                                           |
+------------------+          +------------------+------------------+
| sidebar (264px)  |          | main content     | toc (232px)      |
| sticky, scroll   |          | max 70ch         | sticky, scroll   |
+------------------+          +------------------+------------------+
```

- **Topnav**: Sticky, blur backdrop, brand left + links center + CTA right.
- **Sidebar**: Fixed 264px width, sticky below nav, scrollable, with group labels and links.
- **Content**: Flexible, max-width 70ch for prose, with breadcrumb + heading + byline header.
- **TOC sidebar**: Fixed 232px, sticky, shows section headings with active tracking.
- **Max layout width**: 1456px centered.

### Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `>=1280px` | Show right TOC sidebar |
| `>=1024px` | Show left sidebar |
| `<1024px` | Sidebar hidden, hamburger menu, nav links hidden |
| `<600px` | Stacked layouts, reduced padding |

### Section Alternation

Following Notion's rhythm: white sections alternate with warm white (`#f6f5f4`) sections. Separation comes from background color changes and generous vertical spacing (64–120px), never hard section borders.

---

## 6. Components

### Buttons

| Variant | Styles |
|---------|--------|
| **Primary** | `background: var(--accent); color: var(--accent-on); border-radius: var(--radius-lg); padding: 8px 16px; font-weight: 600;` |
| **Ghost** | `background: transparent; color: var(--fg); border: 1px solid var(--border);` |
| **Link button** | `background: none; border: none; color: var(--fg); text-decoration: underline;` |

All buttons use `display: inline-flex; align-items: center; gap: 8px;` for icon+text.

### Cards

- Background: `var(--surface)`
- Border: `1px solid var(--border)`
- Radius: `var(--radius-xl)` (12px)
- Shadow: multi-layer Notion-style stack
- Hover: subtle shadow intensification

### Callout Cards

Icon-left + text-right layout with whisper border and rounded container. The icon section has a right border divider.

### Tables

`.table-wrap` with scroll container, border radius, sticky header, row hover. Headers use `var(--sidebar-bg)` background, `var(--muted)` text color at 13px weight 600.

### Navigation

- Sticky topnav with blur backdrop
- Brand left: logo mark (28px square) + text
- Links: center-aligned, 13.5px, muted color, hover to fg
- Actions: right-aligned, search + newsletter links + CTA button

### Sidebar

- Group labels (mono font, 11px, uppercase, muted-fg color)
- Links with icon + text, 13.5px, active state with darker bg
- Sub-links with numbered badges for step-by-step guides

---

## 7. Motion & Interaction

### Hover States

- **Buttons**: Primary darkens accent 12%; ghost/surface gets `var(--sidebar-hover)` background
- **Links**: Color transitions to `var(--fg)` over 0.15s
- **Sidebar links**: Background tint + color shift
- **Table rows**: Background tint

### Focus States

- All interactive elements: `outline: 2px solid var(--fg); outline-offset: 2px`
- `:focus-visible` only — no visible outline on mouse clicks

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```

---

## 8. Voice & Brand

### Tone

**Clear, direct, developer-friendly.** The voice is professional without being academic, warm without being casual. Documentation uses active voice, second-person ("you"), and concrete examples.

### Copy Conventions

- Headings: Title Case
- Buttons: Sentence case ("Get started", not "Get Started")
- Code references: inline code ticks
- Labels: short, scannable, noun-first
- Error messages: specific, actionable ("File not found. Check the path and try again.")

### Terminology

- "AI Engineer" (not "AI engineer" or "AI-engineer")
- "RAG" (not "R.A.G." or "rag")
- "API" (not "api")
- "TypeScript" (not "typescript")

---

## 9. Anti-patterns

- **No purple gradients** — Notion uses warm neutrals and a single blue accent, never purple
- **No heavy borders** — All borders are `1px solid` with low opacity
- **No emoji as functional icons** — Use SVG icons
- **No hand-drawn SVG people or scenes** — Use realistic product screenshots
- **No multiple solid CTAs per viewport** — One primary CTA, others are ghost/secondary
- **No Inter for display** — Inter is body/UI only; display uses Source Serif 4
- **No cream/warm beige backgrounds by default** — White and warm white (`#f6f5f4`) only
- **No scrollIntoView** — Breaks embedded preview
- **No `white-space: nowrap` on oversized display type** — Let text wrap naturally
- **No control panels that exist only for the designer/presenter**
- **No empty chart outlines** — Charts must use filled data encoding
- **No warm gray at body sizes that drops contrast below 4.5:1**
