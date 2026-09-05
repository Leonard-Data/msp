# Firstmate skills

Firstmate skills are focused operating playbooks loaded only when a particular procedure, decision boundary, or recovery path is needed.

This section mirrors the upstream Firstmate skill tree:

```text
kunchenguid/firstmate/.agents/skills/<skill>/SKILL.md
                         |
                         v
firstmate-docs/docs/skills/<skill>/README.md
```

The mirrored directory layout keeps each skill independently readable, makes future skill-specific examples and assets easy to colocate, and keeps the MSP Portal route stable as `/skills/<skill>/`.

## Skill types

- **Captain-invocable** - the captain can intentionally invoke the behavior.
- **Agent-only** - Firstmate loads the procedure when its trigger occurs.
- **Compatibility pointer** - retained temporarily so older briefs continue to resolve.
- **Installer-facing public skill** - standalone skill shipped outside the internal `.agents/skills/` runtime tree.

## Skill catalog

| Skill | Type | When it matters |
| --- | --- | --- |
| [`afk`](afk/README.md) | Captain-invocable | The captain is stepping away and routine supervision should be batched. |
| [`ahoy`](ahoy/README.md) | Captain-invocable | The captain wants a recap of visible session events and unanswered decisions. |
| [`ask-user-authority`](ask-user-authority/README.md) | Agent-only | A validation finding asks for a decision and Firstmate must judge whether escalation is truly required. |
| [`bearings`](bearings/README.md) | Captain-invocable | The captain wants a fresh fleet-level catch-up or status report. |
| [`bootstrap-diagnostics`](bootstrap-diagnostics/README.md) | Agent-only | Session startup reports an actionable dependency, network, sync, or reconciliation problem. |
| [`captain-hold-lifecycle`](captain-hold-lifecycle/README.md) | Agent-only | Work discovers a question only the captain can answer, or the captain's answer must be recorded. |
| [`decision-hold-lifecycle`](decision-hold-lifecycle/README.md) | Compatibility pointer | An older brief still points to the former decision-hold name. |
| [`diagnostic-reasoning`](diagnostic-reasoning/README.md) | Agent-only | A reported bug needs causal diagnosis before implementation is scoped. |
| [`firstmate-codexapp`](firstmate-codexapp/README.md) | Agent-only | Firstmate is coordinating a visible Codex Desktop thread. |
| [`firstmate-coding-guidelines`](firstmate-coding-guidelines/README.md) | Agent-only | Tracked Firstmate material itself is being changed. |
| [`firstmate-orca`](firstmate-orca/README.md) | Agent-only | Orca is being selected, supervised, smoke-tested, or recovered as a runtime backend. |
| [`fmx-respond`](fmx-respond/README.md) | Agent-only | Relay delivers a public mention or follow-up wake. |
| [`harness-adapters`](harness-adapters/README.md) | Agent-only | A harness-specific launch, control, recovery, trust, model, or verification fact is needed. |
| [`process-event-sources`](process-event-sources/README.md) | Agent-only | Firstmate needs to arm or handle a durable event from a blocking external process. |
| [`project-management`](project-management/README.md) | Agent-only | A project is being added, cloned, created, initialized, registered, or removed. |
| [`quota-array-dispatch`](quota-array-dispatch/README.md) | Agent-only | A dispatch rule resolves to multiple model/harness candidates. |
| [`secondmate-provisioning`](secondmate-provisioning/README.md) | Agent-only | A persistent second mate is being created, synchronized, routed, recovered, or retired. |
| [`stow`](stow/README.md) | Captain-invocable | The session is about to reset or durable knowledge needs to be curated to disk. |
| [`stuck-crewmate-recovery`](stuck-crewmate-recovery/README.md) | Agent-only | An ordinary direct report is stale, confused, missing, wedged, or failed to receive a steer. |
| [`updatefirstmate`](updatefirstmate/README.md) | Captain-invocable | The captain wants the running Firstmate fleet updated to the latest tracked Firstmate code. |

## Public skills

The upstream repository currently also exposes a standalone public `stow` skill under `skills/stow/SKILL.md`.

- [`stow` - internal Firstmate version](stow/README.md)
- [`stow` - public installer-facing version](stow/public.md)

These are deliberately separate implementations.
The public skill cannot assume a Firstmate home, Firstmate scripts, or Firstmate-private state.

## How the catalog fits together

```text
Captain/session
  afk
  ahoy
  bearings
  stow
  updatefirstmate

Intake and dispatch
  project-management
  secondmate-provisioning
  quota-array-dispatch
  harness-adapters

Work and diagnosis
  diagnostic-reasoning
  firstmate-codexapp
  firstmate-orca
  stuck-crewmate-recovery

Decisions and validation
  ask-user-authority
  captain-hold-lifecycle
  decision-hold-lifecycle

Asynchronous and public inputs
  process-event-sources
  fmx-respond

Firstmate repository maintenance
  firstmate-coding-guidelines
  bootstrap-diagnostics
```

The architectural rule across the catalog is **one owner per contract**.
A skill owns the reasoning or procedure associated with its trigger.
Scripts own exact command mechanics.
Other documentation points to the owner rather than duplicating the same operating contract.
