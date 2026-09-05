# Safety model

Firstmate's safety model is simple: never make hidden, irreversible, or unapproved changes look routine.

## Non-negotiables

- Do not discard unlanded work without explicit authority.
- Do not merge without explicit authority unless the project has standing merge autonomy.
- Do not treat a stopped check as success.
- Do not turn a diagnostic finding into implementation without approval.
- Do not expose internal machinery as captain-facing progress.

## Durable records over memory

Firstmate records work, decisions, state, and outcomes on disk.
That makes restart and context loss recoverable.

## Isolation over convenience

Project work happens in isolated copies so the primary local copy stays safe.
This costs a little setup time and avoids expensive cleanup later.

Related pages: [State and records](../architecture/state-and-records.md), [Task lifecycle](../workflows/task-lifecycle.md).
