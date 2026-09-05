# /decision-hold-lifecycle

> **Skill type:** Compatibility pointer  
> **Upstream path:** `.agents/skills/decision-hold-lifecycle/SKILL.md`


**A temporary compatibility redirect to `captain-hold-lifecycle`.**

### What it does

Nothing new.
The former decision-specific model has been renamed and collapsed into captain-held tasks.

### When to reach for it

Only when an older in-flight brief still points to `decision-hold-lifecycle` or the legacy decision-hold command.

### How it behaves

It redirects the agent to `captain-hold-lifecycle`.
The legacy command remains only as a compatibility shim for the transition period.

### Common questions

**Should new documentation or automation use this name?**
No.
Use `captain-hold-lifecycle`.

### It's working if

- Old briefs keep functioning during migration.
- New work uses the captain-hold terminology and owner.

### Where it fits

This is a migration bridge, not a parallel skill.

**Upstream:** [`.agents/skills/decision-hold-lifecycle/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/decision-hold-lifecycle/SKILL.md)

---
