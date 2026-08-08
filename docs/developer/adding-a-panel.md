---
title: Adding a Panel
description: How to add a new panel to the calculator interface.
---

# Adding a Panel

Panels provide focused secondary views such as history, constants, variables, memory, settings, CAS, and calculus. This page explains how to add a new panel.

## Step one: add the panel name

Extend `CalculatorPanelName` in `src/state/CalculatorUiState.ts`:

```ts
export enum CalculatorPanelName {
    NONE = "NONE",
    HISTORY = "HISTORY",
    // ...
    MY_PANEL = "MY_PANEL",
}
```

## Step two: create the panel component

Create a component in `src/presentation/components`. Follow the existing panel conventions: use the panel primitives, accept the view model and actions, and keep logic in services.

## Step three: wire the panel into the shell

Add the panel to `CalculatorShellComponent` so it renders when active. Register any keyboard shortcut in `CalculatorKeyboardShortcutRegistry`.

## Step four: add a status bar entry

Add a button to the status bar that opens the panel through `onPanelOpened("MY_PANEL")`.

## Step five: style

Add a CSS Module for the panel. Use the design tokens.

## Panel behavior rules

- Opening a panel must never destroy calculator state.
- Closing a panel must return logical focus.
- Panels must be keyboard accessible.
- Insertion from a panel (history, constants, variables, CAS) must place the cursor at the correct position.

## Step six: test

- Add a shell test asserting the panel opens.
- Add a panel test covering rendering and insertion.
- Add a focus test covering keyboard access.

## Next steps

- [Adding a CAS operation](/developer/adding-a-cas-operation)
- [Panels](/design-system/panels)
