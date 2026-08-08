---
title: CAS Overview
description: An overview of the enableable CAS-style symbolic operations in the calculator.
---

# CAS Overview

The calculator includes an enableable CAS (Computer Algebra System) layer that
performs symbolic manipulation of expressions. CAS is off by default and is
toggled in settings.

## Operations

| Operation | Function name | Description |
| --------- | ------------- | ----------- |
| Simplify | `cas(expression)` | Simplifies a symbolic expression |
| Simplify | `casSimplify(expression)` | Simplifies a symbolic expression |
| Expand | `casExpand(expression)` | Expands products and powers |
| Derivative | `casDerivative(expression[, x])` | Differentiates symbolically |

## Enabling CAS

CAS is a toggle in the settings panel. When enabled, CAS operation keys appear
on the keypad. See [Enabling CAS](/cas/enabling-cas).

## CAS blocks

CAS operations are entered as blocks: `cas(...)`, `casSimplify(...)`,
`casExpand(...)`, or `casDerivative(...)`. See
[CAS block](/cas/cas-block).

## Example

```
cas(x*(x + 1) + x)
```

Simplifies to `x * (x + 2)`.

## Relationship to calculus

The calculus engine and the CAS engine are separate. Calculus covers
derivatives, integrals, limits, and series, some of which are symbolic and
some numeric. CAS covers simplification, expansion, and symbolic
differentiation of arbitrary expressions. See the
[Calculus overview](/calculus/overview).

## Next steps

- [Enabling CAS](/cas/enabling-cas) explains the toggle.
- [Simplify](/cas/simplify) covers simplification.
- [Expand](/cas/expand) covers expansion.
- [Derivative](/cas/derivative) covers symbolic differentiation.
