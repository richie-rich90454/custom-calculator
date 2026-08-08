---
title: Simplify
description: How the CAS simplify operation works.
---

# Simplify

The simplify operation reduces a symbolic expression to a simpler equivalent
form.

## Syntax

```
cas(expression)
casSimplify(expression)
```

Both forms perform the same operation.

## Examples

| Expression | Simplified result |
| ---------- | ----------------- |
| `cas(x*(x + 1) + x)` | `x * (x + 2)` |
| `cas(2*x + 3*x)` | `5 * x` |
| `cas((x + 1)^2 - x^2 - 1)` | `2 * x` |
| `cas(sin(x)^2 + cos(x)^2)` | `1` |

## What simplification does

- Combines like terms.
- Applies algebraic identities.
- Reduces fractions and coefficients where possible.

## Inserting a simplify block

Press the `cas` or `simplify` key on the CAS control pad. The template
inserts:

```
cas(|)
casSimplify(|)
```

Type the expression inside the parentheses.

## Related pages

- [Expand](/cas/expand) covers expansion.
- [CAS overview](/cas/overview) lists all operations.
