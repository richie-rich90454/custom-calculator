---
title: Scientific Calculator Docs
description: Documentation hub for a custom expression-based scientific calculator with calculus, CAS, keyboard-first editing, and professional math notation.
---

# Scientific Calculator

A production-minded, expression-based scientific calculator built for the web.
It combines a multi-line expression editor with a broad scientific function
set, calculus operations, enableable CAS-style symbolic math, and full keyboard
navigation.

The calculator is designed as a calm, precise scientific instrument: it feels
fast when you type, keeps the cursor exactly where you expect it, and renders
math the way a textbook does.

## Quick actions

- [Get started](/getting-started/introduction) — learn what the calculator does
- [User guide](/user-guide/expression-editing) — learn how to use it
- [Developer guide](/developer/repository-structure) — learn how it is built

## Feature highlights

- **Expression-based entry** — build expressions with full cursor editing,
  selection, and context-aware smart delete.
- **Keyboard-first operation** — type digits, operators, and function names
  directly; the keypad never requires a mouse.
- **Calculus support** — derivatives, numeric derivatives, integrals,
  antiderivatives, limits, Taylor series, summations, and products.
- **CAS support** — enableable symbolic operations: simplify, expand, and
  differentiate.
- **Professional math notation** — fractions, radicals, Greek letters, and
  scientific notation rendered as readable math.
- **Physics and chemistry constants** — a catalog covering mathematics,
  universal physics, atomic and particle data, and chemistry.
- **Numeric modes** — standard, exact decimal, fraction, and BigInt modes with
  browser feature detection and graceful fallback.
- **Angle modes** — degrees, radians, and gradians with a consistent calculus
  angle policy.
- **Accessible design** — React Aria primitives, visible focus, and screen
  reader support.
- **Original high-quality UI** — a layered, themeable design system in light,
  dark, and system themes.

## A quick taste

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\frac{d}{dx} x^2 = 2x
$$

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

## Where to go next

| You want to... | Start here |
| -------------- | ---------- |
| Install and run the calculator | [Installation](/getting-started/installation) |
| Enter your first expression | [First calculation](/getting-started/first-calculation) |
| Understand expression editing | [Expression editing](/user-guide/expression-editing) |
| Browse every supported function | [Function catalog](/scientific-reference/function-catalog) |
| Learn about calculus operations | [Calculus overview](/calculus/overview) |
| Use the CAS engine | [CAS overview](/cas/overview) |
| Understand the codebase | [Repository structure](/developer/repository-structure) |
