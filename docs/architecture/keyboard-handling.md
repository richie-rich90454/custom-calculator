---
title: Keyboard Handling
description: How keyboard input flows through the editor, the shortcut registry, and the keypad.
---

# Keyboard Handling

Keyboard input is handled in two places: inside the expression editor and at
the window level for global shortcuts.

## Editor keyboard flow

```mermaid
flowchart LR
    A[Key down in editor] --> B[ExpressionEditorKeyboardService]
    B -- Enter --> C[Evaluate]
    B -- Backspace --> D[Delete backward]
    B -- Delete --> E[Delete forward]
    B -- Ctrl+Backspace --> F[Delete word]
    B -- Escape --> G[Clear]
    B -- otherwise --> H[Native input behavior]
```

`ExpressionEditorKeyboardService` decides whether a key is handled and reports
it so the component can prevent default browser behavior. Arrow keys, Home,
and End are intentionally left to the native input.

## Global shortcut flow

Window-level shortcuts are resolved by `CalculatorKeyboardShortcutRegistry`
through the `useCalculatorKeyboardBindings` hook.

```mermaid
flowchart TB
    A[Window key down] --> B{Typing in input?}
    B -- Yes --> C[Leave to the editor]
    B -- No --> D[Shortcut registry]
    D -- Escape --> E[Close panel or clear]
    D -- Enter --> F[Evaluate]
    D -- Ctrl+D --> G[Cycle angle mode]
    D -- Ctrl+H/M/E/L/, --> H[Open panel]
```

## Modifier shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Ctrl+D` | Cycle the angle mode |
| `Ctrl+H` | Open history |
| `Ctrl+M` | Open memory |
| `Ctrl+E` | Open constants |
| `Ctrl+,` | Open settings |
| `Ctrl+L` | Open calculus |

## Keypad grid navigation

Each keypad grid exposes one tab stop. `useKeypadGridNavigation` handles
arrow-key movement inside the grid, and `Enter` or `Space` activates the
focused key through React Aria.

## Focus preservation

Button presses preserve the expression editor caret. When focus leaves the
editor, a synthetic caret indicator keeps the cursor visible. See
[Cursor management](/architecture/cursor-management).

## Next steps

- [Keyboard shortcuts](/user-guide/keyboard-shortcuts)
- [Expression editing model](/architecture/expression-editing-model)
