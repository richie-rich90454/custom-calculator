---
title: Limits
description: How limit estimation works, including one-sided limits.
---

# Limits

The limit operation estimates the limit of an expression as a variable
approaches a target value.

## Syntax

```
limit(expression, variable, target)
```

Optionally, a fourth argument selects the direction: `left` or `right`. Without
a direction, a two-sided limit is estimated.

## Examples

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

```
limit(sin(x)/x, x, 0)
```

The result is close to `1`.

## One-sided limits

```
limit(1/x, x, 0, right)   ->  ∞
limit(1/x, x, 0, left)    ->  -∞
```

## Inserting a limit block

Press the `lim` button on the calculus control pad. The template inserts:

```
limit(|, x, 0)
```

Replace the expression and the target.

## Infinite results

When the estimated limit grows without bound, the result is reported as `∞`
or `-∞`.

## Related pages

- [Numeric derivatives](/calculus/numeric-derivatives) uses a related
  estimation technique.
- [Angle mode policy](/calculus/angle-mode-policy) covers angle handling.
