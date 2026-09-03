# Applied UI Kit — Web Prototype Design System

A reusable component kit extracted from the MSP Documentation Protocol (`docs-protocol.html`). Notion-inspired warm minimalism for developer documentation interfaces.

The `index.html` App layout composes a full-page documentation interface: sticky topnav, left Sidebar with navigation links and numbered step badges, a main content area with typography specimens and cards, and a right-side Table of Contents panel. The `index.html` App fetches modular component fragments from `components/` using a `loadSlot()` pattern that renders each section into a named container.

## Structure

### Files

| File | Description | Dependencies |
|------|-------------|-------------|
| `index.html` | App — full-page composed interface: topnav + Sidebar + ChatArea with typography/cards + right TOC | `../../colors_and_type.css`, Google Fonts, `components/navigation.html`, `components/cards.html`, `components/forms.html` |
| `navigation.html` | Standalone Sidebar + topnav + TOC pattern | `../../colors_and_type.css`, Google Fonts |
| `cards.html` | Standalone card system: standard card, elevated (shadow) card, warm-white alt card, 2×2 grid, CTA card, callout, next-lesson nav | `../../colors_and_type.css`, Google Fonts |
| `forms.html` | Standalone form fields: buttons (primary/ghost/link/disabled), InputBar, Composer select/textarea, switch/toggle, badges, pills, PreviewCard focus-visible demo | `../../colors_and_type.css`, Google Fonts |
| `components/navigation.html` | Sidebar + topnav fragment (loaded by App via fetch) | `../../colors_and_type.css` |
| `components/cards.html` | Card system fragment (loaded by App via fetch) | `../../colors_and_type.css` |
| `components/forms.html` | Form fields fragment (loaded by App via fetch) | `../../colors_and_type.css` |

### Component Details

| Name | Found In | Purpose |
|------|----------|---------|
| App | `index.html` | Root composed interface — assembles all fragments via loadSlot() |
| Sidebar | `navigation.html`, `components/navigation.html` | Left navigation panel with group labels, numbered step badges, icon+text links, active state |
| ChatArea | `index.html` (main content area) | Prose content region with typography specimens, cards, and layout examples |
| MessageBubble | `cards.html`, `components/cards.html` | Callout card with icon-left + text-right layout, right border divider |
| InputBar | `forms.html`, `components/forms.html` | Single-line text input with focus-visible ring, placeholder styling |
| Composer | `forms.html`, `components/forms.html` | Multi-line textarea / rich input area with select dropdowns |
| PreviewCard | `forms.html`, `components/forms.html` | Elevated card specimen with hover-shadow, focus-visible demo |
| AssistantsList | `index.html` (sidebar slot) | Navigation link list with active-state tracking and group labels |

### Directory Layout

```
ui_kits/app/
├── README.md                      # This file — kit documentation & reuse guide
├── index.html                     # App — composed interface, loads all components/
├── navigation.html                # Standalone Sidebar + topnav + TOC
├── cards.html                     # Standalone card system
├── forms.html                     # Standalone forms & inputs
└── components/                    # Modular fragments (fetched by App)
    ├── navigation.html            # Sidebar + AssistantsList fragment
    ├── cards.html                 # Card system fragment (MessageBubble, etc.)
    └── forms.html                 # Form fields fragment (InputBar, Composer, PreviewCard)
```

## Usage Workflow

### For Direct Viewing (Designer Review)

1. Open any standalone file directly in a browser — `navigation.html`, `cards.html`, `forms.html`.
2. Open `index.html` to see the composed App interface with modular component loading.
3. Verify that all files load `../../colors_and_type.css` (the design-system token file at the project root).
4. Check dark mode by toggling the OS/browser `prefers-color-scheme` setting.

### For Code Reuse (Agent / Developer)

1. **Bind tokens**: Copy `:root` from `../../colors_and_type.css` into your artifact, or compose it via `<link>`.
2. **Load Google Fonts**: Add the `Source Serif 4`, `Inter`, and `JetBrains Mono` `<link>` tags.
3. **Pick a component**: Open the standalone file that contains the pattern you need (Sidebar, PreviewCard, InputBar, Composer).
4. **Copy the HTML + CSS**: Extract the component's markup and its associated styles. For App-level composition, copy the full `index.html` and replace the fragment imports.
5. **Replace `data-od-id`**: Update kebab-case IDs with project-specific identifiers.
6. **Adapt copy**: Replace placeholder content with your domain's actual content.

### For Modular Composition (Advanced)

- `index.html` uses `fetch()` to load fragments from `components/navigation.html`, `components/cards.html`, and `components/forms.html`.
- To add a new section, create a new `.html` fragment in `components/` and add a `loadSlot()` call.
- The loading state is handled by `.component-slot.loading` CSS — fragments replace the placeholder text on fetch success.

## Design Notes

- **Token-driven**: All components (App, Sidebar, ChatArea, MessageBubble, InputBar, Composer, PreviewCard, AssistantsList) use CSS custom properties from `colors_and_type.css` — no hardcoded hex values.
- **Dark mode inherited**: Via `prefers-color-scheme: dark` with `--dark-*` variant mapping.
- **Focus-visible only**: All interactive elements (Sidebar links, PreviewCard buttons, InputBar fields) use `:focus-visible` — keyboard focus without mouse-click outlines.
- **Spacing**: Follows the design system's scale (`--gap-sm` through `--gap-2xl`).
- **Section alternation**: White ↔ warm white (`#f6f5f4`) rhythm from the Notion-inspired pattern.
- **Hover states**: Background shifts by ±0.06–0.12 on the oklch L channel via `--sidebar-hover` or `color-mix()`.
- **Shadow stack**: Multi-layer Notion-style shadows with cumulative opacity ≤ 0.05.

## Source Basis

These components are direct implementations of patterns found in `docs-protocol.html` (46 KB at the project root). The layout structure, component proportions, interaction patterns, and visual details were extracted from that single source file and normalized into the design system's token system.

The App layout composes Sidebar navigation, ChatArea content regions with MessageBubble-style callout cards, InputBar form fields, Composer text areas, PreviewCard specimen cards, and AssistantsList navigation grouping — all tracing directly to patterns in the source artifact.

Key pattern sources from the artifact:
- **Topnav**: Brand (logo-mark + wordmark) + centered links + right-aligned CTA, blur backdrop
- **Sidebar**: Group labels in mono font (11px, uppercase), numbered step badges (`num-badge`), icon+text links with active state
- **Cards**: Whisper border (1px `var(--border)`) + 12px radius + multi-layer Notion shadow stack
- **Callouts**: Icon-left panel with right border divider + text-right body
- **Tables**: `.table-wrap` with scroll container, sticky headers, row hover background
- **CTA cards**: Accent-soft background tint, mono label, serif heading, single primary button
- **Next-lesson nav**: Top-border divider, flex layout with label + title + arrow
- **Right TOC**: Border-left active indicator, share buttons row
- **Prose**: Article header with breadcrumb + pill + byline (avatar + name + actions)

## Reuse Guide for Future Agents

When an agent reads this kit to generate a new artifact, follow this checklist:

### Claude Design Package Reuse Workflow

```
1. INSPECT source context
   ├── Read docs-protocol.html at project root (46 KB) — reference implementation
   ├── Read context/source-context.md — project provenance
   └── Read context/provenance.md — generation notes

2. BIND design tokens
   ├── Import colors_and_type.css via <link>
   └── OR copy :root block into the new artifact's <style>

3. LOAD fonts
   └── Add <link> for Source Serif 4, Inter, JetBrains Mono from Google Fonts

4. INSPECT preview cards (in order)
   ├── preview/colors-primary.html — verify palette accuracy
   ├── preview/typography-specimens.html — verify font pairing
   ├── preview/spacing-tokens.html — verify spacing scale
   ├── preview/radius-shadows.html — verify radius + shadow levels
   ├── preview/components-buttons.html — verify button states + badges
   └── preview/brand-assets.html — verify logos + font specimens

5. COPY component patterns from ui_kits/app/
   ├── navigation.html — Sidebar, topnav, TOC
   ├── cards.html — card system, MessageBubble callouts, tables
   ├── forms.html — buttons, InputBar fields, Composer textareas, badges
   └── index.html — composed App layout

6. APPLY layout dimensions from DESIGN.md
   ├── Max layout width: 1456px centered
   ├── Sidebar: 264px (hidden < 1024px)
   ├── TOC: 232px (hidden < 1280px)
   ├── Nav height: 57px (sticky, blur backdrop)
   └── Prose max-width: 65ch / 70ch

7. ENFORCE anti-patterns (DESIGN.md §9)
   ├── No purple gradients
   ├── No heavy borders (> 1px)
   ├── No emoji as functional icons
   ├── No multiple solid CTAs per viewport
   ├── No Inter for display type
   └── No cream/warm beige backgrounds by default

8. ADD dark mode
   └── @media (prefers-color-scheme: dark) with --dark-* token mapping

9. ADD focus states
   └── :focus-visible only — outline: 2px solid var(--fg); outline-offset: 2px

10. VERIFY against source
    ├── Compare against docs-protocol.html
    └── Check component shapes match, not generic memory
```

### Design System Token Reference

| Token Group | File Location |
|-------------|---------------|
| CSS custom properties | `../../colors_and_type.css` |
| Full spec with usage | `../../DESIGN.md` |
| Agent skill | `../../SKILL.md` |
| Machine-readable tokens | `../../build/tokens.json` |
| Preserved source examples | `../../build/source_examples/` |

### Anti-pattern Quick Reference

- No purple gradients or gradient backgrounds
- No `scrollIntoView` (breaks embedded preview)
- No `white-space: nowrap` on oversized display type
- No control panels that exist only for the designer/presenter
- No empty chart outlines — use filled data encoding
- No warm gray at body sizes that drops contrast below 4.5:1
