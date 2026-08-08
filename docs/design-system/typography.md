---
title: Typography
description: The typography system of the calculator design system.
---

# Typography

The design system uses two font families: a UI sans-serif and a display monospace.

## Font tokens

| Token            | Font stack                              | Use                |
| ---------------- | --------------------------------------- | ------------------ |
| `--font-ui`      | Noto Sans, Segoe UI, system-ui          | Interface text     |
| `--font-display` | Noto Sans Mono, Cascadia Code, Consolas | Expression display |

## The display font

The expression editor uses the monospace display font. Monospace keeps every character the same width, which makes cursor measurement and editing feel stable and precise.

## Sizes

| Context           | Size          |
| ----------------- | ------------- |
| Expression editor | `1.35rem`     |
| Result line       | Display scale |
| Status bar        | Compact       |
| Button labels     | Compact       |

## Line height

The expression editor uses a relaxed line height (`1.5`) so the caret and selection remain clearly visible.

## Weights

- Headings and section titles use heavier weights.
- Body text uses regular weight.
- Button labels use medium weight for readability.

## Import

Fonts are loaded through `@fontsource/noto-sans` and `@fontsource/noto-sans-mono` in the root package.

## Next steps

- [Color tokens](/design-system/color-tokens)
- [Spacing](/design-system/spacing)
