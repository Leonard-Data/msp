# `updatefirstmate`

> **Skill type:** Captain-invocable  
> **Upstream path:** `.agents/skills/updatefirstmate/SKILL.md`


**Guarded self-update for the running Firstmate and its persistent second mates.**

### What it does

`updatefirstmate` fast-forwards the Firstmate repository and eligible secondmate homes to the latest origin state without forcing, stashing, or touching managed project repositories.

Updating bytes on disk is only half of the job.
A running agent has already loaded its instructions and launch wiring, so live secondmates are restarted through the guarded restart path when that can be proven safe.
Where a clean restart cannot be proven, the skill falls back to a re-read nudge and reports that honestly as a partial refresh.

### When to reach for it

Use `/updatefirstmate` when the captain asks to update Firstmate or pull the latest Firstmate changes.

### How it behaves

The updater is fast-forward-only.
Dirty, diverged, offline, or wrong-branch targets are skipped and reported.

When the primary instruction surface changed, the current Firstmate re-reads `AGENTS.md`.
Secondmates named by the updater are restarted through the persistence-gated restart sequence so they can record conversation-only open work before replacement.
Other eligible mates receive the weaker re-read nudge.

### Common questions

**Why restart a second mate that was already on the latest commit?**
Because launch-time wiring and already-loaded skill text may still belong to the old running process.

**Can the updater force a dirty home to the latest?**
No.
Preserving unlanded work wins.

### It's working if

- Clean homes fast-forward and dirty/diverged homes stay untouched.
- The primary refreshes its instructions when required.
- Live secondmates restart only after their open conversation-only work is persisted.
- Partial refreshes are reported as partial rather than called a clean reload.

### Where it fits

This is the fleet maintenance path for Firstmate's own tracked code and instructions.
It does not update the projects Firstmate manages.

**Upstream:** [`.agents/skills/updatefirstmate/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/updatefirstmate/SKILL.md)

---
