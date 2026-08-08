---
title: Operator Precedence
description: How the calculator orders operators when evaluating an expression.
---

# Operator Precedence

The calculator follows the standard math.js operator precedence, which matches
the conventional order taught in mathematics.

## Precedence table

Operators are evaluated in this order, from highest to lowest priority.

| Priority | Operators | Notes |
| -------- | --------- | ----- |
| Highest | `^` | Exponentiation, right associative |
| | `!` | Factorial (postfix) |
| | `*` `/` | Multiplication and division |
| | `+` `-` | Addition and subtraction |
| Lowest | `,` | Argument separator |

Parentheses always override the default order.

## Example

```
2 + 3 * 4
```

Multiplication binds tighter than addition, so this evaluates to `14`, not
`20`.

## Right-associative exponentiation

Exponentiation is right associative.

```
2^3^2  ->  2^(3^2)  ->  512
```

## Using parentheses

Use parentheses when the default order is not what you intend.

| Expression | Value |
| ---------- | ----- |
| `2 + 3 * 4` | `14` |
| `(2 + 3) * 4` | `20` |
| `10 - 2 - 3` | `5` |
| `10 - (2 - 3)` | `11` |

## Unary minus

A leading minus sign is treated as a unary operator.

```
-5 + 3  ->  -2
```

## Factorial and percent

`!` is a postfix factorial, and `%` is a percent operator.

```
5!        ->  120
50% * 200 ->  100
```

## Argument separator

A comma separates arguments inside a function call.

```
max(2, 5, 3)  ->  5
```

## Next steps

- [Parentheses](/user-guide/parentheses) explains grouping.
- [Implicit multiplication](/user-guide/implicit-multiplication) explains
  adjacency multiplication.
