---
title: Angle Mode Policy
description: How the calculus engine handles angle modes for symbolic and numeric operations.
---

# Angle Mode Policy

Calculus operations handle angle modes with a deliberate policy, because angle
units strongly affect both symbolic and numeric results.

## Two policies

The calculus engine supports two policies.

| Policy | Behavior |
| ------ | -------- |
| `RADIANS_ONLY` | Symbolic operations evaluate trigonometric functions in radians |
| `ANGLE_MODE_AWARE` | Operations convert according to the active angle mode |

## Symbolic operations

Symbolic operations (derivative, antiderivative, and Taylor series) use the
`RADIANS_ONLY` policy. The symbolic engine always differentiates and expands
trigonometric functions in radians so that no spurious conversion factor leaks
into the result.

When the active angle mode is not radians, a warning is returned alongside the
result:

```
Symbolic calculus uses radians in RADIANS_ONLY mode. The current angle mode is
not applied to symbolic results.
```

## Numeric operations

Numeric operations (numeric derivative, definite integral, limit, summation,
and product) use the active angle mode. The numeric engine converts
trigonometric arguments according to the current mode so that numeric
approximations match what a user expects from the active mode.

## Why the distinction

- A symbolic derivative such as `d/dx sin(x)` has a unique, mode-independent
  answer: `cos(x)`. Injecting an angle conversion would corrupt the algebra.
- A numeric definite integral involving `sin` depends entirely on the units.
  The active mode is the correct interpretation.

## Conversion factors

| Angle mode | Radians conversion factor |
| ---------- | ------------------------- |
| DEG | `pi / 180` |
| GON | `pi / 200` |
| RAD | `1` |

## Related pages

- [Angle modes](/user-guide/angle-modes) explains the user-facing modes.
- [Calculus overview](/calculus/overview) lists all operations.
