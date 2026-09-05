# /bootstrap-diagnostics

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/bootstrap-diagnostics/SKILL.md`


**The response playbook for actionable startup diagnostics.**

### What it does

`bootstrap-diagnostics` translates session-start diagnostic lines into the correct next action.
It covers missing tools, manual dependencies, GitHub authentication, invalid backends, network checks, fleet-sync drift, backlog reconciliation, secondmate convergence, Relay problems, and other startup conditions that need action.

### When to reach for it

Load it when session start, `fm-bootstrap.sh`, or the startup network stage prints one of the skill's actionable diagnostic classes.
A silent bootstrap section or ordinary informational line does not justify loading it.

### How it behaves

The skill preserves the detect -> consent -> install boundary.
Firstmate may explain missing dependencies and installation commands, but it does not install tools without the captain's session-level approval.

It also distinguishes "failed" from "unknown."
For example, a network check that did not complete is not automatically an authentication failure.

### Common questions

**Does every startup warning block work?**
No.
Some skips are benign.
The playbook tells Firstmate which ones require remediation before dependent work can proceed.

**Can Firstmate run interactive GitHub login for the captain?**
No.
It asks the captain to perform the interactive login.

### It's working if

- Startup diagnostics turn into specific remediation instead of vague warnings.
- Missing tools are not installed without consent.
- Dirty or diverged homes are left untouched rather than forced forward.
- Unknown network state is not misreported as a bad credential.

### Where it fits

This is the startup triage layer between session diagnostics and normal dispatch.

**Upstream:** [`.agents/skills/bootstrap-diagnostics/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/bootstrap-diagnostics/SKILL.md)

---
