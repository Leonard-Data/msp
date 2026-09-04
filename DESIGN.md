# Design

## Visual world

MSP is a documentation library, not a generic docs starter.
The portal should feel curated, calm, and high-signal: warm paper surfaces, dark ink, one strong blue action color, editorial display typography, and precise utility chrome.
The visual direction takes structural inspiration from AI Hero's page rhythm and hierarchy, but never its content, branding, or subject matter.

## Core principles

- Search and browse are equal first-class entry points.
- Source identity stays visible even inside one unified portal.
- Reading comfort beats decorative complexity.
- Desktop should feel library-like; mobile should feel compact and calm.
- The add/connect workflows stay obvious and actionable.

## Color system

- Background: warm paper tones rather than flat white.
- Surfaces: translucent or softened ivory panels with subtle borders.
- Text: dark ink with softer neutral steps for metadata.
- Accent: one strong blue for actions, focus, selection, and active states.

## Typography

- Display: `Source Serif 4` for major headings and section titles.
- Body/UI: `Manrope` for navigation, body copy, and controls.
- Mono: `JetBrains Mono` for labels, metadata, and inline/system text.

## Layout rules

- Homepage uses a layered library rhythm: hero, trust metrics, category browse, featured shelves, then contribution workflows.
- Docs pages keep a three-part desktop structure: navigation rail, reading column, table of contents.
- On mobile, reading content comes first and navigation moves below it.
- Prose stays near a 72ch measure.

## Components

- Rounded high-contrast buttons with one strong primary action.
- Pill metadata for category/source labeling.
- Shelf cards for sources and categories.
- Search result cards with category and source context.
- Quiet rails with clear active states instead of heavy sidebars.

## Surface notes

### Homepage

Acts as the library front door.
It should explain the portal model quickly, give immediate search access, and show how to create or connect documentation.

### Docs shell

Should foreground the page title, source, and reading comfort.
Source repository actions belong near the page header, not hidden in nav.

### Search

Should feel like a primary surface, not a utility afterthought.
Default results should still help browsing when no query is entered.

## Non-goals

- Do not mimic AI Hero copy, illustrations, or information architecture.
- Do not turn the portal into a marketing site.
- Do not hide the source repository behind the portal brand.
