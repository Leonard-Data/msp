# `afk`

> **Skill type:** Captain-invocable  
> **Upstream path:** `.agents/skills/afk/SKILL.md`


**Away-mode supervision for when the captain steps away.**

### What it does

`afk` changes the supervision strategy while the captain is absent.
It creates durable away-mode state, keeps the sub-supervisor running, lets routine wakes be handled without spending a full Firstmate model turn, and batches captain-relevant events into concise escalations.

The important distinction is that away mode changes **notification and supervision cadence**, not approval authority.
A merge, destructive action, credential request, or unresolved captain decision still waits for the captain.

### When to reach for it

Use `/afk` when the captain is leaving the terminal for a while and wants the fleet to keep moving without waking Firstmate's LLM for every routine event.
The same lifecycle is also loaded when Firstmate detects the durable away marker or an away-supervisor operational message.

### How it behaves

Entering away mode starts or confirms the tracked supervision daemon through the guarded Firstmate launch path.
The daemon classifies wakes, self-handles routine heartbeats and normal progress, buffers higher-value events, and injects only when the captain pane is safe to receive input.

Returning does not require a `/back` command.
The first genuine captain message exits away mode, performs catch-up and blocker checks, and restores normal per-wake responsiveness.

### Common questions

**Does `/afk` give Firstmate more authority?**
No.
It only changes how often and how compactly information is surfaced.

**Can the daemon type into a busy composer?**
It is designed to fail closed.
Busy or uncertain composer state defers delivery instead of risking mixed input.

### It's working if

- Routine progress continues without repeated captain-facing interruptions.
- Decisions, failures, credentials, and other captain-relevant outcomes still surface.
- A real captain message exits away mode automatically.
- Returning to the session produces a clean catch-up rather than losing buffered events.

### Where it fits

`afk` is the supervision mode for walk-away periods.
It works beside `process-event-sources`, `captain-hold-lifecycle`, and the ordinary watcher rather than replacing their authority.

**Upstream:** [`.agents/skills/afk/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/afk/SKILL.md)

---
