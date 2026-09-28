---
title: Code Style Guide
description: The formatting, linting, and coding standards of the repository.
---

# Code Style Guide

The repository uses oxfmt and ESLint to enforce a consistent style. Rules are configured in `.oxfmtrc.json` and `eslint.config.js`.

## Commands

```bash
npm run format:check
npm run lint
npm run typecheck
```

## Formatting

The repository is formatted exclusively with oxfmt, which covers TypeScript, TSX, JavaScript, JSON, CSS, HTML, and Markdown.

The oxfmt configuration is:

- Semicolons: on
- Quotes: double
- Trailing commas: all
- Print width: 100
- Tab width: 4
- Prose wrap: never

Format a single file or the whole repository:

```bash
npx oxfmt --write <file>
npm run format
```

Check formatting without writing:

```bash
npm run format:check
```

## ESLint

ESLint applies the recommended sets for:

- JavaScript
- TypeScript
- React
- React Hooks
- JSX accessibility (jsx-a11y)

Notable overrides:

- `react/react-in-jsx-scope` is off (React 19 JSX transform).
- `react/prop-types` is off (TypeScript types are used).
- Unused variables with an underscore prefix are allowed.

## TypeScript strictness

`tsconfig.json` enables strict mode plus:

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `noUnusedLocals` and `noUnusedParameters`
- `forceConsistentCasingInFileNames`

## General rules

- Java-flavored TypeScript: long explicit names, interfaces, abstract classes, concrete default implementations.
- No comments unless the "why" is non-obvious.
- No `eval`, no `new Function`, no arbitrary code execution.
- No Tailwind.
- Logic lives in `.ts` services, not inside JSX.

## Next steps

- [Naming conventions](/developer/naming-conventions)
- [Commit policy](/developer/commit-policy)
