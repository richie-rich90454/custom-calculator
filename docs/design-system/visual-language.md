---
title: Visual Language
description: The instrument palette, keycap colors, silkscreen layers, and display styling.
---

# Visual Language

The calculator looks like a precise scientific instrument: calm, flat, and
utilitarian. There is no glow, no glassmorphism, no neon, and no decoration.
The design is brand-agnostic — no wordmark, logo, or model number appears
anywhere.

## Instrument tokens

The shell always wears the instrument palette, independent of the surrounding
page theme.

| Token | Value | Use |
| ----- | ----- | --- |
| `--color-shell` | `#24272C` | calculator body background |
| `--color-shell-edge` | `#3A3E45` | body edges and key borders |
| `--color-key-primary` | `#EDEBE4` | bone-white numeric and operator keys |
| `--color-key-primary-ink` | `#1C1E21` | ink on primary keys |
| `--color-key-function` | `#343B42` | slate function and utility keys |
| `--color-key-function-ink` | `#E8EAED` | ink on function keys |
| `--color-key-delete` | `#1F6F6B` | teal `DEL` key |
| `--color-key-clear` | `#A6512D` | rust `AC` key |
| `--color-silk-shift` | `#C98A3A` | copper SHIFT silkscreen labels |
| `--color-silk-alpha` | `#3E8E88` | teal ALPHA silkscreen labels |
| `--color-display-paper` | `#F4F2EB` | e-ink display background |
| `--color-display-ink` | `#17191B` | display text |
| `--color-focus-ring` | `#2F6DB3` | visible focus indicator |

## Keycaps

Keycaps are flat keys with a subtle inset edge for depth. Every layered keycap
prints up to three silkscreen layers:

- the primary label centered in the key ink,
- the copper `SHIFT` label in the top-left corner,
- the teal `ALPHA` label in the top-right corner.

When a modifier is armed, its silkscreen labels are highlighted and the status
strip arrow lights up.

## Display

The display is e-ink style: a paper-white panel with ink-black text. Expression,
result, and error lines are left-aligned. The caret is a thin bar that blinks
and always reflects the true cursor position.

## Directional pad

The directional pad is a cross-shaped cluster of four arrows around a center
confirm key. The geometry is original: rounded arrow caps with a circular
center.

## Typography

Noto Sans renders the UI and keycap labels; Noto Sans Mono renders the display,
expression, and math text. See [Typography](/design-system/typography).

## Next steps

- [Color tokens](/design-system/color-tokens)
- [Components](/design-system/components)
- [Interface overview](/user-guide/interface-overview)
