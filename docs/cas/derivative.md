---
title: Derivative
description: How the CAS symbolic derivative operation works.
---

# Derivative

The CAS derivative operation differentiates a symbolic expression with respect
to a variable.

## Syntax

```
casDerivative(expression)
casDerivative(expression, variable)
```

If the variable is omitted, `x` is used.

## Examples

| Expression | Result |
| ---------- | ------ |
| `casDerivative(x^2)` | `2 * x` |
| `casDerivative(sin(x))` | `cos(x)` |
| `casDerivative(x^3 + 2*x)` | `3 * x^2 + 2` |
| `casDerivative(x*y, y)` | `x` |

## Inserting a derivative block

Press the `derivative` key on the CAS control pad. The template inserts:

```
casDerivative(|)
```

Type the expression inside the parentheses.

## Relationship to calculus

This operation is part of the CAS engine. The calculus engine provides its own
`derivative(...)` operation with a radians-only angle policy. See
[Derivatives](/calculus/derivatives) and
[Angle mode policy](/calculus/angle-mode-policy).

## Related pages

- [CAS overview](/cas/overview) lists all operations.
- [Simplify](/cas/simplify) covers simplification.
