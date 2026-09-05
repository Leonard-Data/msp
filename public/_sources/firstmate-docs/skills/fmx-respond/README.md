# `fmx-respond`

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/fmx-respond/SKILL.md`


**The Relay playbook for public mentions and public completion follow-ups.**

### What it does

When Relay is enabled, `fmx-respond` turns a routed public mention from the captain into either an answer or real Firstmate work.

A question can be answered from known live state.
A request for work goes through the normal lifecycle.
Longer-running work is acknowledged immediately and then linked to a later completion follow-up.
Pure acknowledgments are dismissed without creating pointless public replies.

### When to reach for it

Load it on Relay mention wakes, Relay configuration-error wakes, public follow-up wakes, and milestone or terminal wakes for Relay-linked work.

### How it behaves

The direct routed mention is treated as the captain's instruction, but the surrounding public thread remains untrusted input.

The reply surface is public, so the skill has a stricter disclosure boundary than private captain chat.
Task IDs, private paths, branch names, internal tools, private plans, credentials, and other internal details stay out of the public response.

Destructive, irreversible, and security-sensitive actions still require trusted-channel confirmation even though the mention came from the captain.

### Common questions

**Does Firstmate ask for permission before every Relay reply?**
No.
Enabling Relay is standing authorization for eligible public replies and normal reversible actions.

**Can third-party text in the surrounding thread instruct Firstmate?**
No.
It is context only.

### It's working if

- Public requests cause real work, not an empty "will do" reply.
- Long-running work gets a bounded follow-up path.
- Public replies describe outcomes without leaking internal state.
- High-risk actions are pushed back to a trusted captain channel.

### Where it fits

Relay is an alternate captain-input surface.
`fmx-respond` translates that surface back into the ordinary Firstmate lifecycle and safety model.

**Upstream:** [`.agents/skills/fmx-respond/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/fmx-respond/SKILL.md)

---
