---
title: Accessibility Guide
description: The accessibility standards and patterns used in the calculator.
---

# Accessibility Guide

The calculator is keyboard-first and screen reader friendly. This page
documents the accessibility patterns.

## React Aria primitives

The presentation layer wraps React Aria components:

- `AccessibleButtonComponent`
- `AccessibleTextFieldComponent`
- `AccessibleSelectComponent`
- `AccessibleSwitchComponent`
- `AccessibleDialogComponent`

These provide keyboard interaction, focus management, and accessible names.

## Focus

- Focus is always visible with a high-contrast focus ring.
- The expression editor lands focus on load for immediate keyboard entry.
- Keypad grids expose a single tab stop and arrow-key navigation.
- Opening and closing panels returns logical focus.

## Keyboard

- No keyboard traps.
- Every feature is reachable from the keyboard.
- See [Keyboard first usage](/getting-started/keyboard-first-usage).

## Screen readers

- The expression input has an accessible label.
- The result line uses `aria-live="polite"` so results are announced.
- Errors are announced via an `alert` role.
- Decorative elements are `aria-hidden`.

## Accessible names

Every keypad key declares an `ariaLabel` such as "Sine function". Tests assert
accessible names and roles.

## The caret

The editor always shows a visible caret, including a synthetic indicator when
focus moves to a button. This ensures the cursor state is never hidden. See
[Cursor management](/architecture/cursor-management).

## Testing accessibility

Accessibility is verified through component tests that assert labels, roles,
and focus behavior. See [Testing guide](/developer/testing-guide).

## Next steps

- [Design system](/design-system/color-tokens)
- [Browser support](/developer/browser-support)
