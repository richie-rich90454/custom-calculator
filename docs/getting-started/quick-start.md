---
title: Quick Start
description: Get from a blank browser tab to a scientific calculation in a few minutes.
---

# Quick Start

This guide gets you to your first scientific calculation quickly. It assumes
the app is running (see [Installation](/getting-started/installation)).

## Enter a basic expression

The expression editor is focused when the app loads, so you can start typing
immediately.

```
2 + 3 * 4
```

Press `Enter` to evaluate. The result `14` appears in the result line.

## Use a scientific function

Type a function name and an argument. Parentheses auto-close at evaluation.

```
sin(30)
```

In degree mode the result is `0.5`.

## Use the keypad

Clicking a keypad button inserts the value and keeps the editor caret at the
correct position. For example, clicking `sin` inserts `sin(` and places the
cursor inside the parentheses.

## Try a constant

Type `pi` or open the constants panel and insert a constant.

```
2 * pi
```

## Try an angle mode

Press `Ctrl+D` to cycle the angle mode. The status bar shows the active mode:
DEG, RAD, or GON.

## Try a numeric mode

Open the settings panel to switch between standard, exact decimal, fraction,
and BigInt numeric modes.

## Your first derivative

With CAS or calculus enabled, insert a calculus block.

```
derivative(x^2, x)
```

Evaluate to get `2 * x` in symbolic mode, or a numeric approximation in
numeric mode.

## Next steps

- [First calculation](/getting-started/first-calculation) explains the editing
  and evaluation flow in detail.
- [Interface tour](/getting-started/interface-tour) maps the layout.
- [Expression editing](/user-guide/expression-editing) covers cursor behavior.
