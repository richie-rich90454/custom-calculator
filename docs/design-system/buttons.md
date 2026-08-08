---
title: Buttons
description: The button design of the calculator keypad and interface.
---

# Buttons

Buttons are the primary interactive element. The keypad distinguishes several
button roles by color and behavior.

## Button roles

| Role | Token | Example |
| ---- | ----- | ------- |
| Digit | `--color-key-digit` | `7` |
| Function | `--color-key-function` | `sin` |
| Operator | `--color-key-operator` | `+` |
| Utility | `--color-key-utility` | `MR` |
| Danger | `--color-key-danger` | `AC` |
| Accent | `--color-key-accent` | `=` |

## Interaction states

- **Pressed** — buttons respond immediately with a clear pressed state.
- **Focus** — every button shows a visible focus state.
- **Hover** — hover surfaces a subtle color change.

## Behavior

- Buttons respond quickly; there are no sluggish interactions.
- Pressing a button preserves the expression caret.
- Button labels are readable at keypad size.

## Keyboard access

Each keypad grid exposes one tab stop. Arrow keys navigate the grid, and
`Enter` or `Space` activates the focused button.

## No flashy effects

The design avoids glow effects and flashy animations. The interaction stays
calm and precise.

## Next steps

- [Keypad UX](/user-guide/mobile-usage)
- [Components](/design-system/components)
