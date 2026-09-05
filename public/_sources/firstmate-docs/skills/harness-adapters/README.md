# /harness-adapters

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/harness-adapters/SKILL.md`


**The router and reference set for harness-specific behavior.**

### What it does

`harness-adapters` is the single routing owner for operations that vary by agent harness.

It currently carries verified facts for Claude, Codex, OpenCode, Pi, Pi-signed, Grok, Kimi, Cursor, Gemini, and Muse.
The files under its `references/` directory are supporting resources of this one skill, not separate skills.

### When to reach for it

Load it before spawning or recovering workers, handling trust dialogs, invoking harness-specific skills, interrupting or exiting agents, resuming exited agents, selecting model/effort behavior, or verifying a new adapter.

### How it behaves

The skill first chooses the operation, then loads the required common references plus exactly the selected harness reference.

It refuses to dispatch work on an unverified adapter.
For recovery and control, the recorded task `harness=` is authoritative; Firstmate does not guess from the model provider.

Lifecycle control is delivered through the guarded control plane rather than typed as chat text.

### Common questions

**Is Pi-signed a separate reference file?**
It routes through the Pi reference while preserving its distinct verified identity.

**Can Muse or Gemini be used everywhere?**
Their verified role is narrower; the skill records those support boundaries.

### It's working if

- Only verified adapters receive dispatches.
- Each operation loads the minimum relevant common and harness references.
- Recovery uses recorded harness identity.
- Harness-specific control never gets accidentally sent as ordinary chat.

### Where it fits

This skill is the portability layer that lets Firstmate keep one lifecycle while supporting multiple coding-agent runtimes.

**Upstream:** [`.agents/skills/harness-adapters/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/harness-adapters/SKILL.md)

---
