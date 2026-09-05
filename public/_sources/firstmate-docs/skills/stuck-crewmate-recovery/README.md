# `stuck-crewmate-recovery`

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/stuck-crewmate-recovery/SKILL.md`


**Escalating recovery for an ordinary direct report that is missing or stuck.**

### What it does

This skill recovers normal `ship` and `scout` direct reports without discarding their work.

It starts with evidence - current task state, endpoint presence, status, steering inbox, and existing worktree - then escalates from a simple answer or corrective steer to interrupt, relaunch, and finally failure reporting.

### When to reach for it

Load it when session start reports an ordinary direct report with a dead endpoint or missing window, or after stale wakes, looping output, repeated confusion, an unanswered steer, or an apparently unresponsive worker.

### How it behaves

The skill treats a dead endpoint as a presence signal, not proof that the task's work is gone.
It checks for authoritative validation or existing task work before attempting replacement.

A relaunch keeps the same task identity and existing local copy.
It does not create a fresh generic task while the recorded worktree is still unaccounted for.

Secondmates are explicitly out of scope; use `secondmate-provisioning` for them.

### Common questions

**Is low context enough reason to relaunch a worker?**
No.
Modern harnesses may compact and continue.

**What if the worker is asking something already answered by its brief?**
Answer it with one concise steer before escalating.

### It's working if

- Existing commits and uncommitted work survive recovery.
- Simple confusion is corrected before expensive relaunch.
- A genuinely wedged worker can be replaced in the same task copy.
- After repeated failed relaunches, Firstmate reports the preserved work and plain consequence instead of silently losing state.

### Where it fits

This is the recovery ladder for ordinary direct reports.
It sits beside `harness-adapters` and below the separate persistent secondmate recovery path.

**Upstream:** [`.agents/skills/stuck-crewmate-recovery/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/stuck-crewmate-recovery/SKILL.md)

---
