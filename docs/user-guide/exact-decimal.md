---
title: Exact Decimal
description: How exact decimal mode keeps decimal calculations precise.
---

# Exact Decimal

Exact decimal mode reduces the rounding artifacts of floating-point arithmetic
for decimal-heavy calculations.

## Enabling exact decimal mode

Open the settings panel and choose **Exact decimal** as the numeric mode.

## The classic example

```
0.1 + 0.2
```

In standard floating-point mode this can display as `0.30000000000000004`. In
exact decimal mode the result is presented cleanly:

```
0.3
```

## What exact decimal mode means

- Decimal quantities are carried with higher precision through supported
  operations.
- Results are formatted without visible floating-point artifacts.
- The mode is one of four numeric modes and is persisted across sessions.

## When it does not help

Exact decimal mode cannot make irrational values exact. Expressions such as
`sqrt(2)` still produce an approximation.

```
sqrt(2)  ->  1.4142135623730951
```

## Related documentation

- [Numeric modes](/user-guide/numeric-modes) lists all four modes.
- [Fractions](/user-guide/fractions) explains rational presentation.
