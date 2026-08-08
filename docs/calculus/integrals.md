---
title: Integrals
description: How definite integrals are computed numerically.
---

# Integrals

The definite integral operation approximates the integral of an expression
between two bounds.

## Syntax

```
integral(expression, variable, lowerBound, upperBound)
```

## Example

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

```
integral(x^2, x, 0, 1)
```

The result is `0.3333333333333333`.

## Inserting an integral block

Press the `∫` button on the calculus control pad. The template inserts:

```
integral(|, x, a, b)
```

Replace the expression, the lower bound `a`, and the upper bound `b`.

## How it works

The numeric integration uses an adaptive numerical method to approximate the
definite integral. Accuracy depends on the smoothness of the function over the
interval.

## Common integrals

$$
\int_0^{\pi} \sin(x) \, dx = 2
$$

$$
\int_1^2 \frac{1}{x} \, dx = \ln 2
$$

## Related pages

- [Symbolic integration](/calculus/symbolic-integration) covers
  antiderivatives.
- [Angle mode policy](/calculus/angle-mode-policy) covers angle handling.
