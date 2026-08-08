---
title: CAS Limitations
description: The known limitations of the CAS engine and how to work around them.
---

# CAS Limitations

The CAS engine is enableable and covers a useful subset of symbolic mathematics. This page documents its known limitations.

## Scope

The CAS engine supports simplification, expansion, and symbolic differentiation of common elementary expressions. It is not a full general-purpose computer algebra system.

## Things the CAS engine does not do

- Full integration of arbitrary expressions. For antiderivatives, use the calculus `integrate(...)` operation, which also has limits. See [Symbolic integration](/calculus/symbolic-integration).
- Solving equations or systems of equations.
- Full simplification of special functions.
- Complete normalization of every algebraic form.

## Structure limits

- CAS blocks are recognized at the top level of the expression. A `cas(...)` block nested inside ordinary arithmetic is not routed to the CAS engine.
- The inner expression must be parseable by the symbolic engine.

## Result presentation

Symbolic results are returned as text. The formatter does not simplify arbitrary symbolic expressions into a canonical form.

## When an error occurs

If the CAS engine cannot process an expression, the evaluation reports an error message explaining the failure. See [Troubleshooting](/user-guide/troubleshooting).

## Related pages

- [CAS overview](/cas/overview) describes the supported operations.
- [Calculus overview](/calculus/overview) covers the numeric engine.
