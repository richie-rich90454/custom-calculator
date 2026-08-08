---
title: Theming Guide
description: How theming works through CSS variables and how to extend it.
---

# Theming Guide

Theming is built on CSS variables defined in two token sets. Components consume
the tokens, so the entire interface restyles consistently.

## Token files

- `src/presentation/styles/themes.css` — the token definitions.

The `:root` block defines the light tokens. The `[data-theme="dark"]` block
overrides them for dark mode.

## Theme mechanism

The bootstrap resolves the theme preference and sets an attribute on the
document root:

```ts
document.documentElement.setAttribute("data-theme", resolvedTheme);
```

Components use tokens such as `var(--color-text-primary)`, which resolve
differently in light and dark.

## Token groups

| Group | Examples |
| ----- | -------- |
| Colors | `--color-background`, `--color-surface`, `--color-border` |
| Text | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` |
| Accent | `--color-accent`, `--color-accent-muted`, `--color-focus-ring` |
| Keys | `--color-key-digit`, `--color-key-function`, `--color-key-operator` |
| Feedback | `--color-error`, `--color-success`, `--color-warning` |
| Radii | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Spacing | `--space-1` through `--space-6` |

## Adding a token

1. Add the token to both the light and dark token sets.
2. Consume it in the CSS Module of the component.
3. Update [color tokens](/design-system/color-tokens) and
   [themes](/design-system/themes) documentation.

## Contrast requirements

Keep text tokens readable against surface tokens. The design system documents
the color pairs. See [Color tokens](/design-system/color-tokens).

## Next steps

- [Themes](/design-system/themes) covers the theme architecture.
- [Themes user guide](/user-guide/themes) explains the user-facing behavior.
