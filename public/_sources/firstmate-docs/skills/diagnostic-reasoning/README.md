# /diagnostic-reasoning

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/diagnostic-reasoning/SKILL.md`


**A causal-reasoning procedure for reported bugs.**

### What it does

`diagnostic-reasoning` keeps bug investigation grounded in end-user behavior.
It requires a reproduction where feasible and separates:

- the initiating trigger,
- the masking condition,
- the visible symptom.

It then compares the failing path with a proven path, inspects relevant history, tests the smallest useful counterfactual, and actively looks for evidence that would falsify the leading explanation.

### When to reach for it

Load it before scoping a reported bug and before accepting a diagnostic report as the basis for implementation.

### How it behaves

A diagnostic report must distinguish facts from hypotheses.
If a load-bearing causal step is missing, Firstmate routes focused follow-up investigation instead of treating confidence or detailed implementation prose as proof.

Diagnosis is evidence, not permission to edit code.
Implementation still needs the normal lifecycle authority.

### Common questions

**Is the most recent nearby commit assumed to be the cause?**
No.
History is supporting evidence, not automatic causality.

**What happens to the reproduction after the fix is authorized?**
It should become the regression test when practical.

### It's working if

- The explanation accounts for both the failing and proven paths.
- Trigger, mask, and symptom are not conflated.
- At least one meaningful disconfirming check was considered.
- Uncertainty that could change scope remains visible.

### Where it fits

This skill is the reasoning layer between a bug report and an implementation brief.

**Upstream:** [`.agents/skills/diagnostic-reasoning/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/diagnostic-reasoning/SKILL.md)

---
