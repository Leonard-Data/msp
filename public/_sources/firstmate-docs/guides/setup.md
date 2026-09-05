# Setup

This guide describes the shape of a healthy Firstmate home.
Exact installation commands may vary by environment, so treat this page as the checklist.

## Prerequisites

- Git is installed and authenticated for the required repositories.
- GitHub access is available through `gh-axi`.
- The chosen agent runtime is installed and authenticated.
- `no-mistakes` is available for projects that require the full validation path.
- MSP Portal can read documentation source repositories that should be published.

## Home layout

A Firstmate home contains:

- `data/` for durable private records
- `state/` for runtime records
- `projects/` for local repository clones
- `bin/` for guarded scripts
- `.agents/skills/` for internal skills

## First startup check

Run the session-start command for the home and read the digest it prints.
Resolve any missing tools or authentication blockers before dispatching work.

## Add a documentation source

1. Create or clone the source repository.
2. Ensure it has `.docs-source.yml` and `docs/`.
3. Add the repository to MSP Portal's `sources.yml`.
4. Run MSP Portal source validation and build checks.
5. Open a pull request for the portal registration.

Related page: [MSP documentation sync](../workflows/documentation-sync.md).
