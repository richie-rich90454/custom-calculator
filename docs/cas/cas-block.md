---
title: CAS Block
description: The syntax and behavior of cas(...) blocks.
---

# CAS Block

CAS operations are entered as blocks using the `cas(...)` function syntax. This page explains the block forms and how they evaluate.

## Block forms

| Form                             | Operation                  |
| -------------------------------- | -------------------------- |
| `cas(expression)`                | Simplify the expression    |
| `casSimplify(expression)`        | Simplify the expression    |
| `casExpand(expression)`          | Expand the expression      |
| `casDerivative(expression[, x])` | Differentiate symbolically |

## Inserting a block

With CAS enabled, press a CAS key on the CAS control pad. The block is inserted with the cursor at the first editable position.

```
cas(|)
casSimplify(|)
casExpand(|)
casDerivative(|)
```

## Evaluation

A `cas(...)` block is recognized at the top level of the expression. The block is parsed, routed to the CAS engine, and replaced by its symbolic result.

```
cas(x*(x + 1) + x)  ->  x * (x + 2)
```

## Nesting

CAS blocks are single blocks at the top level. The inner expression may contain ordinary arithmetic and function calls.

## Next steps

- [Simplify](/cas/simplify) covers simplification.
- [Expand](/cas/expand) covers expansion.
- [Derivative](/cas/derivative) covers symbolic differentiation.
