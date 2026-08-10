---
title: CALC and SOLVE
description: How to substitute values into expressions with CALC and solve equations with SOLVE.
---

# CALC and SOLVE

The **CALC** and **SOLVE** keys help you work with variables in expressions.

## CALC — evaluate with values

Type an expression that contains a variable, then press **CALC**. If the
expression uses variables that have no stored value, a dialog asks you for
each missing variable. Fill in the values and press confirm; the expression
is evaluated with those values.

- Variables that already have a stored value are reused and not prompted.
- Expressions without any variables evaluate directly.
- An empty expression reports an error.

For example, with the expression `a + 1`:

```
CALC -> prompt: a = 2 -> result: 3
```

## SOLVE — find a root

Type an equation, then press **SOLVE**. The calculator finds a value of the
variable that satisfies the equation using the Newton-Raphson method.

- The equation may use `=` (for example `x^2 = 4`) or be written as an
  expression equal to zero (for example `x^2 - 4`).
- The variable is chosen automatically: `x` is preferred, then a multi-letter
  unknown, then any single letter.
- If a stored variable exists for that name, its value is used as the
  starting guess; otherwise the guess starts at 1.

The result reports the root and the number of iterations:

```
x = 2 (4 iterations)
```

## Errors

- An empty equation reports an error.
- An equation without a recognizable variable reports an error.
- When the solver cannot converge — for example a flat slope or an
  oscillating iteration — it reports a clear message instead of a fake root.

## Related documentation

- [Variables](/user-guide/variables) explains stored variables.
- [Equation](/user-guide/equation) solves polynomials and linear systems.
- [Expression editing](/user-guide/expression-editing) explains entering formulas.
