---
title: Themes
description: The theme architecture of the calculator design system.
---

# Themes

The calculator supports light, dark, and system themes through CSS variable token sets.

## Theme preferences

| Preference | Behavior                                |
| ---------- | --------------------------------------- |
| Light      | Always the light token set              |
| Dark       | Always the dark token set               |
| System     | Follows the operating system preference |

## How theming works

1. The bootstrap resolves the preference to `light` or `dark`.
2. It sets `data-theme` on the document root.
3. CSS variables resolve per theme.
4. Components consume the tokens.

## Token sets

- `:root` holds the light tokens.
- `[data-theme="dark"]` holds the dark tokens.

## System theme

The system theme uses `matchMedia("(prefers-color-scheme: dark)")`. Changes to the operating system preference are honored while the app runs.

## Reduced motion

The design system honors `prefers-reduced-motion` and disables animation and transition durations.

## Extending themes

Add tokens to both sets. See [Theming guide](/developer/theming-guide).

## Next steps

- [Color tokens](/design-system/color-tokens)
- [Themes user guide](/user-guide/themes)
