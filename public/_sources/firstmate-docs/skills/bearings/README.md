# /bearings

> **Skill type:** Captain-invocable  
> **Upstream path:** `.agents/skills/bearings/SKILL.md`


**A fresh fleet snapshot for picking up where you left off.**

### What it does

`bearings` gathers a bounded live fleet snapshot and turns it into a captain-facing digest.
Its normal response has exactly four sections:

1. **Captain's Call** - things that need the captain now.
2. **Recently Landed** - current recent completions.
3. **Underway** - work actively progressing.
4. **Charted Next** - queued, gated, deferred, or integrity-warning items.

Plain `/bearings` is chat-only.
`/bearings file` additionally writes the dated Markdown report.
`/bearings lavish` additionally builds an interactive fleet board.
Live PR enrichment is opt-in.

### When to reach for it

Use `/bearings` for a morning brief, catch-up, status report, "where did I leave off?", or "what's in the works?"

### How it behaves

The skill uses the dedicated fleet-snapshot command as its bounded current-state source.
It does not reconstruct the present by scraping old reports or conversation history.

The richer modes still start from the same snapshot.
The Lavish board can carry captain decisions and merge actions, but those answers are routed through the normal captain-hold and merge safeguards rather than bypassing them.

### Common questions

**Is Bearings a delta from the last report?**
No.
Every run is a complete current snapshot.

**Does a board "Merge now" click count as approval?**
Yes, for that exact PR, but Firstmate re-verifies the PR and uses the guarded merge path before acting.

### It's working if

- All four sections always render, including their empty states.
- Captain-only actions do not get mixed with work that is progressing autonomously.
- Deferred decisions sit in Charted Next until their date rather than looking urgent.
- The digest reflects fresh structured fleet state instead of historical prose.

### Where it fits

`bearings` is the fleet-level operational view.
Use it after breaks, context resets, or whenever the captain needs a single current picture.

**Upstream:** [`.agents/skills/bearings/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/bearings/SKILL.md)

---
