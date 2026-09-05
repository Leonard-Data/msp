# MSP documentation sync

MSP Portal can publish documentation from multiple source repositories.
Each source owns its docs, and the portal owns aggregation, navigation, search, and deployment.

## Source repository contract

A source repository needs:

- `.docs-source.yml`
- a `docs/` directory
- relative links inside Markdown
- local assets under `docs/assets/` or a documented subfolder

## Portal registration

MSP Portal registers a source in `sources.yml`.
A remote source entry normally names:

```yaml
- repo: Leonard-Data/firstmate-docs
  defaultBranch: main
```

## Sync flow

1. MSP Portal reads `sources.yml`.
2. It clones each remote source or reads each configured local source.
3. It reads `.docs-source.yml` from each source.
4. It copies the source `docs/` tree into generated portal content.
5. It builds source navigation and search metadata.

## Documentation quality rule

Make each source useful on GitHub before relying on the portal.
The portal should improve discovery, not rescue unclear content.
