---
title: Keyboard First Usage
description: Use the entire calculator without a mouse, including expression entry, keypad navigation, and panels.
---

# Keyboard First Usage

The calculator is designed so that every feature is reachable from the keyboard. The mouse is never required.

## Typing expressions

The expression editor is focused on load. Digits, operators, parentheses, letters, and function names can all be typed directly.

```
2+3sin(30)*x
```

Function names resolve at evaluation, so you type `sin(` or `sqrt(` directly.

## Evaluating

Press `Enter` to evaluate the current expression.

## Smart deletion

- `Backspace` deletes backward using the smart rules. See [Smart backspace](/user-guide/smart-backspace).
- `Delete` deletes forward.
- `Ctrl+Backspace` deletes a whole word or token.
- `Escape` clears the expression (or closes the active panel).

## Moving the caret

The native input handles the standard navigation keys.

- `ArrowLeft` and `ArrowRight` move the caret.
- `Home` and `End` jump to the start and end.
- `Shift+ArrowLeft` and `Shift+ArrowRight` extend a selection.

## Using the keypad with the keyboard

Each keypad toolbar exposes a single tab stop. Press `Tab` to reach the toolbar, then use the arrow keys to move through the buttons.

- `Tab` moves between major regions and out of the toolbar.
- Arrow keys move within the toolbar.
- `Enter` or `Space` activates the focused button.

The arrow-key toolbar navigation keeps focus on the toolbar so you can reach every key without a mouse. See [Keyboard handling](/architecture/keyboard-handling).

## Opening panels

Panels have keyboard shortcuts.

| Shortcut | Action                   |
| -------- | ------------------------ |
| `Ctrl+D` | Cycle the angle mode     |
| `Ctrl+H` | Open the history panel   |
| `Ctrl+E` | Open the constants panel |
| `Ctrl+M` | Open the memory panel    |
| `Ctrl+L` | Open the calculus panel  |
| `Ctrl+,` | Open the settings panel  |
| `Escape` | Close the active panel   |

Within a panel, `Tab` and arrow keys move through the controls, and `Escape` closes it and returns logical focus.

## Accessibility

- Focus is always visible.
- Buttons expose accessible names through React Aria.
- The result line uses an `aria-live` region so screen readers announce results.

See the [Accessibility guide](/developer/accessibility-guide).

## Next steps

- [Keyboard shortcuts](/user-guide/keyboard-shortcuts) is the complete reference.
- [Interface tour](/getting-started/interface-tour) maps the layout.
