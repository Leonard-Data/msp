# Multi-project operations

Firstmate can coordinate work across many repositories without making the captain manage each repository by hand.
The important idea is that Firstmate treats every request as project-specific at intake, even when the captain describes a bigger outcome.

## What Firstmate can control

Firstmate can keep track of:

- multiple registered projects
- each project's delivery posture
- local clones used for reading and safe coordination
- isolated worker copies for implementation
- pull requests and validation state
- second mates that own durable domains

This lets one captain-facing conversation coordinate several repositories while each repository still keeps its own code, docs, tests, and review path.

## Project routing

A request can name a project directly:

```text
In MSP, register the Firstmate docs source.
```

It can also name a product area or outcome:

```text
Make the docs portal show our Firstmate operating guide.
```

Firstmate then matches the request against the project registry, active work, known source code, and second mate scopes.
If the match is unclear, Firstmate asks one clarifying question instead of guessing.

## Why projects stay separate

Keeping repositories separate protects ownership:

- MSP Portal owns aggregation and publishing.
- A docs source owns its own Markdown and metadata.
- Firstmate owns orchestration and safety records.
- A worker owns one scoped change at a time.

Cross-repo work is normal, but each repo still lands through its own review and validation path.

Related pages: [Routing and assignment](../workflows/routing-and-assignment.md), [System map](../architecture/system-map.md), [Multi-project examples](../examples/multi-project-requests.md).
