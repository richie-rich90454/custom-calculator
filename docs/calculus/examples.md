---
title: Calculus Examples
description: A worked set of calculus examples with expected results.
---

# Calculus Examples

This page collects worked examples for every calculus operation.

## Derivative

$$
\frac{d}{dx} x^2 = 2x
$$

```
derivative(x^2, x)          ->  2 * x
derivative(sin(x), x)       ->  cos(x)
derivative(exp(x), x)       ->  exp(x)
```

## Numeric derivative

$$
\left. \frac{d}{dx} x^2 \right|_{x=3} = 6
$$

```
numericDerivative(x^2, x, 3)  ->  approximately 6
```

## Definite integral

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\int_0^{\pi} \sin(x) \, dx = 2
$$

```
integral(x^2, x, 0, 1)        ->  0.3333333333333333
integral(sin(x), x, 0, pi)    ->  approximately 2
```

## Antiderivative

$$
\int x^2 \, dx = \frac{x^3}{3}
$$

```
integrate(x^2, x)             ->  x^3 / 3
integrate(1/x, x)             ->  ln(x)
```

## Limit

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

```
limit(sin(x)/x, x, 0)         ->  approximately 1
limit(1/x, x, 0, right)       ->  ∞
```

## Taylor series

$$
\sin(x) \approx x - \frac{x^3}{6} + \frac{x^5}{120}
$$

```
taylor(sin(x), x, 0, 5)
```

## Summation

$$
\sum_{n=1}^{10} n = 55
$$

$$
\sum_{n=0}^{5} n^2 = 55
$$

```
sum(n, n, 1, 10)              ->  55
sum(n^2, n, 0, 5)             ->  55
```

## Product

$$
\prod_{n=1}^{5} n = 120
$$

```
product(n, n, 1, 5)           ->  120
```

## Combining operations

Operations can be combined with ordinary arithmetic:

```
2 * integral(x^2, x, 0, 1) + derivative(x^3, x)
```

## Next steps

- [Overview](/calculus/overview) lists every operation.
- [Angle mode policy](/calculus/angle-mode-policy) explains angle handling.
