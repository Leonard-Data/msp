# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Internal engineering and documentation teams who need one place to browse, search, and maintain documentation spread across multiple repositories.
- External customers, partners, and community readers who need a trustworthy, readable portal for discovering and consuming published documentation.

## Product Purpose

MSP is a centralized documentation portal that aggregates documentation from multiple repositories into one searchable Astro site.
It exists so documentation can stay close to the code or domain that owns it while still being published through one coherent reading experience.
Success means readers can quickly find, understand, and navigate documentation across many repositories, and teams can add or connect new documentation sources with minimal friction.

## Positioning

MSP is not just a docs theme.
It combines a unified cross-repository reading experience with self-service onboarding of new documentation repositories, so discovery and source creation happen through the same portal.

## Operating Context

- Documentation remains in its source repository, usually under `docs/`, with source metadata in `.docs-source.yml`.
- MSP reads a central `sources.yml` registry, synchronizes source repositories, normalizes their markdown, generates navigation and search data, and publishes a static Astro site.
- The portal must support both browsing and search across many repositories and categories.
- Readers use the portal on desktop and phone.
- Teams use the portal to request new documentation sections or connect existing repositories as described in `PRD.md`.

## Capabilities and Constraints

- Must preserve the multi-repository documentation model from `PRD.md`.
- Must preserve the existing add/connect documentation workflows described in `PRD.md`.
- May improve search UX, routing clarity, and reading/navigation behavior.
- Must remain deployable as a static Astro site suitable for GitHub Pages.
- Must not require exposing privileged GitHub credentials in browser code.
- Should make adding another documentation page or section easy through a simple project command.

## Brand Commitments

- Product name: MSP.
- The portal should feel like a standout documentation library rather than a generic documentation theme.
- The redesign may draw structural inspiration from `https://www.aihero.dev/skills-to-questionnaire`, but it must remain MSP-specific and preserve MSP product truth, content, and workflows.

## Evidence on Hand

- Product requirements in `PRD.md`.
- Existing Astro implementation in `src/`, `scripts/`, and generated docs data.
- Existing source-sync architecture via `sources.yml`, `scripts/sync-sources.mjs`, and `scripts/build-docs.mjs`.
- Existing portal assets in `public/assets/`.
- No separate DESIGN.md exists yet.

## Product Principles

- Keep content ownership with the source repository; MSP owns aggregation, discovery, navigation, search, and publishing.
- Make cross-repository reading feel unified without hiding the identity of the source repository.
- Treat search and browse as equal first-class entry points.
- Make contribution paths obvious and low-friction for documentation maintainers.
- Optimize for calm, fast reading on phone and desktop before ornamental complexity.

## Accessibility & Inclusion

- The portal must remain readable and navigable on phone and desktop.
- Navigation, search, and page structure should be clear for first-time visitors as well as internal teams.
- The redesign should preserve semantic structure and accessible reading patterns for long-form documentation.
