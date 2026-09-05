# /stow

> **Skill type:** Captain-invocable  
> **Upstream path:** `.agents/skills/stow/SKILL.md`


**Session-to-disk memory curation before a reset or long break.**

### What it does

The internal `stow` skill sweeps the current Firstmate session for durable knowledge and open-work record state that still exists only in conversation.
It then files that material through the existing Firstmate ownership rules and curates the home's startup memory instead of letting it grow as an endless journal.

Memory entries can be pinned, aging, or perishable.
Stale material moves to a cold archive rather than being silently deleted.
The pass also enforces the home's startup-memory budget and requires an honest "safe to reset" verdict.

### When to reach for it

Use `/stow` before resetting or compacting context, after a session that produced reusable operating knowledge, or periodically to keep startup memory current.

### How it behaves

Every pass reads the relevant memory files completely, plans retention before editing, reinforces entries only when the current session provided independent evidence, decays stale entries, consolidates duplicates, and offloads conditional knowledge when an existing on-demand owner is a better home.

Pinned authority and preference entries are protected from automatic eviction.
If safe curation cannot meet the memory budget, the skill surfaces a concrete captain choice instead of pretending the excess is acceptable.

### Common questions

**Is `stow` just "append notes from this session"?**
No.
It is inspect, curate, rewrite, archive, and budget - not blind append.

**Does stale knowledge get deleted?**
No.
It moves to the cold archive with provenance.

### It's working if

- Every durable session-only fact has an authoritative on-disk home or a clearly reported exception.
- Reinforcement dates correspond to evidence from the current session.
- Startup memory stays within budget or a concrete unresolved decision is surfaced.
- The next session receives a smaller, more current operating map.

### Where it fits

Internal `stow` is Firstmate's context-reset hygiene and memory-maintenance skill.

**Upstream:** [`.agents/skills/stow/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/stow/SKILL.md)
