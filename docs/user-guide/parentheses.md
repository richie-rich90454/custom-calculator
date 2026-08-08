---
title: Parentheses
description: How parentheses work in the expression editor, including insertion, auto-closing, and deletion.
---

# Parentheses

Parentheses group sub-expressions and determine the order of operations. The editor handles them thoughtfully.

## Inserting parentheses

- The `(` button inserts an opening parenthesis and places the cursor after it: `(|`.
- The `)` button inserts a closing parenthesis and places the cursor after it: `)|`.
- Typing parentheses on the keyboard works the same way.

## Auto-closing at evaluation

When you evaluate an expression, any unbalanced opening parentheses are closed automatically.

```
sin(30  ->  sin(30)
```

This means you never have to count closing parentheses by hand; you can press `Enter` at any point and the expression is completed for you.

## Empty parenthesis groups

An empty `()` pair is treated as a single unit during deletion.

- `Backspace` on `2+()|` removes both parentheses: `2+|`.
- `Delete` on `()|` with the cursor between the pair removes both.

This prevents accidentally leaving a stray parenthesis.

## Function calls

Function buttons insert an opening parenthesis and place the cursor inside it.

```
sin(|
```

When the call is complete, evaluation auto-closes it. See [Expression editing](/user-guide/expression-editing).

## Nested parentheses

Nesting is fully supported.

```
((1+2)*(3+4))
```

At evaluation, the auto-close logic balances the outermost level for any unclosed group.

## Smart deletion of a function group

When the cursor follows the opening parenthesis of a function call, backspace removes the entire function group rather than just the parenthesis.

```
sin(|  ->  |
```

See [Smart backspace](/user-guide/smart-backspace).

## Next steps

- [Operator precedence](/user-guide/operator-precedence) explains how grouping affects evaluation.
- [Expression editing](/user-guide/expression-editing) covers cursor behavior.
