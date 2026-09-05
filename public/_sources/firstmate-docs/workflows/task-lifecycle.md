# Task lifecycle

Most work follows the same loop.

## 1. Intake

Firstmate identifies the project, task type, delivery path, and approval needs.
If the work is only investigation, it becomes a scout task.
If the work should change a project, it becomes a ship task.

## 2. Instructions

Firstmate writes task-specific instructions with the captain's intent and safety constraints.

## 3. Isolated work

A worker uses an isolated local copy so unfinished project work does not pollute the primary copy.

## 4. Validation

The selected delivery path owns validation.
For strict paths, automated review, tests, pull request creation, and CI are handled as one flow.

## 5. Decision or landing

If a decision is needed, Firstmate brings it to the captain.
If work is ready, Firstmate reports the pull request or asks for merge approval when required.

## 6. Cleanup

Cleanup happens only after landing is confirmed or after the captain explicitly discards work.
