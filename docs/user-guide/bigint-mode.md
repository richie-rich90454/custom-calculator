---
title: BigInt Mode
description: How BigInt mode works, how the browser supports it, and how the calculator falls back gracefully.
---

# BigInt Mode

BigInt mode enables arbitrary-precision integer arithmetic in the calculator.
It is a numeric mode available in the settings panel.

## What BigInt provides

JavaScript's `BigInt` type represents integers of arbitrary size without the
precision limits of floating-point numbers.

```
2^100
```

In standard mode this is a very large floating-point value. In BigInt mode the
result is the exact integer:

```
1267650600228229401496703205376
```

## Browser support detection

BigInt is not available in every browser and every environment. At startup, the
calculator detects whether `BigInt` is supported.

- If BigInt is supported, the BigInt numeric mode is available.
- If BigInt is not supported, the calculator falls back gracefully to standard
  numeric behavior and does not offer the BigInt mode.

## Fallback flow

The fallback behavior is important: the calculator must never break because a
browser lacks BigInt.

1. Feature detection runs at startup.
2. If BigInt is unavailable, the numeric mode policy excludes BIGINT.
3. The status message reports the detection result.

See [BigInt fallback flow](/architecture/diagrams) for a diagram of this flow.

## Using BigInt mode

1. Open the settings panel.
2. Choose the **BigInt** numeric mode.
3. Evaluate integer expressions.

Results are exact as long as every operation stays within integer arithmetic.

## Related persistence

The selected numeric mode is saved and restored across sessions. If BigInt
becomes unavailable on a later session, the mode policy handles the change
safely.

## Next steps

- [Numeric modes](/user-guide/numeric-modes) lists all modes.
- [Numeric mode policy](/developer/adding-a-numeric-mode) explains the
  implementation.
