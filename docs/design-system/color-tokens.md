---
title: Color Tokens
description: The color tokens of the calculator design system and how they are organized.
---

# Color Tokens

Colors are defined as CSS variables in `src/presentation/styles/themes.css`. There are two token sets: light and dark.

## Core tokens

| Token                    | Light     | Dark      | Use                |
| ------------------------ | --------- | --------- | ------------------ |
| `--color-background`     | `#f4f5f7` | `#101318` | App background     |
| `--color-surface`        | `#ffffff` | `#181c23` | Cards and surfaces |
| `--color-surface-muted`  | `#eef0f3` | `#202632` | Muted surfaces     |
| `--color-border`         | `#d7dbe0` | `#2c3442` | Borders            |
| `--color-text-primary`   | `#15181d` | `#e8ebf0` | Primary text       |
| `--color-text-secondary` | `#5b6470` | `#98a2b3` | Secondary text     |
| `--color-text-muted`     | `#8a93a0` | `#6b7686` | Muted text         |
| `--color-accent`         | `#1f6feb` | `#4c8dff` | Accent and links   |
| `--color-focus-ring`     | `#2f6db3` | `#2f6db3` | Focus indicators   |

## Key tokens

Keycap tokens are instrument-fixed: both themes use the same values so the calculator reads as one instrument.

| Token                  | Light     | Dark      | Use                           |
| ---------------------- | --------- | --------- | ----------------------------- |
| `--color-key-primary`  | `#edebe4` | `#edebe4` | Digit and operator keys       |
| `--color-key-function` | `#343b42` | `#343b42` | Function and utility keys     |
| `--color-key-delete`   | `#1f6f6b` | `#1f6f6b` | Delete key background         |
| `--color-key-clear`    | `#a6512d` | `#a6512d` | Clear key background          |
| `--color-key-operator` | `#e3eaf6` | `#243147` | Panel action background       |
| `--color-key-danger`   | `#fbecec` | `#3a2226` | Destructive action background |

## Feedback tokens

| Token             | Light     | Dark      | Use        |
| ----------------- | --------- | --------- | ---------- |
| `--color-error`   | `#b42318` | `#ff6b6b` | Error text |
| `--color-success` | `#1e8a44` | `#6bdb8c` | Success    |
| `--color-warning` | `#b07a13` | `#f5c76b` | Warning    |

## Contrast notes

Text tokens are chosen to meet contrast requirements on their intended surfaces:

- Primary text on background and surface.
- Secondary text on surface.
- Muted text only for non-essential content.

## Adding a token

Add a token to both light and dark sets, then consume it in a CSS Module. See [Theming guide](/developer/theming-guide).

## Next steps

- [Typography](/design-system/typography)
- [Themes](/design-system/themes)
