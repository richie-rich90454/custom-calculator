---
title: Numeric Modes
description: How standard, exact decimal, fraction, and BigInt numeric modes differ.
---

# Numeric Modes

The numeric mode controls how results are computed and displayed. There are four modes.

| Mode          | Behavior                                                     |
| ------------- | ------------------------------------------------------------ |
| STANDARD      | Floating-point evaluation with the default math.js precision |
| EXACT_DECIMAL | Keeps exact decimal arithmetic where supported               |
| FRACTION      | Presents rational results as fractions                       |
| BIGINT        | Uses integer arithmetic with BigInt when available           |

## Selecting a mode

Open the settings panel and choose the numeric mode. The status bar shows the active mode.

## Standard mode

The default mode. Results are computed in floating point and formatted compactly.

```
10 / 4  ->  2.5
1 / 3   ->  0.3333333333333333
```

## Exact decimal mode

Keeps more precision in decimal-heavy calculations.

```
0.1 + 0.2  ->  0.3
```

## Fraction mode

Presents rational results as fractions when possible.

```
1 / 4  ->  1/4
```

## BigInt mode

Uses arbitrary-precision integer arithmetic when the browser supports BigInt. If BigInt is not supported, the calculator detects this and falls back gracefully to standard numeric behavior.

```
2^100  ->  1267650600228229401496703205376
```

## BigInt feature detection

BigInt support is detected at startup. The status message reports whether BigInt is available. See [BigInt mode](/user-guide/bigint-mode).

## Persistence

The selected numeric mode is saved and restored across sessions.

## Next steps

- [BigInt mode](/user-guide/bigint-mode) explains BigInt in detail.
- [Exact decimal](/user-guide/exact-decimal) explains exact decimal behavior.
- [Fractions](/user-guide/fractions) explains fraction results.
