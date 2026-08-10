---
title: Table
description: How to generate tables of function values with the Table app.
---

# Table

The **Table** app (7) evaluates one or two functions over a range of x values
and displays the result as a table.

## Opening the app

Open the home menu and select **Table**.

## Setting up the table

Enter the function of x in **f(x)**. Optionally add a second function in
**g(x)** to show both columns.

Set the range with **Start**, **End**, and **Step**, then press **Generate**.

## Example

With `f(x) = x²` from 1 to 3 with step 1:

```
x   f(x)
1   1
2   4
3   9
```

## Ranges

- The step must be greater than zero.
- The end value must not be below the start value.
- Start, end, and step must be finite numbers.
- A range generating more than 200 rows is rejected with a clear message.

A function that is not defined at a particular x value (for example
`sqrt(x)` at a negative x) shows a dash in that cell.

## Related documentation

- [Statistics](/user-guide/statistics) computes data summaries and regressions.
- [Equation](/user-guide/equation) solves polynomials and linear systems.
- [Ratio](/user-guide/ratio) solves ratio proportions.
