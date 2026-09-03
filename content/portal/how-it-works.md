# How it works

The portal keeps documentation in the owning repositories and pulls copies into the Astro site at build time.

## Pipeline

`ADD -> REGISTER -> SYNC -> VALIDATE -> INDEX -> PUBLISH`

## Source contract

Every source repository should contain:

- `docs/`
- `.docs-source.yml`

## Why this model

- Docs stay close to the code
- The portal stays small
- Search and navigation stay centralized
