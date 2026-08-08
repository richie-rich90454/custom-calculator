---
title: Derivatives
description: How symbolic differentiation works in the calculator.
---

# Derivatives

The symbolic derivative operation differentiates an expression with respect to
a variable.

## Syntax

```
derivative(expression, variable)
```

If the variable is omitted, `x` is used.

## Examples

| Expression | Result |
| ---------- | ------ |
| `derivative(x^2, x)` | `2 * x` |
| `derivative(sin(x), x)` | `cos(x)` |
| `derivative(exp(x), x)` | `exp(x)` |
| `derivative(x^3 + 2*x, x)` | `3 * x^2 + 2` |

## Inserting a derivative block

Press the `d/dx` button on the calculus control pad. The template inserts:

```
derivative(|, x)
```

Type the expression in the first slot. The variable defaults to `x`.

## Rules applied

The symbolic engine applies the standard rules:

- Power rule
- Product rule
- Quotient rule
- Chain rule
- Derivatives of trigonometric, exponential, and logarithmic functions

## Angle mode policy

Symbolic differentiation evaluates trigonometric functions in radians. If the
active angle mode is not radians, a warning is returned. See
[Angle mode policy](/calculus/angle-mode-policy).

## The derivative of a constant

$$
\frac{d}{dx} 5 = 0
$$

```
derivative(5, x)  ->  0
```

## Next steps

- [Numeric derivatives](/calculus/numeric-derivatives) covers approximation.
- [Symbolic integration](/calculus/symbolic-integration) covers
  antiderivatives.
