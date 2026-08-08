---
title: Contributing
description: How to contribute to the calculator repository.
---

# Contributing

Thank you for contributing. This page explains the workflow, standards, and expectations for contributions.

## Workflow

1. Read the [architecture overview](/developer/architecture-overview).
2. Read the [code style guide](/developer/code-style-guide).
3. Make your change with focused, one-file-per-commit commits.
4. Follow the [commit policy](/developer/commit-policy).
5. Verify with typecheck, lint, and tests.
6. Open a pull request.

## Verification

Every contribution must pass:

```bash
npm run typecheck
npm run lint
npm run test
```

The test suite enforces 100 percent coverage. See [Coverage policy](/developer/coverage-policy).

## What to include

- A precise American English commit message per file.
- Tests for new behavior.
- Documentation updates when user-visible behavior changes.
- No unrelated changes in the same commit.

## What to avoid

- Introducing `eval` or arbitrary code execution.
- Adding Tailwind.
- Putting logic inside JSX that belongs in a service.
- Breaking the layered dependency direction.

## Areas to extend

- [Adding a function](/developer/adding-a-function)
- [Adding a constant](/developer/adding-a-constant)
- [Adding a panel](/developer/adding-a-panel)
- [Adding a CAS operation](/developer/adding-a-cas-operation)
- [Adding a numeric mode](/developer/adding-a-numeric-mode)

## Next steps

- [Project support](/project/support)
- [License](/project/license)
