---
title: Expression Editing
description: How the expression editor works, including cursor placement, insertion, selection, and editing behavior.
---

# Expression Editing

The expression editor is the heart of the calculator. This page explains the editing model: how the cursor behaves, how insertion works, and how selection and deletion behave.

## The cursor

The cursor (caret) always sits at the logically correct insertion point after every action.

- Pressing a **digit** places the cursor after the digit: `7|`.
- Pressing an **operator** places the cursor after the operator: `5+|`.
- Pressing a **function** places the cursor inside the parentheses: `sin(|`.
- Pressing a **template** button places the cursor at the first placeholder.
- Pressing a **constant** or **variable** places the cursor after it.

The `|` symbol in this documentation represents the cursor position.

## Inserting a function

Pressing the `sin` button inserts the function call and moves the cursor to the first editable position:

```
sin(|
```

The same rule applies to every function button: `cos`, `tan`, `log`, `ln`, `sqrt`, and so on. The closing parenthesis is added automatically at evaluation, so you never count parentheses by hand.

## Inserting a template

Template buttons insert a complete block with placeholders. The cursor lands on the first placeholder, ready for your input.

```
derivative(|, x)
integral(|, x, a, b)
taylor(|, x, 0, 5)
limit(|, x, 0)
sum(|, n, 1, 10)
product(|, n, 1, 5)
```

Placeholders such as `x`, `a`, `b`, `n`, `0`, `5`, and `10` are starting points that you replace with your own values.

## Selecting text

The editor supports native text selection.

- Click and drag to select.
- `Shift+ArrowLeft` and `Shift+ArrowRight` extend the selection.
- `Ctrl+A` selects everything.

## Wrapping a selection

When text is selected, pressing a function button wraps the selection in the function call, with the cursor after the wrapped argument:

```
sin(x+1|)
```

Selection wrapping is the predictable behavior used for all single-argument functions.

## Editing with the keyboard

- `ArrowLeft` and `ArrowRight` move the cursor.
- `Home` and `End` jump to the start and end.
- `Backspace` uses the smart deletion rules.
- `Delete` deletes forward.
- `Ctrl+Backspace` deletes a word or token.

## Caret visibility

The caret is always visible.

- While the editor is focused, the native input caret is shown and blinking.
- If focus moves to a button, a synthetic caret indicator remains visible at the correct position.
- The editor scrolls horizontally to keep the caret in view.

See [Cursor management](/architecture/cursor-management) for the implementation.

## Next steps

- [Smart backspace](/user-guide/smart-backspace) explains deletion behavior.
- [Parentheses](/user-guide/parentheses) explains parenthesis handling.
