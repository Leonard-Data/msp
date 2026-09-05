# Harnesses

A harness is the worker runtime Firstmate uses to run an agent session.
Different harnesses have different strengths, limits, authentication models, and supervision behavior.

## Harness philosophy

Use the harness as a tool, not as the architecture.
Firstmate keeps the operating contract stable while the underlying runtime can vary.

Good harness selection considers:

- task complexity
- model capability
- available quota
- authentication state
- required tool access
- reliability for the specific job

## Practical rule

Do not pick a harness because it is fashionable.
Pick the smallest reliable runtime that can complete the task safely.

## What Firstmate standardizes

Firstmate standardizes the lifecycle around the harness:

- spawn
- trust handling
- steering
- interruption
- recovery
- status interpretation
- cleanup

Related pages: [Scripts](scripts.md), [Task lifecycle](../workflows/task-lifecycle.md).
