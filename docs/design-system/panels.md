---
title: Panels
description: The panel design of the calculator, including behavior and visual consistency.
---

# Panels

Panels are secondary views that open over the calculator shell. They share a common visual design and consistent behavior.

## Panel inventory

| Panel     | Opens      |
| --------- | ---------- |
| History   | `Ctrl+H`   |
| Constants | `Ctrl+E`   |
| Variables | Status bar |
| Memory    | `Ctrl+M`   |
| Settings  | `Ctrl+,`   |
| CAS       | Status bar |
| Calculus  | `Ctrl+L`   |

## Behavior rules

- Opening a panel never destroys calculator state.
- Closing a panel returns logical focus.
- Panels are keyboard accessible.
- Insertion from a panel places the cursor at the correct position.

## Shared primitives

Panels are built from the shared primitives:

- `PanelComponent`
- `PanelSectionComponent`
- `PanelEmptyStateComponent`

## Visual design

Panels use the same color, spacing, and radius tokens as the rest of the interface. They stay visually consistent in light and dark themes.

## Empty states

Panels render an empty state when they have nothing to show, such as an empty history list.

## Next steps

- [Adding a panel](/developer/adding-a-panel)
- [Components](/design-system/components)
