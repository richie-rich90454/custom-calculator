---
title: Testing Guide
description: How the calculator is tested and how to write tests that match the conventions.
---

# Testing Guide

The calculator is tested with Vitest and Testing Library. The test suite runs with strict 100 percent coverage thresholds across statements, branches, functions, and lines.

## Commands

```bash
npm run test          # run all tests
npm run test:watch    # watch mode
```

## Test structure

Tests live next to the code they cover, named with a `.test.ts` or `.test.tsx` suffix. Vitest is configured in `vite.config.ts` to include `src/**/*.test.{ts,tsx}`.

## The harness

Integration tests render components through the calculator test harness:

```tsx
const harness = createCalculatorTestHarness();
renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);
```

The harness builds a real composition root, bootstrap, and store. See `src/test/calculatorTestHarness.tsx`.

## Domain tests

Domain services are pure and tested directly:

```ts
const service = new DefaultExpressionEditingService(catalog);
const edit = service.deleteBackward("2+sin(", 6, 6);
expect(edit.text).toBe("2+");
```

## Component tests

Component tests use Testing Library and `userEvent`:

```tsx
const user = userEvent.setup();
await user.click(screen.getByRole("button", { name: "Sine function" }));
expect(harness.store.getState().expressionText).toBe("sin(");
```

## Property tests

Some domain services are covered with `fast-check` property tests, asserting invariants hold across many random inputs.

## Coverage policy

The project enforces 100 percent coverage. Every new branch must be covered. See [Coverage policy](/developer/coverage-policy).

## Accessibility testing

Tests assert accessible names and roles so the interface stays usable. See [Accessibility guide](/developer/accessibility-guide).

## End-to-end testing

Beyond the unit suite, a Playwright suite drives every app through the real browser. See [End-to-end testing](/developer/e2e-testing).

## Next steps

- [Coverage policy](/developer/coverage-policy)
- [Commit policy](/developer/commit-policy)
