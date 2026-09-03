# MSP

## 1. Overview

**MSP** is a centralized documentation portal built with **Astro** and hosted on **GitHub Pages**.

The portal aggregates documentation from multiple GitHub repositories into one searchable documentation experience.

The main goals are:

* Keep documentation close to the project or technology it belongs to.
* Avoid maintaining one huge documentation monorepo.
* Provide one central documentation website.
* Make adding a new documentation source extremely easy.
* Provide full-text search across all documentation.
* Automatically generate navigation and sections.
* Allow users to create new documentation repositories from the portal.
* Allow existing repositories to be connected as documentation sources.
* Automate synchronization and deployment.

---

# 2. High-Level Architecture

```text
                         MSP-Portal
                    Documentation Portal
                           │
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
          Search         Browse       Add Section
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                              ▼                     ▼
                        Create New Repo      Connect Existing Repo
                              │                     │
                              └──────────┬──────────┘
                                         │
                                         ▼
                                  sources.yml
                                         │
                                         ▼
                              Documentation Sync
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   │                     │                     │
                   ▼                     ▼                     ▼
             Power Apps Repo       UiPath Repo          AI Agent Repo
                 /docs                /docs                 /docs
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         │
                                         ▼
                                Normalize Content
                                         │
                      ┌──────────────────┼──────────────────┐
                      ▼                  ▼                  ▼
                  Navigation         Search Index       Metadata
                      │                  │                  │
                      └──────────────────┼──────────────────┘
                                         │
                                         ▼
                                      Astro
                                         │
                                         ▼
                                   GitHub Pages
```

---

# 3. Repository Strategy

MSP-Portal will use a **hybrid multi-repository architecture**.

Do not move all documentation into one repository.

Instead, documentation stays with its owning project.

Example:

```text
github.com/company/

├── MSP-Portal
│
├── powerapps-patterns
│   └── docs/
│
├── powerapps-ui
│   └── docs/
│
├── uipath-patterns
│   └── docs/
│
├── automation-patterns
│   └── docs/
│
├── agent-engineering
│   └── docs/
│
└── supabase-patterns
    └── docs/
```

`msp` acts as the **aggregator and presentation layer**.

---

# 4. MSP-Portal Repository

Suggested structure:

```text
MSP-Portal/
│
├── index.html
├── README.md
│
├── _sidebar.md
├── _navbar.md
│
├── sources.yml
│
├── docs/
│   ├── home/
│   ├── standards/
│   └── sources/
│       ├── powerapps-ui/
│       ├── uipath-patterns/
│       ├── agent-engineering/
│       └── supabase-patterns/
│
├── scripts/
│   ├── sync-sources.js
│   ├── generate-sidebar.js
│   ├── generate-metadata.js
│   └── validate-sources.js
│
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── add-documentation.yml
    │
    └── workflows/
        ├── sync.yml
        ├── deploy.yml
        └── create-section.yml
```

---

# 5. Source Registry

MSP-Portal will contain a central registry:

```yaml
# sources.yml

sources:

  - repo: company/powerapps-ui

  - repo: company/powerapps-patterns

  - repo: company/uipath-patterns

  - repo: company/agent-engineering

  - repo: company/supabase-patterns
```

The registry should remain intentionally simple.

Its primary purpose is:

> Define which repositories belong to MSP-Portal.

Repository-specific metadata should remain inside each source repository.

---

# 6. Documentation Source Standard

Every connected repository should contain:

```text
docs/
```

and:

```text
.docs-source.yml
```

Example:

```yaml
id: powerapps-architecture

name: Power Apps Architecture

description: >
  Architecture patterns, development practices,
  components and performance guidance for Power Apps.

category: Power Platform

docs_path: docs

tags:
  - powerapps
  - canvas-app
  - dataverse
  - architecture

navigation:
  - concepts
  - architecture
  - guides
  - patterns
  - examples
  - snippets
  - troubleshooting
  - reference
```

This allows each repository to describe itself.

---

# 7. Standard Documentation Structure

New documentation repositories should follow a common structure:

```text
docs/
│
├── README.md
│
├── concepts/
│
├── architecture/
│
├── guides/
│
├── patterns/
│
├── components/
│
├── examples/
│
├── snippets/
│
├── troubleshooting/
│
├── reference/
│
└── assets/
```

Not every repository needs every folder.

The standard simply gives authors a predictable structure.

---

# 8. Documentation Template Repository

Create another repository:

```text
MSP-template
```

Configure it as a **GitHub Template Repository**.

Structure:

```text
MSP-template/
│
├── README.md
├── CONTRIBUTING.md
├── .docs-source.yml
│
├── docs/
│   ├── README.md
│   ├── concepts/
│   ├── architecture/
│   ├── guides/
│   ├── patterns/
│   ├── examples/
│   ├── snippets/
│   ├── troubleshooting/
│   ├── reference/
│   └── assets/
│
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

All documentation repositories created through MSP-Portal should originate from this template.

---

# 9. Add Documentation

The portal should expose:

```text
+ Add Documentation
```

with two options:

```text
+ Add Documentation

├── Create New Section
│
└── Connect Existing Repository
```

---

# 10. Create New Section

The form should collect:

```text
Section Name

Repository Name

Description

Category

Visibility
- Private
- Public

Tags

Maintainer / Owner
```

Example:

```text
Section Name
Power Automate Patterns

Repository
power-automate-patterns

Category
Power Platform

Description
Reusable workflow and architecture patterns for Power Automate.

Tags
power-automate
cloud-flow
automation
```

---

# 11. Create Section Workflow

The workflow should be:

```text
User selects
Create New Section
       │
       ▼
Submit Request
       │
       ▼
Validate
       │
       ├── Repository exists?
       ├── Valid repository name?
       ├── Valid category?
       └── Authorized user?
       │
       ▼
Create repository
from MSP-template
       │
       ▼
Generate
.docs-source.yml
       │
       ▼
Register repository
in sources.yml
       │
       ▼
Sync documentation
       │
       ▼
Generate navigation
       │
       ▼
Update search
       │
       ▼
Deploy MSP-Portal
```

---

# 12. Connect Existing Repository

MSP-Portal must also support repositories that already exist.

Example:

```text
Repository

company/payment-portal

Documentation path

docs/

Category

Finance Applications
```

The system validates that:

```text
docs/
```

exists.

Ideally it also validates:

```text
.docs-source.yml
```

If the metadata file does not exist, MSP-Portal can provide instructions or automatically create a pull request adding it.

The repository is then added to:

```yaml
sources.yml
```

---

# 13. Documentation Synchronization

During deployment:

```text
sources.yml
      │
      ▼
Read registered repositories
      │
      ▼
Checkout repositories
      │
      ▼
Read .docs-source.yml
      │
      ▼
Copy docs/
      │
      ▼
docs/sources/{source-id}/
```

Example result:

```text
MSP-Portal/docs/sources/

├── powerapps-ui/
├── powerapps-patterns/
├── uipath-patterns/
├── agent-engineering/
└── supabase-patterns/
```

Astro therefore sees all documentation as local content.

---

# 14. Navigation Generation

Do not manually maintain a huge `_sidebar.md`.

Generate it automatically from source metadata.

Example:

```text
Power Platform
├── Power Apps UI
├── Power Apps Architecture
└── Power Automate Patterns

Automation
├── UiPath Patterns
└── RPA Architecture

AI
├── Agent Engineering
└── Agent Patterns

Database
└── Supabase Patterns
```

The generator should use information from:

```text
.docs-source.yml
```

including:

```text
category
name
navigation
order
```

---

# 15. Search

Search must operate across all registered repositories.

Example query:

```text
SPListExpandedUser Claims
```

could find content from:

```text
Power Apps Architecture
    ↓
SharePoint
    ↓
Patch Person Field
```

Another search:

```text
queue retry business exception
```

could return:

```text
UiPath Patterns
RPA Patterns
Power Automate Patterns
```

For V1 use:

```text
Astro Search Plugin
```

Because synchronized Markdown is local to MSP-Portal, Astro can index the complete documentation portal.

---

# 16. Future Search Upgrade

Keep search separate enough that it can later move to:

```text
Pagefind
```

or potentially:

```text
Meilisearch
Typesense
Algolia
```

without changing the documentation architecture.

Target:

```text
Sources
   ↓
Normalized Markdown
   ↓
Search Index
   ↓
Astro UI
```

---

# 17. Portal Homepage and  Documentation Page Layout

Follow the System Design of MSP-design

---

# 19. GitHub Pages

MSP-Portal should be deployed using:

```text
GitHub Actions
       ↓
GitHub Pages
```

Example:

```text
https://company.github.io/MSP-Portal/
```

Eventually:

```text
https://docs.company.com/
```

---

# 20. Security

Never expose a privileged GitHub token inside Astro JavaScript.

Do not:

```text
Browser
   ↓
GitHub PAT
   ↓
Create repositories
```

Instead:

```text
Browser
   ↓
GitHub controlled request
   ↓
GitHub Action
   ↓
GitHub App
   ↓
Repository operations
```

Use a **GitHub App** for cross-repository operations.

---

# 21. V1 Add Section Implementation

For the first release, avoid building a backend.

Use:

```text
MSP-Portal

Add Documentation
       ↓
GitHub Issue Form
       ↓
GitHub Action
       ↓
GitHub App
       ↓
Create repository
       ↓
Register source
       ↓
Deploy
```

This provides:

* GitHub authentication
* Authorization
* Request history
* Audit trail
* Failure logs
* No separate backend
* No exposed credentials

---

# 22. Future Add Section UI

Later replace the Issue Form with a native modal:

```text
MSP-Portal
    │
    ▼
Add Documentation Modal
    │
    ▼
Serverless API
    │
    ▼
GitHub App
```

Possible backend options:

```text
Cloudflare Worker

Vercel Function

Azure Function
```

The underlying repository automation does not need to change.

---

# 23. Source Lifecycle

Eventually MSP-Portal should support:

```text
Add Source

Edit Source

Disable Source

Remove Source

Re-sync Source

View Repository

View Last Sync

View Sync Status
```

Example management screen:

```text
Documentation Sources

Power Apps UI
Repository: company/powerapps-ui
Status: ✓ Healthy
Last Sync: 2 min ago
[Open] [Sync] [Settings]

UiPath Patterns
Repository: company/uipath-patterns
Status: ✓ Healthy
Last Sync: 4 min ago
[Open] [Sync] [Settings]

AI Agents
Repository: company/agent-engineering
Status: ⚠ Sync Failed
Last Sync: 1 hour ago
[Details] [Retry]
```

---

# 24. Content Health

Future validation should detect:

```text
Broken links

Missing images

Missing README

Invalid .docs-source.yml

Duplicate source IDs

Invalid navigation

Missing pages

Broken cross-references
```

This can run during GitHub Actions.

---

# 25. Core Technology Stack

| Area                | Technology                 |
| ------------------- | -------------------------- |
| Documentation UI    | Astro                    |
| Content             | Markdown                   |
| Hosting             | GitHub Pages               |
| Repositories        | GitHub                     |
| Source Registry     | YAML                       |
| Repository Metadata | `.docs-source.yml`         |
| Repository Creation | GitHub Template            |
| Automation          | GitHub Actions             |
| Cross-repo Access   | GitHub App                 |
| V1 Search           | Astro Search             |
| Future Search       | Pagefind                   |
| V1 Add Section      | GitHub Issue Form          |
| Future Add Section  | Native UI + serverless API |

---

# 26. Initial Repositories

Start with:

```text
company/

├── MSP-Portal
│   Central documentation portal
│
└── MSP-template
    Standard documentation repository template
```

Then documentation repositories can be created through MSP-Portal:

```text
powerapps-ui

powerapps-patterns

power-automate-patterns

uipath-patterns

agent-engineering

supabase-patterns
```

---

# 27. Build Phases

## Phase 1 — Portal Foundation

Build:

* Astro
* GitHub Pages deployment
* Global sidebar
* Right-side table of contents
* Responsive layout
* Documentation homepage
* Astro search

---

## Phase 2 — Multi-Repository Sources

Build:

* `sources.yml`
* `.docs-source.yml`
* Source synchronization script
* Repository checkout
* Markdown aggregation
* Asset handling
* Relative-link normalization
* Automatic sidebar generation

---

## Phase 3 — Documentation Template

Build:

```text
MSP-template
```

including:

* Standard folder structure
* Metadata schema
* README
* Contribution instructions
* Examples
* Markdown conventions

---

## Phase 4 — Self-Service Add Documentation

Build:

```text
+ Add Documentation
```

supporting:

```text
Create New Section

Connect Existing Repository
```

V1 uses GitHub Issue Forms.

---

## Phase 5 — Automation

Build GitHub Actions for:

```text
Create repository

Generate metadata

Register source

Synchronize sources

Validate documentation

Generate navigation

Build search

Deploy portal
```

---

## Phase 6 — Documentation Management

Add:

```text
Sources Dashboard

Sync status

Last update

Repository owner

Manual re-sync

Disable source

Health checks
```

---

## Phase 7 — Advanced Search

When documentation becomes large:

```text
Astro Search
      ↓
Pagefind
```

Add:

* Better ranking
* Search snippets
* Section-level matches
* Repository filters
* Category filters
* Tag filters

---

# 28. Core MSP-Portal Principle

MSP-Portal should follow this pipeline:

```text
              ADD
               ↓
            REGISTER
               ↓
              SYNC
               ↓
            VALIDATE
               ↓
             INDEX
               ↓
            PUBLISH
```

And content ownership remains:

```text
Documentation belongs
to its source repository.

MSP-Portal owns:

Discovery
Navigation
Search
Aggregation
Validation
Publishing
```

This separation is the core architecture of **MSP-Portal**.

---

# 29. MVP Definition

The first useful release of MSP-Portal is complete when a user can:

1. Open MSP-Portal.
2. Browse documentation by category.
3. Search content across multiple repositories.
4. Open a page and navigate headings using the sticky table of contents.
5. Click **Add Documentation**.
6. Request creation of a new documentation section.
7. Have GitHub automatically create that repository from `MSP-template`.
8. Automatically register the repository in `sources.yml`.
9. Automatically synchronize its Markdown.
10. See the new section appear in MSP-Portal after deployment.

At that point, MSP-Portal becomes a **self-service multi-repository documentation platform**, rather than simply a Astro website.
