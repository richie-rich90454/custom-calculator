---
title: Symbolic Integration
description: How symbolic antiderivatives work in the calculator.
---

# Symbolic Integration

The symbolic integration operation computes an antiderivative of an expression with respect to a variable.

## Syntax

```
integrate(expression, variable)
```

## Examples

| Expression             | Result    |
| ---------------------- | --------- |
| `integrate(x^2, x)`    | `x^3 / 3` |
| `integrate(sin(x), x)` | `-cos(x)` |
| `integrate(exp(x), x)` | `exp(x)`  |
| `integrate(1/x, x)`    | `ln(x)`   |

## Inserting an antiderivative block

Press the `∫dx` button on the calculus control pad. The template inserts:

```
integrate(|, x)
```

Type the expression in the first slot.

## Constant of integration

Symbolic results are presented without an explicit constant of integration, which is the convention for antiderivative forms. The returned expression represents one antiderivative; any constant offset is implied.

## Limitations

Not every expression has a closed-form antiderivative. The symbolic engine handles common elementary forms and reports an error when it cannot integrate an expression symbolically.

See [Symbolic integration limitations](/cas/limitations) for related notes.

## Next steps

- [Integrals](/calculus/integrals) covers definite numeric integration.
- [Derivatives](/calculus/derivatives) covers differentiation.
