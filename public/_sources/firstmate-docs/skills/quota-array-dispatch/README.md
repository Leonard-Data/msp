# /quota-array-dispatch

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/quota-array-dispatch/SKILL.md`


**Quota-aware selection when more than one dispatch profile is valid.**

### What it does

This skill chooses among multiple crew-dispatch profile candidates while keeping model quality, authentication, quota, and runtime feasibility separate.

The order is deliberate:

1. Eligibility.
2. Required reasoning-class fit.
3. Runway feasibility.
4. Only then rank remaining candidates by `spendPriority`.

Quota is therefore a routing input, not permission to silently downgrade the reasoning class.

### When to reach for it

Load it when a crew-dispatch rule or default resolves to an array of more than one profile.

### How it behaves

The skill takes one quota snapshot and reuses it for all candidates.
Each candidate keeps explicit harness, model, and provider identity.

Unknown quota stays unknown.
It is not converted to zero or healthy state.
Concrete unsupported-model or unusable-credential evidence can block a candidate; missing measurement only creates uncertainty.

A genuine tie is escalated rather than broken by array order or arbitrary naming.

### Common questions

**Can the highest `spendPriority` win even if it will run out mid-task?**
No.
Runway feasibility is a hard gate before ranking.

**Can cheaper quota justify choosing a weaker reasoning class?**
No.
Reasoning-class fit is an independent gate.

### It's working if

- Every candidate is visibly accounted for.
- One quota snapshot supports the whole choice.
- Unknown measurements are disclosed rather than guessed.
- Ties and terminal uncertainty escalate instead of producing arbitrary routing.

### Where it fits

This is the decision layer between crew-dispatch configuration, `quota-axi` data, harness/model discovery, and the final worker spawn.

**Upstream:** [`.agents/skills/quota-array-dispatch/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/quota-array-dispatch/SKILL.md)

---
