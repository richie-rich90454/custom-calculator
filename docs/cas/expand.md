---
title: Expand
description: How the CAS expand operation works.
---

# Expand

The expand operation distributes products and powers into a sum of terms.

## Syntax

```
casExpand(expression)
```

## Examples

| Expression | Expanded result |
| ---------- | --------------- |
| `casExpand((x + 1)^2)` | `x^2 + 2*x + 1` |
| `casExpand(x*(y + z))` | `x*y + x*z` |
| `casExpand((x - 1)*(x + 1))` | `x^2 - 1` |

## What expansion does

- Distributes multiplication over addition.
- Expands powers of binomials.
- Removes nested products.

## Inserting an expand block

Press the `expand` key on the CAS control pad. The template inserts:

```
casExpand(|)
```

Type the expression inside the parentheses.

## Related pages

- [Simplify](/cas/simplify) covers simplification.
- [CAS overview](/cas/overview) lists all operations.
