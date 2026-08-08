---
title: Commit Policy
description: The commit conventions used in this repository.
---

# Commit Policy

The repository follows a strict one-file-per-commit policy with imperative
American English commit messages.

## One file per commit

- Each commit contains exactly one file.
- No batch commits such as `add docs` or `update UX`.
- Committing one file at a time keeps history precise and reviewable.

## Message style

Commit messages use the conventional commit prefix and an imperative American
English summary.

| Prefix | Use for |
| ------ | ------- |
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation |
| `test:` | Tests |
| `refactor:` | Code restructuring without behavior change |
| `style:` | Formatting and non-functional changes |
| `chore:` | Tooling and maintenance |

## Examples

```
docs: add expression editing guide page
fix: place cursor after opening parenthesis when inserting function
feat: add expression cursor placement service
test: add cursor placement tests for scientific function buttons
refactor: extract button insertion template service
```

## American English

All commit messages use American English spellings: `behavior`, `color`,
`customize`, `initialize`, `organization`, `license`.

## Verification before commit

- Format the file (Prettier).
- Run the relevant tests.
- Run lint and typecheck.

```bash
npm run typecheck
npm run lint
npm run test
```

## Next steps

- [Code style guide](/developer/code-style-guide)
- [Contributing](/developer/contributing)
