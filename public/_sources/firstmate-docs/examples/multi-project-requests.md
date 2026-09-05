# Multi-project request examples

These examples show how to ask Firstmate for cross-repository work without micromanaging the internals.

## Add a documentation source to MSP

Captain says:

```text
Create private repo Leonard-Data/firstmate-docs from the MSP template and register it with MSP.
```

Firstmate does:

1. creates the private source repository
2. seeds the documentation structure
3. pushes the source content
4. updates MSP Portal `sources.yml`
5. runs source validation and build checks
6. opens the MSP registration pull request

Why this is multi-project: the source repo owns the docs, while MSP owns the portal registration and generated output.

## Split investigation from implementation

Captain says:

```text
Find why the portal search misses new docs pages. If the fix is obvious, tell me what it is before changing code.
```

Firstmate should assign a scout first because the cause may be source metadata, sync, search indexing, or generated routing.
After the report, the captain can approve implementation in the correct repository.

## Assign domain work to a second mate

Captain says:

```text
Have the Power Platform second mate update the component standards docs and bring me the PR.
```

Firstmate should route the task to the second mate whose charter covers Power Platform.
The second mate handles its own project copy and returns the outcome through the parent channel.

## Parallel independent changes

Captain says:

```text
Update Firstmate setup docs and fix the MSP homepage copy.
```

Firstmate can split this into two workers when the files and outcomes are independent:

- one worker changes the docs source
- one worker changes MSP Portal copy

Firstmate still reports the results together when the work reaches review.

Related pages: [Routing and assignment](../workflows/routing-and-assignment.md), [Multi-project operations](../concepts/multi-project-operations.md).
