# State and records

Firstmate is restartable because important facts are recorded outside the chat.

## Main record families

- `data/` keeps durable private knowledge, backlog, project registry, and captain preferences.
- `state/` keeps runtime records, notifications, task metadata, and worker status events.
- `projects/` keeps local clones of repositories.
- `bin/` keeps guarded scripts that mutate state safely.
- `.agents/skills/` keeps operating playbooks for specialized procedures.

## Important distinction

A status event is not the same as current truth.
When action depends on live state, Firstmate asks the current-state script or the relevant tool instead of trusting the last visible line.

## Why not just remember?

Context windows end, terminals restart, and agents crash.
Durable records let Firstmate recover without inventing what happened.
