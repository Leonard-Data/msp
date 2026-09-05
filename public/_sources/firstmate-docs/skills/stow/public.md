# Public installer-facing `stow`

> **Skill type:** Installer-facing public skill  
> **Upstream path:** `skills/stow/SKILL.md`


The repository also ships a separate public `skills/stow/SKILL.md`.
It is intentionally independent from the Firstmate-internal version.

The public skill performs the same broad job - capture durable knowledge before a reset - but it cannot assume a Firstmate home, Firstmate scripts, Firstmate data files, or internal ownership rules.
It discovers the host project's existing memory conventions, follows explicit user routing instructions, and otherwise falls back to a private `.stow-notes.md` in the current directory.

Its key safety rule is local-first routing.
It does not infer that an external issue tracker should be used merely because one appears to exist.

**Public upstream:** [`skills/stow/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/skills/stow/SKILL.md)

---
