# /firstmate-coding-guidelines

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/firstmate-coding-guidelines/SKILL.md`


**The repository-change rules for Firstmate itself.**

### What it does

This skill governs changes to Firstmate's shared tracked material.
Its main purpose is preventing always-loaded instructions from becoming a dumping ground for conditional detail.

It defines a knowledge-placement decision tree, the one-owner rule for contracts, the inline-stub pattern, trigger hygiene for new skills, documentation audience rules, harness-dependent verification expectations, and repository style conventions.

### When to reach for it

Load it before editing Firstmate's tracked instructions, scripts, skills, or maintained documentation - whether Firstmate is editing directly or a delegated worker is doing the change.

### How it behaves

The central design rule is: put each fact in the narrowest authoritative home that needs it.
Always-needed behavior belongs in `AGENTS.md`.
Situation-specific operating detail belongs in a skill.
Exact mechanics belong with the script and its help.
Current public behavior belongs in the appropriate documentation audience.
Task chronology stays in task or PR evidence.

Contracts should have one full owner and cross-references elsewhere rather than duplicated explanations.

### Common questions

**Why not just add another paragraph to `AGENTS.md`?**
Because every session pays that token cost even when the situation never occurs.

**Can the same state-machine contract be copied into docs and a skill for convenience?**
No.
One surface owns the contract; the other points to it.

### It's working if

- Conditional detail moves out of always-loaded instructions.
- New skills have explicit load triggers.
- Documentation changes preserve one authoritative owner.
- Harness-sensitive behavior has both portable regression coverage and real-harness verification.

### Where it fits

This is the contributor architecture and writing discipline for the Firstmate repository itself.

**Upstream:** [`.agents/skills/firstmate-coding-guidelines/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/firstmate-coding-guidelines/SKILL.md)

---
