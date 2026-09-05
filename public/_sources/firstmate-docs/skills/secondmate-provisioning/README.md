# /secondmate-provisioning

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/secondmate-provisioning/SKILL.md`


**The lifecycle for persistent delegated Firstmate homes.**

### What it does

`secondmate-provisioning` owns persistent secondmate setup, routing-table records, seeding, launching, synchronization, inherited configuration, backlog handoff, recovery, and retirement.

A second mate is not just another worker.
It has a durable home, charter, domain scope, backlog, local or remote placement, and its own supervised crews.

### When to reach for it

Load it when creating, seeding, validating, launching, recovering, handing backlog to, synchronizing, or retiring a second mate, and before editing `data/secondmates.md`.

### How it behaves

Routing is based on natural-language `scope:`.
The `projects:` field is a clone list, not ownership.

Local secondmate homes can be durably leased.
Whole remote homes use an explicit remote route and are readiness-checked before seed or launch.

Tracked Firstmate updates converge into the persistent home through guarded fast-forward rules.
A declared set of gitignored configuration and shared captain-preference material is propagated separately, with ownership and read-only rules preserved.

The secondmate's own launch harness can be pinned independently from the harness its crewmates inherit.

### Common questions

**Does a project listed under a second mate mean that mate owns every related request?**
No.
Scope is authoritative; the project list is not.

**Can Firstmate edit a secondmate copy of shared captain preferences and sync it back?**
No.
The primary home is authoritative for the shared preference file.

### It's working if

- Domain routing follows declared scope.
- Persistent homes survive restart without losing their charter or backlog.
- Dirty or divergent homes are never force-updated.
- Remote routes preserve their placement and do not silently fall back to local work.
- Inherited material converges without overwriting unrelated local state.

### Where it fits

This is the persistent-delegation layer above ordinary crewmates.
It works with `harness-adapters`, `project-management`, `updatefirstmate`, and the remote event/supervision paths.

**Upstream:** [`.agents/skills/secondmate-provisioning/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/secondmate-provisioning/SKILL.md)

---
