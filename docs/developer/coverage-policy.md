---
title: Coverage Policy
description: The coverage requirements of the repository and how they are enforced.
---

# Coverage Policy

The repository enforces strict code coverage. No new code lands without full coverage of the paths it introduces.

## Thresholds

Vitest is configured with the following thresholds in `vite.config.ts`:

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 100%      |
| Branches   | 100%      |
| Functions  | 100%      |
| Lines      | 100%      |

## What is excluded

The coverage report excludes:

- `src/main.tsx` — the application entry point.
- Test files themselves.
- The test setup directory.

## Practical implications

- Every branch of an `if` must be exercised.
- Every function must be called.
- Every line must be reached.

This keeps logic honest: dead branches and unreachable code cannot hide.

## Tips

- Write the test together with the behavior.
- Cover the happy path and the edge cases.
- For pure domain services, direct unit tests are fast and complete.
- For components, use the harness and `userEvent`.

## Coverage reporting

Run coverage to inspect the report:

```bash
npm run test
```

Coverage is computed with the v8 provider and printed after the run.

## Next steps

- [Testing guide](/developer/testing-guide)
- [Code style guide](/developer/code-style-guide)
