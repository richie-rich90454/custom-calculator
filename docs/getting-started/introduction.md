---
title: Introduction
description: An overview of the custom scientific calculator, what it does, and the philosophy behind its design.
---

# Introduction

The Scientific Calculator is an expression-based scientific calculator built for the browser. Instead of an old-style button-per-operation keypad model, you build an expression line by line and evaluate it as a whole, the way you would write math on paper.

## What it does

- Evaluates arithmetic, scientific, and symbolic expressions entered as text.
- Renders results using readable math notation.
- Provides a broad catalog of trigonometric, logarithmic, hyperbolic, root, rounding, and arithmetic functions.
- Supports angle modes (degrees, radians, gradians) and numeric modes (standard, exact decimal, fraction, BigInt).
- Offers optional CAS-style symbolic operations: simplify, expand, and differentiate.
- Includes calculus operations: derivatives, integrals, limits, Taylor series, summations, and products.
- Tracks history, user variables, and a classic memory register.
- Stores history and variables persistently in the browser.

## Design philosophy

The calculator treats the expression editor as the center of the experience.

- **Cursor correctness first.** Every button press places the cursor at the logically correct insertion point, so editing feels predictable.
- **Keyboard-first.** All digits, operators, parentheses, and function names can be typed directly. The mouse is never required.
- **Calm and precise.** Interactions are immediate but restrained. No glow effects, no flashy animation.
- **Accessible.** The interface uses accessible primitives, visible focus, and screen reader support.

## A layered architecture

The calculator follows a strict layered architecture where logic and presentation are separated.

| Layer          | Responsibility                                                    |
| -------------- | ----------------------------------------------------------------- |
| Presentation   | React components, React Aria usage, styles, view models           |
| State          | Thin Zustand store mapping UI state to session state              |
| Application    | Commands, the application controller, orchestration               |
| Domain         | Pure TypeScript models and services with no external dependencies |
| Infrastructure | math.js gateway, persistence, feature detection, constant data    |

The rest of this documentation explains each layer in the [developer guide](/developer/architecture-overview).

## Reading this documentation

- [Installation](/getting-started/installation) shows how to run the app.
- [Quick start](/getting-started/quick-start) gets you to a first result fast.
- The [user guide](/user-guide/expression-editing) covers daily usage.
- The [developer guide](/developer/repository-structure) explains the codebase.
