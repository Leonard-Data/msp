# `firstmate-orca`

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/firstmate-orca/SKILL.md`


**The operator checklist for the experimental Orca runtime backend.**

### What it does

`firstmate-orca` explains how to safely spawn, supervise, recover, and smoke-test Firstmate work using Orca.

The important model is that Orca is a **runtime backend**, not an agent harness.
Orca owns the task endpoint and worktree; a harness such as Claude, Codex, OpenCode, Pi, Grok, or Kimi still runs inside it.

### When to reach for it

Load it when selecting Orca, spawning Orca-backed work, debugging an Orca task, reconciling Orca metadata, or verifying backend lifecycle behavior.

### How it behaves

The skill prefers Firstmate's guarded helper scripts instead of raw Orca operations.
Existing task metadata remains the routing identity.
Switching backend configuration affects future spawns only; already-running tasks keep their recorded backend.

Recovery begins from recorded metadata and preserves the existing task copy rather than manufacturing a replacement task.

### Common questions

**Does this replace `harness-adapters`?**
No.
Use `harness-adapters` for harness-specific launch, interrupt, trust, resume, and invocation behavior.

**Can raw Orca deletion be used to clean a broken task?**
The normal path is guarded Firstmate teardown and recovery, not manual backend surgery.

### It's working if

- Metadata records Orca as the backend and retains the necessary Orca/worktree identity.
- Peek, send, state, watcher, and teardown operate through Firstmate helpers.
- Recovery preserves existing task work.
- Backend smoke tests stay isolated from unrelated feature work.

### Where it fits

This skill is the backend-specific operating layer between Firstmate lifecycle commands and Orca.

**Upstream:** [`.agents/skills/firstmate-orca/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/firstmate-orca/SKILL.md)

---
