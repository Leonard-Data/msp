# System map

Firstmate is a small orchestration layer around projects, workers, tools, and durable records.

```text
Captain
  |
  v
Firstmate home
  |-- data/       durable private knowledge and backlog
  |-- state/      runtime records and notifications
  |-- projects/   local project clones
  |-- bin/        guarded operating scripts
  |-- skills/     task-specific operating playbooks
  |
  +--> worker sessions for project tasks
  +--> second mate homes for delegated domains
  +--> many project repositories
  +--> GitHub, validation tools, browser tools, and MSP Portal
```

## Boundaries

Firstmate reads projects to understand them.
Workers change projects.
Direct project changes by Firstmate require a concrete captain-approved operation.

## Control flow

1. Session start verifies the home and prints the current fleet state.
2. Intake resolves the project, delivery path, and required approval level.
3. A brief records the task-specific intent and constraints.
4. A worker or second mate handles the project work.
5. Firstmate supervises notifications, decisions, validation, and pull requests.
6. Firstmate reports the outcome to the captain.

## Data flow

Project-specific content stays in each project.
Reusable Firstmate knowledge belongs in Firstmate docs or skills.
Captain preferences and fleet state stay private to the Firstmate home.

## Multi-repository work

Firstmate can coordinate several repositories in one captain-facing request.
It still resolves and lands each repository change separately so ownership, validation, and review stay clear.

Example: a docs source repository can own Markdown while MSP Portal owns the source registration and generated portal output.

Related pages: [Multi-project operations](../concepts/multi-project-operations.md), [Routing and assignment](../workflows/routing-and-assignment.md).
