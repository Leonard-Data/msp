# Troubleshooting

## Repo creation from template fails

If GitHub says the source is not a template repository, create the destination repository normally and seed it from the local template copy.
The file structure is the important contract for MSP Portal.

## MSP cannot sync a source

Check:

- the source repo exists and is accessible to the build token
- `.docs-source.yml` exists at the repository root
- `docs_path` points to an existing directory
- `sources.yml` has the correct `repo` and `defaultBranch`

## A worker appears stuck

Do not guess from silence.
Use the current-state path for the worker, then recover through the guarded recovery procedure.

## A pull request is ready but not merged

Check whether the project has standing merge autonomy.
If not, the captain must approve the merge explicitly.
