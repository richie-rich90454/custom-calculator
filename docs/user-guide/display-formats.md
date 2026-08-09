---
title: Display Formats
description: How to switch between fraction, decimal, engineering, fixed, and scientific display of results.
---

# Display Formats

The calculator offers several ways to display a result. The S-D, ENG, and
FIX/SCI keys let you convert the current result between exact and approximate
forms.

## Standard display

By default results appear in standard form: fractions when they are clean, or
a decimal otherwise.

```
0.5   ->  1/2
1/3   ->  0.3333333333333
```

## S-D conversion

Press **S-D** to cycle a result between its fraction and decimal forms.

| Expression | S-D once | S-D again |
| ---------- | -------- | --------- |
| `0.5`      | `1/2`    | `0.5`     |
| `0.75`     | `3/4`    | `0.75`    |
| `sqrt(2)`  | stays decimal | stays decimal |

An irrational result such as `sqrt(2)` has no exact fraction, so S-D keeps the
decimal and shows a leading approximate symbol:

```
≈ 1.4142135623731
```

The approximate symbol tells you the displayed value is a numerical
approximation, not an exact result. Exact conversions such as `0.5 -> 1/2`
never show it.

## Engineering notation

Press **ENG** to reformat the current result in engineering notation, where
the exponent is always a multiple of three.

```
12345  ->  12.345×10^3
```

Pressing **ENG** again restores the standard decimal form.

## FIX and SCI

Open the **Display Format** menu from OPTN to pick:

- **Standard** — the default behavior.
- **Fix decimal places** — fixed number of decimal places, for example `π`
  with 4 places becomes `3.1416`.
- **Significant figures** — fixed number of significant digits.

Choose the digit count with the digits selector. The new format applies to the
current result immediately.

## Pretty expression preview

The display includes a preview row that renders the current expression as
typeset mathematics. The preview updates as you type and mirrors exactly what
you have written.

You can turn the preview on or off from the OPTN **Display Format** tab with
the **Preview** toggle.

## Related documentation

- [Fractions](/user-guide/fractions) explains fraction mode.
- [Numeric modes](/user-guide/numeric-modes) lists all numeric presentation modes.
- [History](/user-guide/history) covers replaying previous results.
