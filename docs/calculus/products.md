---
title: Products
description: How finite products work in the calculator.
---

# Products

The finite product operation multiplies the value of an expression over an
integer range.

## Syntax

```
product(expression, variable, lowerBound, upperBound)
```

## Example

$$
\prod_{n=1}^{5} n = 120
$$

```
product(n, n, 1, 5)
```

The result is `120`.

## Another example

$$
\prod_{n=1}^{4} 2n = 384
$$

```
product(2*n, n, 1, 4)
```

## Inserting a product block

Press the `∏` button on the calculus control pad. The template inserts:

```
product(|, n, 1, 5)
```

Replace the expression, the product variable, and the bounds.

## Related pages

- [Summations](/calculus/summations) covers finite sums.
- [Overview](/calculus/overview) lists all calculus operations.
