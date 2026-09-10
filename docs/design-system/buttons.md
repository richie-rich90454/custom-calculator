---
title: Buttons
description: The button design of the calculator keypad and interface.
---

# Buttons

Buttons are the primary interactive element. The keypad distinguishes several button roles by color and behavior.

## Button roles

| Role       | Token                  | Example |
| ---------- | ---------------------- | ------- |
| Digit      | `--color-key-primary`  | `7`     |
| Operator   | `--color-key-primary`  | `+`     |
| Function   | `--color-key-function` | `sin`   |
| Utility    | `--color-key-function` | `STO`   |
| Navigation | `--color-key-function` | `◀`     |
| Delete     | `--color-key-delete`   | `DEL`   |
| Clear      | `--color-key-clear`    | `AC`    |
| Evaluate   | `--color-key-primary`  | `=`     |

## Interaction states

- **Pressed** — buttons respond immediately with a clear pressed state.
- **Focus** — every button shows a visible focus state.
- **Hover** — hover surfaces a subtle color change.

## Behavior

- Buttons respond quickly; there are no sluggish interactions.
- Pressing a button preserves the expression caret.
- Button labels are readable at keypad size.

## Keyboard access

Each keypad toolbar exposes one tab stop. Arrow keys navigate the toolbar, and `Enter` or `Space` activates the focused button.

## No flashy effects

The design avoids glow effects and flashy animations. The interaction stays calm and precise.

## Next steps

- [Keypad UX](/user-guide/mobile-usage)
- [Components](/design-system/components)
