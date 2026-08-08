---
title: Expression Editing Model
description: The domain model behind insertion, deletion, and smart editing.
---

# Expression Editing Model

The expression editing model is the domain layer's contract for editing text: insertion, deletion, and auto-closing parentheses.

## The edit result

Every editing operation returns an `ExpressionTextEdit`:

```ts
export interface ExpressionTextEdit {
    readonly text: string;
    readonly cursorPosition: number;
    readonly selectionStart: number;
    readonly selectionEnd: number;
}
```

## The service

`ExpressionEditingService` exposes five operations:

- `insertText` — insert text at the selection.
- `deleteBackward` — smart deletion rules.
- `deleteForward` — forward deletion rules.
- `deleteWordBackward` — token deletion.
- `autoCloseParentheses` — balance parentheses for evaluation.

## Insertion model

Insertion replaces the selection with the inserted text and places the cursor after the inserted text:

```mermaid
flowchart LR
    A[Current text] --> B[Insert at selection]
    B --> C[New text]
    C --> D[Cursor after insertion]
```

## Smart deletion model

`deleteBackward` applies rules in order:

```mermaid
flowchart TB
    A[Backspace pressed] --> B{Selection?}
    B -- Yes --> C[Delete selection]
    B -- No --> D{Cursor after function group?}
    D -- Yes --> E[Delete function group]
    D -- No --> F{Empty paren pair?}
    F -- Yes --> G[Delete both parens]
    F -- No --> H{Cursor after identifier?}
    H -- Yes --> I[Delete identifier token]
    H -- No --> J[Delete one character]
```

## Auto-close model

`autoCloseParentheses` counts unbalanced opening parentheses and appends the matching closing parentheses:

```mermaid
flowchart LR
    A[Expression text] --> B[Count depth]
    B --> C{Depth > 0?}
    C -- Yes --> D[Append closing parens]
    C -- No --> E[Leave unchanged]
```

## Cursor placement rules

The presentation layer enforces the cursor placement rules on top of this model:

- Digit: cursor after the digit.
- Operator: cursor after the operator.
- Function: cursor inside the parentheses.
- Template: cursor at the first placeholder.

See [Cursor management](/architecture/cursor-management).

## Next steps

- [Cursor management](/architecture/cursor-management)
- [Smart backspace](/user-guide/smart-backspace)
