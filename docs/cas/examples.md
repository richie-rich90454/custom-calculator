---
title: CAS Examples
description: Worked examples for every CAS operation.
---

# CAS Examples

This page collects worked examples for the CAS operations.

## Simplification

```
cas(x*(x + 1) + x)        ->  x * (x + 2)
cas(2*x + 3*x)            ->  5 * x
cas(sin(x)^2 + cos(x)^2)  ->  1
```

## Expansion

```
casExpand((x + 1)^2)      ->  x^2 + 2*x + 1
casExpand(x*(y + z))      ->  x*y + x*z
casExpand((x - 1)*(x + 1)) ->  x^2 - 1
```

## Derivative

```
casDerivative(x^2)        ->  2 * x
casDerivative(sin(x))     ->  cos(x)
casDerivative(x^3 + 2*x)  ->  3 * x^2 + 2
casDerivative(x*y, y)     ->  x
```

## Combining CAS with ordinary evaluation

The CAS result is presented as the evaluation result:

```
2 * cas(x + x)  ->  2 * (2 * x)
```

## Related pages

- [CAS overview](/cas/overview) lists all operations.
- [Limitations](/cas/limitations) explains the boundaries.
