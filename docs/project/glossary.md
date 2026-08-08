---
title: Glossary
description: Definitions of terms used throughout the calculator and its documentation.
---

# Glossary

This glossary defines terms used across the documentation.

## A

**Angle mode** — the unit system applied to trigonometric functions: degrees,
radians, or gradians.

**Application layer** — the architectural layer containing commands, the
application controller, and orchestration.

**Auto-close** — the behavior that appends missing closing parentheses when an
expression is evaluated.

## B

**BigInt** — a JavaScript numeric type for arbitrary-precision integers. BigInt
mode uses it when supported.

**Block** — a structured function call such as `cas(...)` or `derivative(...)`
that routes to a specialized engine.

## C

**CAS** — Computer Algebra System. The symbolic engine that simplifies,
expands, and differentiates expressions.

**Composition root** — the single place where every dependency is constructed
and wired.

**Constant catalog** — the collection of scientific constants grouped by
category.

**Cursor placement** — the rule that places the caret at the logical insertion
point after a button press.

## D

**Domain layer** — the pure TypeScript layer of models and services with no
external dependencies.

## E

**Expression editor** — the primary input where expressions are typed and
edited.

**Expression editing service** — the domain service implementing insertion and
smart deletion.

## F

**Feature detection** — runtime detection of browser capabilities such as
BigInt.

**Focus preservation** — the behavior that keeps the caret visible and correct
when focus moves between the editor and buttons.

## H

**History** — the persistent list of past evaluations.

## I

**Implicit multiplication** — multiplication expressed by adjacency, such as
`2x`.

**Infrastructure layer** — the layer implementing the math.js gateway,
persistence, feature detection, and data modules.

## M

**Memory register** — the classic memory cell with M+, M-, MR, and MC.

## N

**Numeric mode** — the strategy for computing and presenting results:
standard, exact decimal, fraction, or BigInt.

## P

**Presentation layer** — the React layer of components, view models, services,
and styles.

## S

**Session state** — the immutable snapshot passed through commands.

**Smart backspace** — context-aware backward deletion that deletes by group,
token, or character.

**State layer** — the thin Zustand store that adapts UI state to the
application controller.

## T

**Template** — a button insertion that includes placeholders, such as
`derivative(|, x)`.

## V

**Variable** — a named value that can be reused in expressions.

## Related pages

- [About](/project/about)
- [Getting started](/getting-started/introduction)
