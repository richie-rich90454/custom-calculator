---
title: Equation
description: How to solve polynomial and simultaneous linear equations with the Equation app.
---

# Equation

The **Equation** app (8) solves polynomial equations of degrees 2, 3, and 4,
and simultaneous linear systems of two or three unknowns.

## Opening the app

Open the home menu and select **Equation**. Choose **Polynomial** or
**Simultaneous** in the **Equation mode** selector.

## Polynomial equations

For **Polynomial**, pick the **Polynomial degree** (2, 3, or 4) and enter the
coefficients from the highest power down to the constant term.

Quadratic equations use the exact quadratic formula. Degrees 3 and 4 use a
robust numeric solver that polishes every root and verifies it by
re-substitution; if a root cannot be verified, the app reports an error
rather than a fake value.

Real roots are shown directly. Complex roots are shown with an imaginary
part:

```
x1 = 0 - 1i
x2 = 0 + 1i
```

## Simultaneous equations

For **Simultaneous**, choose **2 unknowns** or **3 unknowns** and enter the
coefficient of each unknown and the constant for every equation.

The app solves the system with Gaussian elimination using partial pivoting.
A singular or under-determined system reports a clear error instead of
guessing.

## Example

```
2x + 3y = 8
 x −  y = 1
```

gives `x1 = 2.2`, `x2 = 1.2`.

## Related documentation

- [Ratio](/user-guide/ratio) solves ratio proportions.
- [Statistics](/user-guide/statistics) fits regressions to data.
- [Table](/user-guide/table) generates tables of function values.
