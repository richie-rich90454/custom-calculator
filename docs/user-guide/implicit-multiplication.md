---
title: Implicit Multiplication
description: How implicit multiplication works, what it applies to, and how it affects parsing.
---

# Implicit Multiplication

Implicit multiplication lets you write `2x` instead of `2*x`, and `3 sin(30)`
instead of `3*sin(30)`. The math.js engine behind the calculator supports this
convention.

## Examples

| Written | Meaning |
| ------- | ------- |
| `2x` | `2 * x` |
| `3sin(30)` | `3 * sin(30)` |
| `2(x+1)` | `2 * (x+1)` |
| `(x+1)(x-1)` | `(x+1) * (x-1)` |
| `2pi` | `2 * pi` |

## Behavior notes

Implicit multiplication follows the standard math.js precedence rules. In
ambiguous cases, the explicit `*` operator is the safest choice.

```
1/2x
```

This is parsed as `1 / (2x)` by the implicit multiplication rules, so `2x` is
treated as a single factor. If you mean `(1/2)*x`, write `(1/2)*x` explicitly.

## When to use explicit multiplication

Use an explicit `*` when:

- You want to be unambiguous about grouping.
- You are multiplying numbers where adjacency is not meaningful: `2 3` is
  invalid, but `2*3` works.
- The operand is a standalone number followed by another number.

## Implicit multiplication with constants

Constants such as `pi`, `e`, and `speedOfLight` participate in implicit
multiplication.

```
2pi        ->  2 * pi
3speedOfLight  ->  3 * speedOfLight
```

## Relation to function calls

Implicit multiplication between a number and a function call is supported.

```
2sin(30)   ->  2 * sin(30)
```

## Next steps

- [Operator precedence](/user-guide/operator-precedence) explains how
  operators are ordered.
- [Constants](/user-guide/constants) lists available constants.
