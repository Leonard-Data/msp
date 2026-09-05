# Scripts

Scripts are the guarded hands of Firstmate.
They perform state-changing operations with checks that are easy to forget in chat.

## Script philosophy

Prefer one guarded script over five remembered shell commands.
A script can validate inputs, refuse unsafe states, and leave useful evidence.

## Common script families

- session start and supervision
- spawning and steering workers
- backlog transitions
- project mode and registry lookup
- fleet sync
- pull request checks and merges
- local cleanup

## Operating rule

Read a script's header before first use.
The header owns exact arguments, state files, and refusal behavior.
