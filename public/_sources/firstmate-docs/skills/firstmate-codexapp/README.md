# `firstmate-codexapp`

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/firstmate-codexapp/SKILL.md`


**A companion-workflow playbook for visible Codex Desktop threads.**

### What it does

This skill lets Firstmate coordinate work in a visible Codex Desktop thread using Desktop host tools while refusing to pretend Codex Desktop is a normal selectable shell backend.

A thread becomes truly Firstmate-supervised only when its return channel is proven, typically by writing status into the task's Firstmate status file.

### When to reach for it

Load it before creating, reading, steering, archiving, debugging, or reviewing a visible Codex Desktop thread for Firstmate work.

### How it behaves

Firstmate checks that it is actually running in Codex Desktop, verifies the target repository already exists as a saved Desktop project, creates and steers threads through the provided host tools, and keeps the Desktop-owned working directory intact.

If the thread cannot write the expected Firstmate status file, it remains a visible companion thread rather than being represented as a fully supervised backend task.

### Common questions

**Can Firstmate create a missing Codex Desktop project?**
Not through the current host-tool contract.
The human adds the project first.

**Should `FM_BACKEND=codex-app` be invented?**
No.
The skill explicitly rejects that shortcut.

### It's working if

- The visible thread is attached to the intended saved project.
- Repo work stays in the Desktop-owned working directory.
- The status return channel is verified before claiming supervision.
- Archiving preserves durable landed work and transcript history.

### Where it fits

Use it when the value is a visible Desktop-native collaboration surface.
Use a normal verified Firstmate backend when standard terminal supervision is the goal.

**Upstream:** [`.agents/skills/firstmate-codexapp/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/firstmate-codexapp/SKILL.md)

---
