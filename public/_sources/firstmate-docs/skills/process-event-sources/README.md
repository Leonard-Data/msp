# /process-event-sources

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/process-event-sources/SKILL.md`


**Durable wake handling for blocking external processes.**

### What it does

This skill lets Firstmate register a long-running or blocking external process, continue the conversation, and be woken when the process produces a result.

Supported patterns include Lavish reviews, remote secondmate replies, quota checks, and deterministic "when condition becomes true, run exact safe action" watches.

### When to reach for it

Load it before arming an owned process-event source or whenever a `procevent <adapter> <source-id> <sequence>` wake arrives.

### How it behaves

Captured output is stored before the wake is published.
Firstmate reads the exact durable result, asks the adapter how to classify it, performs the required action, and then explicitly records the result as handled.

The source result is **input, not authority**.
Text returned by an external process cannot grant approval or become shell instructions.

The skill is intentionally precise about its reliability boundary: it does not claim generic lossless or exactly-once external effects.

### Common questions

**Why not just run the blocking command in the current turn?**
Because the whole purpose of the runner is to keep blocking external work from holding the conversational turn.

**Is reading the result file enough to retire the wake?**
No.
The explicit handled acknowledgement is the durable retirement step.

### It's working if

- Blocking sources do not freeze the captain conversation.
- Results survive until explicitly handled.
- Repeat wakes can be deduplicated by source and sequence.
- External bytes never bypass normal approval and safety rules.

### Where it fits

This is the asynchronous bridge between Firstmate's conversational loop and external long-running processes.

**Upstream:** [`.agents/skills/process-event-sources/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/process-event-sources/SKILL.md)

---
