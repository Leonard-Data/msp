# Execution model

An agent system should make the control flow explicit.

## Core loop

1. Observe input
2. Decide next action
3. Execute tool or workflow
4. Validate the result

## Failure modes

- Missing guardrails
- Hidden shared state
- No retry budget
