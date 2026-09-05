# Commands

This page lists common Firstmate-related commands by purpose.
Run each command's help or read its script header before first use.

## Session and fleet

```bash
bin/fm-session-start.sh
bin/fm-fleet-sync.sh <project>
bin/fm-fleet-view.sh
```

## Project mode

```bash
bin/fm-project-mode.sh <project>
```

## Workers

```bash
bin/fm-spawn.sh ...
bin/fm-send.sh <task-id> <message>
bin/fm-control.sh <task-id> interrupt
bin/fm-crew-state.sh <task-id>
```

## Pull requests and landing

```bash
bin/fm-pr-check.sh <task-id> <pr-url>
bin/fm-pr-merge.sh <task-id>
bin/fm-merge-local.sh <task-id>
```

## MSP Portal

```bash
npm run validate:sources
npm run build
npm run sync
```
