# MSP docs library redesign

## Summary

Redesign MSP from a generic docs portal into a standout documentation library inspired by the interaction clarity and visual confidence of `aihero.dev/skills-to-questionnaire`, while keeping MSP's existing content pipeline, source-sync logic, and PRD-defined add/connect workflows intact.
The new UI should improve three things at once: discovery from the homepage, reading comfort on documentation pages, and the speed of adding new portal content or documentation pages.

## Goals

- Make MSP feel like a premium documentation library rather than a stock Astro docs shell.
- Preserve existing logic for syncing, building, and rendering docs from multiple repositories.
- Preserve the PRD's add/connect documentation workflows.
- Improve readability and scanability on both phone and desktop.
- Make search more useful and more prominent.
- Add a simple project command for creating a new portal documentation page or section.

## Non-goals

- No backend or authentication system for add/connect flows.
- No change to the underlying multi-repository architecture in `PRD.md`.
- No replacement of the existing markdown aggregation pipeline.
- No dependency-heavy search engine migration in this pass.

## Product truths to preserve

- Content ownership stays with the source repository.
- MSP remains a static Astro site suitable for GitHub Pages.
- `sources.yml`, `.docs-source.yml`, source sync, and generated navigation/search remain core platform mechanics.
- Add Documentation still points users into the PRD-backed workflow for creating or connecting documentation repositories.

## Direction

MSP will become a **documentation library front door**.
Instead of looking like a lightly customized documentation starter, it should feel like a curated library of technical knowledge:

- strong search-first homepage
- source/category discovery with clearer hierarchy
- quieter, more readable docs pages
- obvious source identity on every page
- compact but high-signal mobile behavior
- one-command scaffolding for new portal docs pages

The chosen direction is a **docs-adapted translation** of the AI Hero reference, using my recommended path.
That means MSP should capture the reference page's layout and design language only: section rhythm, spacing, typography feel, hierarchy, card treatment, and interaction cues.
It must not copy AI Hero's content, page subject, copywriting, branding, or information architecture where those conflict with MSP's documentation-library needs.
MSP keeps its own content, browse/search structure, and add/connect workflows from the PRD.

## Information architecture

### Top-level navigation

Keep the global nav small and explicit:

- Home
- Library / Documentation
- Search
- Add Documentation
- GitHub

"How it works" should remain available, but it can move into the portal/library area rather than occupying primary nav weight equal to search.

### Homepage

The homepage becomes a true portal front door with five stacked sections:

1. **Hero / search entry**
   - headline focused on one portal for all docs
   - immediately visible search input or search call-to-action
   - short explanation of multi-repo docs model
   - strong Add Documentation action
2. **Library stats / trust bar**
   - sources, pages, categories, update signal
3. **Browse by category**
   - category cards with source counts and concise descriptions
4. **Featured sources / library shelves**
   - visually stronger source cards for the most useful or recent sources
5. **Contribution path**
   - clear split between Create New Section and Connect Existing Repository

### Documentation area

Docs should remain route-compatible, but the shell should be easier to read:

- left rail for source/category navigation
- main reading column optimized for prose
- right rail TOC on desktop only
- stronger source identity and metadata at top of page
- better mobile collapse behavior so nav does not dominate the viewport

### Search

Search becomes a first-class surface, not just a plain results list:

- prominent input above the fold
- richer result cards
- source/category labels
- visible matching context/snippets when feasible from current index data
- optional grouped empty/default state such as trending topics or quick links when query is blank

## Visual system

### Overall character

- premium technical library
- high contrast, calm, deliberate
- editorial typography paired with precise UI chrome
- visually distinctive without becoming decorative noise

### Color

Use a restrained but committed palette:

- dark ink / graphite text
- warm or cool paper-toned surfaces instead of flat generic white
- one strong accent for actions and active states
- muted secondary tones for rails, pills, metadata, and dividers

The result should stand apart from default Astro docs without hurting legibility.

### Typography

Keep the contrast between expressive display type and pragmatic body/UI type, but use it more intentionally:

- one high-character display face for hero and major titles
- one clean sans for body and UI
- mono reserved for metadata, labels, and system details

Prioritize short line lengths, stronger heading rhythm, and better mobile scale progression.

### Components

Focus the redesign on a small system of reusable components:

- hero/search panel
- category card
- source card
- metric chip/stat card
- rail sections
- doc header/meta cluster
- result card
- contribution split card

## Surface-by-surface plan

### 1. Homepage (`src/pages/index.astro`)

Replace the current minimal hero + metrics layout with a more complete portal landing page:

- large search-led hero
- library/category shelves
- stronger explanation of how MSP works
- clearer CTA for adding documentation
- improved content density so the page feels useful before the first click

### 2. Base shell (`src/layouts/BaseLayout.astro`)

Refine the top bar and global shell:

- simplify primary nav labels
- make Add Documentation the single strongest utility action
- keep GitHub secondary
- support better mobile stacking and spacing

### 3. Docs shell (`src/layouts/DocsLayout.astro`)

Refine the reading environment:

- calmer rails
- clearer active states
- tighter grouping by category/source
- stronger top-of-page metadata
- more comfortable prose width and heading rhythm
- better mobile behavior with the sidebar moved below or behind a lightweight summary pattern

### 4. Search (`src/pages/search/index.astro`)

Upgrade search presentation without changing the generated-index architecture:

- better ranking emphasis in UI
- stronger result cards
- better empty/default state
- cleaner query experience on phone

### 5. Global styles (`src/styles/global.css`)

This file will absorb most of the redesign:

- new tokens
- revised spacing system
- homepage sections
- improved docs typography
- upgraded rails/cards/search
- responsive rules for phone-first reading

## New scaffolding command

Add a simple script for portal-owned docs pages.

### Command

Proposed command:

```bash
npm run new:doc-page -- --title "How it works" --slug how-it-works
```

### Output

The script should:

- create a markdown file under `content/portal/`
- write a sensible template with title heading and intro placeholder
- normalize the slug
- refuse to overwrite an existing page
- print the created path

This is intentionally small.
It should scaffold MSP portal pages, not full external repositories.
External repository onboarding remains the PRD-defined add/connect workflow.

## Implementation approach

- Reuse the current Astro routes and generated data.
- Do the redesign mainly through layout/component/template changes, not a data-model rewrite.
- Keep search client-side for now.
- Add the small scaffolding script plus a package.json script entry.
- Avoid new dependencies unless clearly necessary.

## Files expected to change

- `PRODUCT.md`
- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/layouts/DocsLayout.astro`
- `src/pages/search/index.astro`
- `src/styles/global.css`
- `package.json`
- `scripts/new-doc-page.mjs` (new)
- optionally docs content files for homepage-supporting portal copy if needed
- later `DESIGN.md` after the redesign ships

## Testing and verification

- `npm run check`
- any existing project validation already used for build integrity
- manual review of homepage, docs page, and search page at desktop and phone widths
- verify route/base-path behavior still works for GitHub Pages-style deployment
- verify the new doc-page command creates the expected file and does not overwrite existing content

## Risks and mitigations

### Risk: the redesign becomes a marketing clone

Mitigation: treat AI Hero as a visual/layout reference only and keep MSP's content, IA, and workflows docs-native.

### Risk: mobile reading gets worse under a more expressive layout

Mitigation: design mobile from the reading column outward; keep rails subordinate on small screens.

### Risk: script scope creeps into repo provisioning

Mitigation: keep the new command limited to portal page scaffolding; repo onboarding remains the add/connect workflow.

## Recommended execution order

1. refresh base tokens and shell
2. redesign homepage
3. redesign docs shell and prose system
4. redesign search
5. add new doc-page scaffold command
6. run checks and visual review
7. document the shipped visual system in `DESIGN.md`
