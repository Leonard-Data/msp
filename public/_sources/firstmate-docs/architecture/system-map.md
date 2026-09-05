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
