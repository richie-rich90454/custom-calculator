---
title: Keyboard Shortcuts
description: The complete reference of keyboard shortcuts for the calculator.
---

# Keyboard Shortcuts

This page lists every keyboard shortcut in the calculator.

## Editing shortcuts

| Key                                    | Action                                         |
| -------------------------------------- | ---------------------------------------------- |
| `ArrowLeft` / `ArrowRight`             | Move the caret                                 |
| `Home` / `End`                         | Jump to the start / end of the expression      |
| `Shift+ArrowLeft` / `Shift+ArrowRight` | Extend the selection                           |
| `Backspace`                            | Smart delete backward                          |
| `Delete`                               | Delete forward                                 |
| `Ctrl+Backspace`                       | Delete a word or token backward                |
| `Escape`                               | Clear the expression or close the active panel |

## Global shortcuts

| Shortcut | Action                   |
| -------- | ------------------------ |
| `Enter`  | Evaluate the expression  |
| `Ctrl+D` | Cycle the angle mode     |
| `Ctrl+H` | Open the history panel   |
| `Ctrl+E` | Open the constants panel |
| `Ctrl+M` | Open the memory panel    |
| `Ctrl+L` | Open the calculus panel  |
| `Ctrl+,` | Open the settings panel  |

## History replay

| Key        | Action                                     |
| ---------- | ------------------------------------------ |
| `PageUp`   | Step back through older history entries    |
| `PageDown` | Step forward through newer history entries |

The first back press restores the newest entry; each further press moves one entry older. At the oldest (or newest) entry, pressing the same direction again inserts that entry's text into the current expression for multi-replay. See [History](/user-guide/history).

## Display keys

| Key                     | Action                                       |
| ----------------------- | -------------------------------------------- |
| `S-D`                   | Cycle a result between fraction and decimal  |
| `ENG`                   | Toggle engineering notation                  |
| `FIX`/`SCI` (from OPTN) | Choose fixed decimals or significant figures |

The **Preview** toggle in the OPTN Display Format tab switches the pretty expression preview on and off. See [Display formats](/user-guide/display-formats).

## Typing

Digits, operators, parentheses, and function names can be typed directly into the expression editor.

```
2+3sin(30)*x
```

## Keypad navigation

Each keypad toolbar exposes a single tab stop. Arrow keys move through the toolbar, and `Enter` or `Space` activates the focused button.

## Directional pad

The directional pad at the bottom-right has four arrows and a center confirm key:

- **Up** and **Down** step backward and forward through history (multi-replay).
- **Left** and **Right** move the caret within the expression.
- **OK** evaluates the expression.

The pad is keyboard-first like every control: `Tab` reaches it and the arrows activate each direction.

## Panels

- `Escape` closes the active panel and returns logical focus.
- Arrow keys and `Tab` move through panel controls.

## Apps

The home menu (the **MENU** key) opens the app grid. Each app is fully keyboard accessible: `Tab` reaches the grid, arrow keys move between apps, and `Enter` or `Space` opens the focused app.

| Key     | Action                        |
| ------- | ----------------------------- |
| `MENU`  | Open the app menu             |
| `OPTN`  | Open the options catalog      |
| `CALC`  | Evaluate with variable values |
| `SOLVE` | Find a root of an equation    |

Within each app, every control is a native focusable element. Data grids follow the single-tab-stop pattern: arrow keys move through cells and `Enter`/`Space` activate buttons.

## Related documentation

- [Keyboard first usage](/getting-started/keyboard-first-usage) explains the workflow.
- [Keyboard handling](/architecture/keyboard-handling) explains the implementation.
- [Display formats](/user-guide/display-formats) covers result formatting keys.
