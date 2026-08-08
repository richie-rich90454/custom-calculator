---
title: Interface Tour
description: A guided tour of every region of the calculator interface.
---

# Interface Tour

The calculator interface is organized into a display, a keypad, panels, and a status bar.

```
+----------------------------------------------------------+
|  Expression editor  [ 45 * 3                    |        ] |
|  Result line             = 135                            |
|  Error line            (visible only on errors)            |
+----------------------------------------------------------+
|  Scientific function pad  (sin, cos, tan, ln, log, ...)    |
|  Calculus control pad     (derivative, integral, limit...) |
|  Core keypad              (digits, operators, equals)      |
+----------------------------------------------------------+
|  Status bar  [DEG] [STANDARD] [complex] [CAS]  [panels]    |
+----------------------------------------------------------+
```

## Display

The display contains the expression editor, the result line, and the error line.

- **Expression editor** — the primary input. A single-line text input that scrolls horizontally to keep the caret visible.
- **Result line** — shows the evaluated result prefixed with `=`.
- **Error line** — shows evaluation errors with an `alert` role.

## Keypad

The keypad is split into functional regions.

- **Scientific function pad** — trigonometric, hyperbolic, logarithmic, exponential, root, rounding, and arithmetic functions.
- **Calculus control pad** — derivative, numeric derivative, integral, antiderivative, limit, Taylor series, summation, and product blocks.
- **Core keypad** — digits, operators, parentheses, `AC`, backspace, `Ans`, memory recall, and equals.

Each key is a data-driven definition: an id, a label, an accessible name, a kind, and a value. See [CalculatorKeyDefinition](/developer/adding-a-function).

## Panels

Panels open from the status bar or via keyboard shortcuts.

- **History** — past evaluations, stored persistently. `Ctrl+H`
- **Constants** — the scientific constant catalog. `Ctrl+E`
- **Variables** — user-defined variables with persistence. `Ctrl+V` on the variables entry point
- **Memory** — the classic memory register. `Ctrl+M`
- **Settings** — angle mode, numeric mode, complex numbers, CAS, and theme. `Ctrl+,`
- **Calculus** — calculus operation blocks and shortcuts. `Ctrl+L`

Opening a panel never destroys the current expression.

## Status bar

The status bar shows the current angle mode, numeric mode, complex number support, and CAS state, and provides quick access to panels.

## Themes

Use the settings panel to switch between light, dark, and system themes. See [Themes](/user-guide/themes).

## Next steps

- [Keyboard first usage](/getting-started/keyboard-first-usage) shows how to use the calculator without a mouse.
- [Keyboard shortcuts](/user-guide/keyboard-shortcuts) lists every shortcut.
