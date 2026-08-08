---
title: Themes
description: How light, dark, and system themes work and how to switch between them.
---

# Themes

The calculator supports three theme preferences: light, dark, and system.

## Theme preferences

| Preference | Behavior                               |
| ---------- | -------------------------------------- |
| Light      | Always use the light color palette     |
| Dark       | Always use the dark color palette      |
| System     | Follow the operating system preference |

## Switching themes

Open the settings panel and choose the theme preference. The change applies immediately and is persisted.

## Design tokens

Colors are defined as CSS variables in two token sets, one for light and one for dark. Components consume these tokens, so the whole interface restyles consistently.

See [Color tokens](/design-system/color-tokens) and [Themes](/design-system/themes) in the design system documentation.

## System theme

When set to **System**, the calculator reads the operating system's light or dark preference and applies the matching palette. Changes to the system preference are honored while the app is running.

## Next steps

- [Settings](/user-guide/settings) explains the settings panel.
- [Design system themes](/design-system/themes) covers the token architecture.
