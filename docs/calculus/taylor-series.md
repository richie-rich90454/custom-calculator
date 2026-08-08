---
title: Taylor Series
description: How Taylor series expansion works in the calculator.
---

# Taylor Series

The Taylor series operation expands an expression into a truncated Taylor
series about a center point.

## Syntax

```
taylor(expression, variable, center, order)
```

## Example

Expanding `sin(x)` about `0` to order `5`:

```
taylor(sin(x), x, 0, 5)
```

The result is the truncated series:

$$
x - \frac{x^3}{6} + \frac{x^5}{120}
$$

## Inserting a Taylor block

Press the `Tₙ` button on the calculus control pad. The template inserts:

```
taylor(|, x, 0, 5)
```

Replace the expression, the center, and the order.

## Parameters

- **center** — the point about which the function is expanded.
- **order** — the highest power included in the truncated series. It must be
  an integer.

## Example result

The exponential function about zero:

```
taylor(exp(x), x, 0, 4)
```

$$
1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \frac{x^4}{24}
$$

## Angle mode policy

Symbolic expansion evaluates trigonometric functions in radians and warns when
the angle mode is not radians. See [Angle mode policy](/calculus/angle-mode-policy).

## Related pages

- [Derivatives](/calculus/derivatives) uses the same symbolic engine.
- [Summations](/calculus/summations) covers finite series.
