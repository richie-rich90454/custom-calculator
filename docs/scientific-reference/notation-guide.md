---
title: Notation Guide
description: How mathematical notation is entered and rendered in the calculator.
---

# Notation Guide

This guide explains the notation conventions used when entering expressions and
how results are rendered.

## Entering expressions

Expressions are entered as text using conventional math syntax.

| Notation | You type | Meaning |
| -------- | -------- | ------- |
| Multiplication | `*` | Times |
| Division | `/` | Divided by |
| Exponentiation | `^` | To the power of |
| Parentheses | `( )` | Grouping |
| Factorial | `!` | Factorial |
| Percent | `%` | Percent |

## Function calls

Functions use the `name(argument)` syntax.

```
sin(30)
sqrt(16)
log(100)
```

## Implicit multiplication

Adjacency means multiplication where it is unambiguous.

```
2x       ->  2 * x
3sin(30) ->  3 * sin(30)
```

See [Implicit multiplication](/user-guide/implicit-multiplication).

## Greek letters and symbols

Constants render with their conventional symbols in the display, while the
expression keeps the plain name.

| Constant | Display | Name |
| -------- | ------- | ---- |
| `pi` | π | Pi |
| `tau` | τ | Tau |
| `phi` | φ | Golden ratio |
| `e` | e | Euler's number |
| `gamma` | γ | Euler-Mascheroni constant |

## Scientific notation

Large and small results are rendered in scientific notation when appropriate.

```
6.62607015e-34
```

## Fractions and roots

Results that are rational can be rendered as fractions in fraction mode. Roots
are rendered with radical notation where supported by the formatter.

$$
\sqrt{16} = 4
$$

$$
\frac{1}{3} + \frac{1}{6} = \frac{1}{2}
$$

## Calculus notation

Calculus blocks use named function syntax.

```
derivative(x^2, x)
integral(x^2, x, 0, 1)
limit(sin(x)/x, x, 0)
```

These render conceptually like the textbook forms:

$$
\frac{d}{dx}x^2 = 2x
$$

$$
\int_0^1 x^2 \, dx
$$

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

## Angle units

Trigonometric results depend on the angle mode. See
[Angle modes](/user-guide/angle-modes).

## Next steps

- [Function catalog](/scientific-reference/function-catalog) lists every
  function.
- [Calculus overview](/calculus/overview) covers calculus notation.
