---
title: Statistics
description: How to use the Statistics app for one-variable summaries and least-squares regression.
---

# Statistics

The **Statistics** app (6) computes one-variable descriptive statistics and
fits linear or quadratic regression to paired data.

## Opening the app

Open the home menu and select **Statistics**.

## Entering data

The app shows an x column and a y column. Type a value into each row; empty
rows are ignored. Use **Add row** to include more than four rows (up to
eight).

## One-variable statistics

Press **Statistics** to compute the summary of the x values:

- `n` — the count of values
- `Σx` — the sum of the values
- `Σx²` — the sum of squares
- `mean` — the arithmetic mean
- `population σ` — the population standard deviation (divided by n)
- `sample s` — the sample standard deviation (divided by n − 1)
- `min` and `max`

A single value reports an error because the sample standard deviation needs at
least two values.

## Regression

Choose **Linear** or **Quadratic** in the **Regression mode** selector, then
press **Regression**. The app solves the least-squares fit and shows the
coefficients together with the correlation measure.

- Linear: `y = slope·x + intercept`, with `r` and `r²`.
- Quadratic: `y = a·x² + b·x + c`, with `r²`.

Enter a value in the **Prediction x value** field to evaluate the fitted
curve at that point.

## Example

For the points `(1, 2), (2, 4), (3, 6)`:

```
y = 2x + 0, r = 1, r² = 1
```

Degenerate data — for example all x values equal — reports a clear error
instead of a meaningless fit.

## Related documentation

- [Table](/user-guide/table) generates tables of function values.
- [Equation](/user-guide/equation) solves polynomials and linear systems.
- [Ratio](/user-guide/ratio) solves ratio proportions.
