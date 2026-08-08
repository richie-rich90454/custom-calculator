---
title: Numeric Derivatives
description: How numeric derivative approximation works at a point.
---

# Numeric Derivatives

The numeric derivative operation approximates the derivative of an expression at a specific point.

## Syntax

```
numericDerivative(expression, variable, point)
```

The point is required and must be a number.

## Example

Approximating the derivative of `x^2` at `x = 3`:

```
numericDerivative(x^2, x, 3)
```

The exact value is `6`; the numeric result is an approximation close to `6`.

## How it works

The numeric derivative uses a finite-difference approximation of the derivative at the given point. The smaller the function is near the point, the more accurate the estimate.

## Inserting a numeric derivative block

Press the `d/dx|` button on the calculus control pad. The template inserts:

```
numericDerivative(|, x, )
```

Replace the expression and the point.

## Angle modes

Because numeric differentiation is extremely sensitive to angle units, the numeric service respects the active angle mode consistently with other numeric calculus operations. See [Angle mode policy](/calculus/angle-mode-policy).

## Related pages

- [Derivatives](/calculus/derivatives) covers symbolic differentiation.
- [Limits](/calculus/limits) covers limit estimation, a related technique.
