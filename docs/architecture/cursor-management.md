---
title: Cursor Management
description: How the calculator manages cursor placement, caret visibility, and scrolling.
---

# Cursor Management

Cursor management is a deliberate, service-based subsystem. It guarantees the
caret always lands at the logically correct position and stays visible.

## Responsibilities

| Concern | Service |
| ------- | ------- |
| Cursor placement rules | `ExpressionCursorService` |
| Insertion orchestration | `ExpressionInsertionService` |
| Button insertion templates | `ButtonInsertionTemplateService` |
| Caret visibility | `ExpressionEditorCaretRenderingService` |
| Horizontal scrolling | `ExpressionEditorScrollService` |
| Focus preservation | `FocusPreservationService` |
| Selection resolution | `ExpressionEditorSelectionService` |

## Cursor placement rules

```mermaid
flowchart TB
    A[Button pressed] --> B{Insertion kind}
    B -- Digit --> C[Cursor after digit]
    B -- Operator --> D[Cursor after operator]
    B -- Function --> E[Cursor after opening paren]
    B -- Template --> F[Cursor at first placeholder]
    B -- Constant/Variable --> G[Cursor after token]
    B -- Parenthesis --> H[Cursor after parenthesis]
```

## Caret visibility model

The native input caret is authoritative while the editor is focused. When
focus moves to a button, a synthetic indicator renders at the cursor position.

```mermaid
flowchart LR
    A{Editor focused?}
    A -- Yes --> B[Native blinking caret]
    A -- No --> C[Synthetic indicator at cursor]
```

The synthetic caret is positioned using a hidden measure of the text before
the cursor so it always matches the logical position.

## Scroll model

The editor scrolls horizontally to keep the caret visible:

```mermaid
flowchart LR
    A[Cursor moves] --> B[Scroll left edge?]
    B -- Yes --> C[Scroll left]
    B -- No --> D[Scroll right edge?]
    D -- Yes --> E[Scroll right]
    D -- No --> F[No scroll]
```

## Focus preservation

After a button press, focus behavior depends on the input device:

- Mouse click: focus returns to the expression editor so typing continues.
- Keyboard activation: focus stays on the button for grid navigation, and the
  synthetic caret keeps the cursor visible.

## Next steps

- [Expression editing model](/architecture/expression-editing-model)
- [Expression editing guide](/user-guide/expression-editing)
