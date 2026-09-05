# /ask-user-authority

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/ask-user-authority/SKILL.md`


**The decision policy for whether a validation finding really needs the captain.**

### What it does

`ask-user-authority` is the single owner of how Firstmate handles `ask-user` findings from the validation pipeline.
It prevents a reviewer or implementation worker from silently expanding the accepted contract and also prevents Firstmate from escalating routine, clearly in-scope corrections unnecessarily.

The core question is not "is this difficult?"
It is "does choosing this fix materially change what the captain already agreed to build or maintain?"

### When to reach for it

Load it before deciding any `ask-user` finding.
The implementation worker never decides its own finding; Firstmate applies this policy.

### How it behaves

Firstmate reconstructs accepted intent, identifies what the proposed fix would commit the project to, and then separates ordinary completion of the accepted design from genuine contract expansion.

Straight corrections, restoration of accepted behavior, and implementation complexity stay within Firstmate's authority when intent is clear.
New product guarantees, threat models, subsystems, broad abstractions, destructive actions, or unresolved architecture choices escalate.

### Common questions

**Does "security" automatically mean escalate?**
No.
Labels are evidence, not authority.
A genuinely security-sensitive action still escalates under the stronger safety boundary.

**Does yolo change this policy?**
No.
The skill explicitly separates finding authority from merge/autonomy posture.

### It's working if

- In-scope corrections are decided without bothering the captain.
- New guarantees or ambiguous product choices are surfaced before implementation expands the contract.
- Escalations explain the original requirement, proposed expansion, smallest compliant alternative, consequences, and recommendation.

### Where it fits

This skill sits between validation findings and implementation.
It protects the captain's accepted intent while allowing Firstmate to keep routine correction work moving.

**Upstream:** [`.agents/skills/ask-user-authority/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/ask-user-authority/SKILL.md)

---
