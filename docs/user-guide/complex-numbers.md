---
title: Complex Numbers
description: How to enable and use complex number support in the calculator.
---

# Complex Numbers

The calculator can evaluate expressions that involve complex numbers. Complex
support is opt-in and toggled in the settings panel.

## Enabling complex numbers

Open the settings panel and toggle **Complex numbers**. When enabled, the
status bar indicates the complex mode.

## Using imaginary units

math.js supports the imaginary unit `i`.

```
i^2  ->  -1
```

## Examples

| Expression | Result |
| ---------- | ------ |
| `(1 + 2i) + (3 - 4i)` | `4 - 2i` |
| `(1 + i)^2` | `2i` |
| `sqrt(-4)` | `2i` |
| `abs(3 + 4i)` | `5` |

## Effect on evaluation

- When complex support is enabled, operations that would otherwise produce an
  error can produce complex results.
- When disabled, operations with non-real results report an evaluation error.

## Interaction with other modes

Complex results are formatted using the active numeric mode where applicable.

## Persistence

The complex number preference is saved and restored across sessions.

## Next steps

- [Settings](/user-guide/settings) explains the settings panel.
- [Numeric modes](/user-guide/numeric-modes) explains result formatting.
