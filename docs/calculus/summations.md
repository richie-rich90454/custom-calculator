---
title: Summations
description: How finite summations work in the calculator.
---

# Summations

The finite summation operation adds the value of an expression over an integer
range.

## Syntax

```
sum(expression, variable, lowerBound, upperBound)
```

## Example

$$
\sum_{n=1}^{10} n = 55
$$

```
sum(n, n, 1, 10)
```

The result is `55`.

## Another example

$$
\sum_{n=0}^{5} n^2 = 55
$$

```
sum(n^2, n, 0, 5)
```

## Inserting a summation block

Press the `Σ` button on the calculus control pad. The template inserts:

```
sum(|, n, 1, 10)
```

Replace the expression, the summation variable, and the bounds.

## Bounds

- The lower and upper bounds must be numbers.
- The summation variable is the index, and it must not collide with other
  names in the expression.

## Related pages

- [Products](/calculus/products) covers finite products.
- [Limits](/calculus/limits) covers limit estimation.
