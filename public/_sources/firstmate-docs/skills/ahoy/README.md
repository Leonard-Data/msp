# /ahoy

> **Skill type:** Captain-invocable  
> **Upstream path:** `.agents/skills/ahoy/SKILL.md`


**A session recap plus guided clearing of visibly unanswered captain decisions.**

### What it does

`ahoy` summarizes only what is already visible in the current conversation.
It does not perform a fresh fleet scan.
It finds the previous real captain message, recaps the visible events after that boundary, and separately searches the visible session for decisions that remain unanswered.

If an open decision exists, `ahoy` presents one at a time, ordered by Firstmate's judgment of impact, with enough context and a recommendation for the captain to answer it.

### When to reach for it

Use `/ahoy` when you want to know what happened **in this session** since your last real message.
If `/ahoy` is effectively the first real captain message of the session, it falls back to `bearings` because there is no meaningful session interval to recap.

### How it behaves

The skill first ensures the session-start digest has been processed.
For a normal recap it then stays session-history-only: no GitHub queries, file scans, watcher calls, or fleet probes.

Operational injections are excluded from the captain-message boundary so daemon and startup messages do not accidentally reset the recap window.

### Common questions

**How is `/ahoy` different from `/bearings`?**
`ahoy` answers "what happened in this visible conversation?"
`bearings` answers "what is the fleet's current state now?"

**Can `ahoy` discover live state that was never shown in chat?**
No.
That is intentionally outside its contract.

### It's working if

- The recap contains only events visible after the previous real captain message.
- Older unanswered captain decisions are still surfaced even if they predate that recap boundary.
- No fresh operational state is gathered on the normal recap path.
- The captain can clear open decisions one at a time.

### Where it fits

Use `ahoy` for conversational continuity and `bearings` for operational truth.
They complement each other rather than competing.

**Upstream:** [`.agents/skills/ahoy/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/ahoy/SKILL.md)

---
