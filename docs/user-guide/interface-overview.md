---
title: Interface Overview
description: A tour of the instrument shell, status strip, display, home menu, and layered keypad.
---

# Interface Overview

The calculator is a single-instrument shell: a status strip on top, a paper-white
display in the middle, and a layered keypad below. Panels and the app menu open
as accessible dialogs over the shell.

```
+------------------------------------------------------------------+
|  CALCULATE  [DEG] [NORM]  [△ SHIFT] [α ALPHA] [M] [CAS] [CMPLX]  |
+------------------------------------------------------------------+
|  Display:  Row 1  status strip (above)                           |
|            Row 2  editable expression line                        |
|            Row 3  KaTeX preview line (toggleable)                 |
|            Row 4  result or inline error line                     |
+------------------------------------------------------------------+
|  MENU | SHIFT | ALPHA | OPTN | CALC                               |
|    ∫  |  lim  |   Σ   | a/b  |  √                                 |
|   x²  |  xʸ   |  log  |  ln  | 1/x                                |
|    π  |  sin  |  cos  |  tan |  hyp                                |
|    x  |  STO  |  ENG  | S⇔D |  M+                                 |
|    (  | ×10ˣ  |  DEL  |  AC  |  Ans                                |
|    7  |   8   |   9   |  ÷   |     ▲                              |
|    4  |   5   |   6   |  ×   |  ◀  OK  ▶   cross-shaped D-pad      |
|    1  |   2   |   3   |  −   |     ▼                              |
|    0  |   .   |   ,   |  +   |  =                                  |
+------------------------------------------------------------------+
```

## Status strip

The first row mirrors the state of the instrument:

- the active app name,
- the angle-mode chip (`DEG`, `RAD`, or `GON`) — press it to cycle,
- the numeric-format chip (`NORM`, `EXACT`, `FRAC`, or `BIG`),
- the sticky modifier arrows — `△ SHIFT` and `α ALPHA` light up when armed,
- the `M`, `CAS`, and `CMPLX` indicators when memory, CAS, or complex numbers
  are active,
- a `BIG-INT UNAVAILABLE` warning when the browser has no BigInt support.

## Display anatomy

The display has four logical rows, all left-aligned:

1. the status strip,
2. the editable expression line with a visible, blinking caret,
3. the KaTeX pretty preview line (toggleable, left-aligned),
4. the result line, or an inline error message.

See [Display and Result Formats](/user-guide/expression-editing) for editing
behavior and [keymap reference](/user-guide/keymap-reference) for every key.

## Home menu

The `MENU` key opens the home icon menu: ten apps arranged in a two-by-five
grid, each with an original line icon and a numeric badge from `1` through `9`
and `0`. The last active app persists across sessions.

## Layered keypad

Every keycap prints up to three silkscreen layers: the primary label in the
center, the copper `SHIFT` label in the top-left corner, and the teal `ALPHA`
label in the top-right corner. Pressing `SHIFT` or `ALPHA` arms the layer; the
next keycap press resolves that layer and the modifier disarms.

The cross-shaped directional pad sits to the right of the keypad with a center
confirm key. See the [keymap reference](/user-guide/keymap-reference) for the
complete three-layer mapping.

## Next steps

- [Keymap reference](/user-guide/keymap-reference)
- [Design system: visual language](/design-system/visual-language)
- [Architecture: app shell](/architecture/app-shell)
