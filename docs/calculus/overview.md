---
title: Calculus Overview
description: An overview of the calculus operations available in the calculator.
---

# Calculus Overview

The calculator provides a set of calculus operations that work on expressions entered as calculus blocks. Operations are both numeric (approximations) and symbolic.

## Operations

| Operation               | Function name                             | Kind     |
| ----------------------- | ----------------------------------------- | -------- |
| Symbolic derivative     | `derivative(expression, x)`               | Symbolic |
| Numeric derivative      | `numericDerivative(expression, x, point)` | Numeric  |
| Definite integral       | `integral(expression, x, a, b)`           | Numeric  |
| Symbolic antiderivative | `integrate(expression, x)`                | Symbolic |
| Limit                   | `limit(expression, x, target)`            | Numeric  |
| Taylor series           | `taylor(expression, x, center, order)`    | Symbolic |
| Finite summation        | `sum(expression, n, a, b)`                | Numeric  |
| Finite product          | `product(expression, n, a, b)`            | Numeric  |

## Entering calculus blocks

Calculus blocks are entered as function calls, either typed directly or inserted from the calculus control pad.

```
derivative(x^2, x)
integral(x^2, x, 0, 1)
```

## Templates

The calculus control pad inserts blocks as templates with placeholders. The cursor lands on the first placeholder.

```
derivative(|, x)
integral(|, x, a, b)
taylor(|, x, 0, 5)
limit(|, x, 0)
sum(|, n, 1, 10)
product(|, n, 1, 5)
```

Replace the placeholders with your expression and values.

## Symbolic vs numeric

- **Symbolic** operations return exact symbolic results where supported, such as `derivative(x^2, x)` giving `2*x`.
- **Numeric** operations approximate a value, such as `integral(x^2, x, 0, 1)` giving `0.3333333333333333`.

## Angle mode policy

Symbolic calculus operations evaluate trigonometric functions in radians and warn when the active angle mode is not radians. See [Angle mode policy](/calculus/angle-mode-policy).

## Examples

$$
\frac{d}{dx} x^2 = 2x
$$

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

See [Examples](/calculus/examples) for a complete worked set.

## Next steps

- [Derivatives](/calculus/derivatives) covers symbolic differentiation.
- [Integrals](/calculus/integrals) covers numeric integration.
- [Limits](/calculus/limits) covers limit estimation.
