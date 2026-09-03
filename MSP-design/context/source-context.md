# Source Project Context

This design-system workspace was created from an existing OpenDesign project. Treat the copied project files as the primary source evidence for the generated design system.

## Source project

- Source project id: 2b7d77f4-c6c3-472e-b851-eea1beb21ace
- Source project name: Web Prototype
- New design-system project id: 918f21ee-e975-4e55-a8d2-f4c516eb0c68
- New design-system id: user:web-prototype-design-system-2
- Source skill id: (none)
- Source design system id: notion

## Source metadata

```json
{
  "kind": "prototype",
  "nameSource": "prompt",
  "localCatalogScopes": {
    "designSystem": {
      "workspaceId": "y03xvcgduno6etr6mqqbgas2",
      "workspaceMemberId": "qt06qbes2tf01mos3amum0i7"
    }
  }
}
```

## Copied files

- docs-protocol.html
- nul

## Skipped files

- (none)

## Generation contract

- Read this file before editing design-system outputs.
- Read the copied files directly from the project workspace; they are source evidence, not generated design-system output.
- Preserve high-signal assets, source examples, UI surfaces, copy, tokens, typography, and interaction patterns from the copied project.
- Generate a reusable OpenDesign design-system package in this same project: DESIGN.md, README.md, SKILL.md, colors_and_type.css, context/provenance, focused preview cards, preserved assets/build/fonts when available, and ui_kits/app/.
- Before final response, run `"$OD_NODE_BIN" "$OD_BIN" tools connectors design-system-package-audit --path . --fail-on-warnings` and fix every actionable issue.
