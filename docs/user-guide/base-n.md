---
title: Base-N
description: How to work with binary, octal, decimal, and hexadecimal arithmetic in the Base-N app.
---

# Base-N

The **Base-N** app (3) performs integer arithmetic in four number bases:
decimal (DEC), hexadecimal (HEX), binary (BIN), and octal (OCT).

## Opening the app

Open the home menu and select **Base-N**.

## Bases and word size

Choose the input base with the **Number base** selector. Values you type are
interpreted in that base. Results always show in all four bases.

Choose a **Word size** of 8, 16, 32, or 64 bits. Arithmetic wraps to that
width, and negative values use two's-complement representation:

```
Value: 1, word size 32, NEG
DEC: 4294967295
HEX: FFFFFFFF
BIN: 11111111 11111111 11111111 11111111
OCT: 37777777777
```

## Operations

| Operation | Meaning                       |
| --------- | ----------------------------- |
| AND       | bitwise and of A and B        |
| OR        | bitwise or of A and B         |
| XOR       | bitwise exclusive or of A, B  |
| NOT       | bitwise complement of A       |
| NEG       | two's-complement negation of A |
| ADD       | A + B with word-size wrap     |

Word overflow wraps around. For example, `7FFFFFFF + 1` at 32 bits is
`80000000`.

## Example

At 32 bits with HEX input:

```
A = FF, B = 0F
A AND B  ->  HEX: F
A OR B   ->  HEX: FF
```

## BigInt support

Base-N arithmetic uses the JavaScript `BigInt` type. On browsers without
BigInt support the app shows a clear message and disables the controls; it
never crashes.

## Related documentation

- [Complex numbers](/user-guide/complex-numbers) covers complex arithmetic.
- [Matrix](/user-guide/matrix) covers matrix operations.
- [Vector](/user-guide/vector) covers vector operations.
