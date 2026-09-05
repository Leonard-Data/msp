# /captain-hold-lifecycle

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/captain-hold-lifecycle/SKILL.md`


**The lifecycle for work that is waiting on the captain.**

### What it does

This skill collapses the older separate "decision" concept into one simpler primitive: an ordinary task held for the captain.

When an investigation, scout report, or visual review discovers a genuine unresolved choice, the question must be represented as a captain-held task before the originating work is considered complete.
When the captain answers, their actual words are recorded as part of closing or releasing that task.

### When to reach for it

Load it before declaring an investigation or visual review complete when captain questions may exist, when recording a captain answer, or when Firstmate detects record divergence between decision surfaces.

### How it behaves

Prefer holding the work item that the question gates.
Create a new task only when no suitable work item exists.

A "later" answer does not fabricate completion.
It re-holds the item with a future date so it leaves the live Captain's Call and resurfaces later.

### Common questions

**Does finishing the investigation close its captain decision?**
No.
The held task remains open until the captain answers or explicitly defers it.

**Can a board or chat channel close a captain decision independently?**
No.
Channels feed the same keyed answer owner; they do not invent their own decision state.

### It's working if

- No investigation is marked complete while it still has an unrepresented captain call.
- The captain's exact answer is durably recorded.
- Deferred calls move to a dated gate.
- Bearings reflects answered, released, and deferred outcomes correctly.

### Where it fits

This is the authoritative state bridge between investigations, visual review, chat or board answers, and Bearings' Captain's Call.

**Upstream:** [`.agents/skills/captain-hold-lifecycle/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/captain-hold-lifecycle/SKILL.md)

---
