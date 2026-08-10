---
title: End-to-End Testing
description: How to run the Playwright end-to-end suite that exercises every app in a real browser.
---

# End-to-End Testing

The calculator ships with a Playwright suite that drives every app through the
real UI in a browser. It complements the unit and component tests by proving
that the instrument works end to end: keycaps render, panels open, apps
compute, and keyboard-only flows stay reachable.

## Prerequisites

Playwright targets your installed Chrome browser, so no browser download is
needed:

```bash
npm install
npm run test:e2e
```

The suite starts the Vite dev server itself (or reuses an already-running one
on port 5173).

## What the suite covers

The specs live in `e2e/` and assert exact visible text and accessible names:

| Spec | Coverage |
| ---- | -------- |
| `smoke.spec.ts` | Evaluate `2+3` through the keypad |
| `layout.spec.ts` | No duplicated keycaps, parenthesis and `Ans` keys present, digit rows aligned |
| `math-rendering.spec.ts` | KaTeX subscripts and radicals, `log` semantics, D-pad history replay |
| `calculate-app.spec.ts` | S-D, ENG, FIX, angle modes, memory, history, CAS, CALC, SOLVE, preview, keyboard-only drive |
| `apps-complex-base-matrix-vector.spec.ts` | Complex, Base-N, Matrix, and Vector apps |
| `apps-statistics-table-equation-ratio.spec.ts` | Statistics, Table, Equation, and Ratio apps |
| `accessibility.spec.ts` | Layer labels, Escape behavior, dialog focus trap, app menu, keyboard activation |

## Rules for new specs

- Drive the visible UI by role and accessible name; never reach into React
  state through the page context.
- Assert exact text (`toHaveText("= 5")`), not truthiness.
- Clear `localStorage` in `beforeEach` so persisted settings and the active
  app never leak between tests.
- Never use `test.skip` or `test.only`.

## Config

`playwright.config.ts` targets Chromium, uses the installed Chrome channel,
and runs the specs fully in parallel. Artifacts land in `test-results/` and
`playwright-report/`, both gitignored.

## Next steps

- [Testing Guide](/developer/testing-guide) covers the unit and component suite.
- [Coverage Policy](/developer/coverage-policy) explains the 100 percent threshold.
