---
title: Display
description: "The display region of the calculator: the expression editor, result line, and error line."
---

# Display

The display is the focal point of the calculator. It contains the expression editor, the result line, and the error line.

## Expression editor

The editor is a single-line input in the display monospace font.

- The caret is always visible and blinks.
- The caret color uses the focus ring token.
- The editor scrolls horizontally to keep the caret in view.
- The selection highlight uses the accent muted token.

## Result line

The result line renders the evaluated result prefixed with `=`.

- It is an `aria-live="polite"` region so screen readers announce results.
- Results use the display font and a readable size.

## Error line

The error line renders evaluation errors.

- It uses the `alert` role so screen readers announce errors.
- Error text uses the error color token.

## Visual layout

The display sits above the keypad with a contrasting surface color. See the [interface tour](/getting-started/interface-tour) for the layout diagram.

## Cursor visibility

The display guarantees cursor visibility:

- Native caret while focused.
- Synthetic indicator when focus is elsewhere.

See [Cursor management](/architecture/cursor-management).

## Next steps

- [Typography](/design-system/typography)
- [Color tokens](/design-system/color-tokens)
