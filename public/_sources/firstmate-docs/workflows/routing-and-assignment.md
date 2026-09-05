# Routing and assignment

Routing is how Firstmate turns a captain request into the right project, worker, scout, or second mate.

## 1. Resolve the project

Firstmate checks the request against:

- the named project, if the captain gave one
- the project registry
- work already under way
- source code or README clues
- second mate scopes

If exactly one project fits, Firstmate names it and proceeds.
If more than one project fits, Firstmate asks for the missing choice.

## 2. Choose the work type

Firstmate chooses the smallest safe type of work:

- use a **worker** when the change should ship
- use a **scout** when investigation could change what should be built
- use a **second mate** when a persistent delegated domain owns the work
- answer directly when existing evidence already resolves the question

## 3. Choose the delivery path

The project's standing posture sets the default rigor.
Product-facing or uncertain work gets stricter validation.
Internal-only documentation, tooling, or operator process can often use the faster path when the project allows it.

## 4. Assign the work

A worker receives task-specific instructions with:

- captain intent
- project context
- expected done state
- validation requirements
- safety boundaries

The worker should not need to infer the captain's goal from chat history.

## 5. Supervise and report

Firstmate supervises the assignment and reports only useful outcomes:

- review-ready pull request
- decision needed
- blocker
- failure
- finished result

Routine waiting and internal retries should stay quiet.

Related pages: [Task lifecycle](task-lifecycle.md), [Multi-project operations](../concepts/multi-project-operations.md), [Working well with Firstmate](../guides/working-with-firstmate.md).
