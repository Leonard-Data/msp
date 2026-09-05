# /project-management

> **Skill type:** Agent-only  
> **Upstream path:** `.agents/skills/project-management/SKILL.md`


**The controlled lifecycle for Firstmate-managed projects.**

### What it does

`project-management` owns adding, cloning, creating, registering, initializing, and removing projects.
It also owns the project's standing delivery posture and autonomy posture.

Before creating a duplicate project in the main home, it checks whether a persistent second mate already owns the natural-language domain.

### When to reach for it

Load it before any project add, clone, create, initialization, registration, or removal operation.

### How it behaves

The skill resolves project name, destination, delivery mode, and autonomy before changing state.

Remote-backed projects get a standing delivery posture such as `no-mistakes`, `direct-PR`, `local-only`, or the conditional `no-mistakes-prod-only`.
New remote-backed projects default to `no-mistakes-prod-only` when the captain has not specified a mode; projects without a remote default to `local-only`.

Creating a GitHub repository is outward-facing and requires explicit consent for repository name, owner, visibility, and delivery posture.
Removing a project is destructive and requires both explicit approval and proof that no unlanded or dependent work would be lost.

### Common questions

**Can the project registry become the project documentation database?**
No.
It stays a concise fleet/navigation registry.

**Does `+yolo` change delivery mode?**
No.
It changes merge authority only.

### It's working if

- Project paths are never overwritten or repurposed.
- Secondmate ownership is respected before a main-home clone is created.
- Remote creation happens only after exact outward consent.
- Removal stops when any unlanded work or dependency is found.

### Where it fits

This skill owns project membership in the Firstmate fleet.
`secondmate-provisioning` separately owns projects cloned inside persistent secondmate homes.

**Upstream:** [`.agents/skills/project-management/SKILL.md`](https://github.com/kunchenguid/firstmate/blob/main/.agents/skills/project-management/SKILL.md)

---
