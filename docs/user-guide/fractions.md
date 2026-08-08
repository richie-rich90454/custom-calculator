---
title: Fractions
description: How the calculator presents and handles fraction results in fraction mode.
---

# Fractions

Fraction mode presents rational results as fractions instead of decimal
approximations.

## Enabling fraction mode

Open the settings panel and choose **Fraction** as the numeric mode.

## Example

```
1 / 4
```

In fraction mode the result is presented as a fraction:

$$
\frac{1}{4}
$$

In standard mode the same expression evaluates to `0.25`.

## What fraction mode means

- The calculator uses math.js fraction arithmetic for supported operations.
- Results that have a clean rational form are presented as fractions.
- Irrational or non-rational results fall back to decimal presentation.

## Fractions in expressions

You can also write fractions directly in an expression using division.

```
1/3 + 1/6  ->  1/2
```

In fraction mode this evaluates to `1/2` rather than `0.5`.

## Interaction with other modes

Fractions are one of the four numeric modes. Switching modes re-evaluates with
the new presentation.

## Related documentation

- [Numeric modes](/user-guide/numeric-modes) lists all four modes.
- [Exact decimal](/user-guide/exact-decimal) explains decimal behavior.
