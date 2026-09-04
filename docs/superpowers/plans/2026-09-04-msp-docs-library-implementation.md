# MSP Docs Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign MSP into a docs-library UI that borrows AI Hero's layout rhythm and visual language without copying its content, while preserving the existing sync/build logic and adding a simple portal-page scaffolding command.

**Architecture:** Keep the current Astro routes and generated docs pipeline intact. Rebuild the presentation layer through the homepage, base shell, docs shell, search page, and global styles, then add one small script for portal page creation plus regression tests for the new UI shell and script behavior.

**Tech Stack:** Astro 4, static JSON-backed docs/search generation, Node test runner, plain CSS, small Node utility scripts.

**Spec:** `docs/superpowers/specs/2026-09-04-msp-docs-library-design.md`

## Global Constraints

- Preserve the multi-repository docs pipeline and existing sync/build logic.
- Preserve the PRD-defined add/connect documentation workflows.
- Treat AI Hero as a layout/design reference only, not a content or branding source.
- Keep the site static and GitHub Pages-friendly.
- Add only the smallest useful script for creating portal-owned doc pages.
- Verify behavior with TDD: failing test first, then minimal implementation.

---

### Task 1: Lock regression coverage for the redesigned shell and new scaffold command

**Files:**
- Modify: `tests/site-integrity.test.mjs`
- Create: `tests/new-doc-page.test.mjs`

**Interfaces:**
- Consumes: `npm run build`, `node scripts/new-doc-page.mjs --title <title> --slug <slug>`
- Produces: regression checks for homepage/search/docs shell output and scaffold command behavior

- [ ] **Step 1: Write the failing homepage/docs-shell assertions in `tests/site-integrity.test.mjs`**

```js
assert.match(home, /Documentation Library/, 'home should present the docs-library identity');
assert.match(home, /Create New Section/, 'home should surface the create-section workflow');
assert.match(home, /Connect Existing Repository/, 'home should surface the connect-existing workflow');
assert.match(home, /Browse by category/, 'home should expose category browsing');
assert.match(doc, /Source repository/, 'docs page should label source metadata clearly');
assert.match(doc, /Open source repository/, 'docs page should expose the source repository action');
```

- [ ] **Step 2: Run the integrity test to verify it fails**

Run: `node --test tests/site-integrity.test.mjs`
Expected: FAIL because the current pages do not yet render the new docs-library shell copy/structure.

- [ ] **Step 3: Write the failing scaffold-command test in `tests/new-doc-page.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

test('new-doc-page creates a markdown file with title and intro stub', () => {
  const root = mkdtempSync(join(tmpdir(), 'msp-doc-page-'));
  mkdirSync(join(root, 'content', 'portal'), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{}');

  execFileSync('node', ['/home/sam/agent-orchestrator/projects/msp/scripts/new-doc-page.mjs', '--title', 'Library Guide', '--slug', 'library-guide'], { cwd: root });

  const file = join(root, 'content', 'portal', 'library-guide.md');
  assert.equal(existsSync(file), true);
  assert.match(readFileSync(file, 'utf8'), /^# Library Guide/m);
});
```

- [ ] **Step 4: Run the scaffold test to verify it fails**

Run: `node --test tests/new-doc-page.test.mjs`
Expected: FAIL because `scripts/new-doc-page.mjs` does not exist yet.

### Task 2: Implement the docs-library visual shell

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/DocsLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/search/index.astro`
- Modify: `src/pages/docs/[...slug].astro`
- Modify: `src/pages/docs/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `src/generated/docs-data.json`, existing base-path helpers, existing repo URLs
- Produces: redesigned homepage, docs shell, search surface, and shared visual system without route changes

- [ ] **Step 1: Rebuild the homepage markup around the docs-library sections**

```astro
<section class="library-hero">...</section>
<section class="library-trust">...</section>
<section class="library-categories">...</section>
<section class="library-shelves">...</section>
<section class="library-contribute">...</section>
```

- [ ] **Step 2: Refine the base header/navigation for the new shell**

```astro
<nav class="topnav" aria-label="Primary">
  <a href={docsHref}>Library</a>
  <a href={searchHref}>Search</a>
  <a href={howItWorksHref}>How it works</a>
</nav>
```

- [ ] **Step 3: Rework the docs-page header metadata and source actions**

```astro
<div class="doc-meta-group">
  <span class="pill">{page.category}</span>
  <span class="meta-label">Source repository</span>
  <a class="source-link" href={page.repoUrl}>Open source repository</a>
</div>
```

- [ ] **Step 4: Rebuild the search page into a richer search surface**

```astro
<section class="search-hero">...</section>
<section class="search-panel">...</section>
```

- [ ] **Step 5: Replace the CSS token set and component styles with the new visual system**

```css
:root {
  --paper: ...;
  --ink: ...;
  --accent: ...;
}
.library-hero { ... }
.doc-shell { ... }
.search-result-card { ... }
```

- [ ] **Step 6: Run the integrity test to verify the UI shell now passes**

Run: `node --test tests/site-integrity.test.mjs`
Expected: PASS.

### Task 3: Add the portal page scaffold command

**Files:**
- Create: `scripts/new-doc-page.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: CLI args `--title` and optional `--slug`
- Produces: `content/portal/<slug>.md`, non-overwrite behavior, npm script entry `new:doc-page`

- [ ] **Step 1: Implement the minimal CLI parser and slug normalization**

```js
const args = new Map(parseArgs(process.argv.slice(2)));
const title = required(args.get('--title'));
const slug = normalizeSlug(args.get('--slug') || title);
```

- [ ] **Step 2: Write the markdown stub and refuse overwrite**

```js
if (existsSync(target)) throw new Error(`Refusing to overwrite ${target}`);
await writeFile(target, `# ${title}\n\nAdd an introduction here.\n`);
```

- [ ] **Step 3: Add the npm script entry**

```json
"new:doc-page": "node scripts/new-doc-page.mjs"
```

- [ ] **Step 4: Run the scaffold test to verify it passes**

Run: `node --test tests/new-doc-page.test.mjs`
Expected: PASS.

### Task 4: Run full verification for the redesigned portal

**Files:**
- No code changes required unless verification fails

**Interfaces:**
- Consumes: project build/check/test commands and Impeccable detector
- Produces: fresh verification evidence for the redesign and scaffold command

- [ ] **Step 1: Run the full project tests**

Run: `node --test tests/site-integrity.test.mjs tests/new-doc-page.test.mjs`
Expected: PASS.

- [ ] **Step 2: Run Astro verification**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Run the design detector on changed UI targets**

Run: `node /home/sam/.pi/agent/skills/impeccable/scripts/detect.mjs --json src/pages/index.astro src/layouts/BaseLayout.astro src/layouts/DocsLayout.astro src/pages/search/index.astro src/pages/docs/[...slug].astro src/pages/docs/index.astro src/styles/global.css`
Expected: either clean output or actionable findings to fix once.
