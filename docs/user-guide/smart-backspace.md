---
title: Smart Backspace
description: How the backspace key deletes intelligently by groups, tokens, and function calls.
---

# Smart Backspace

The `Backspace` key does not simply delete one character. It follows a set of
context-aware rules so that deleting feels natural and predictable.

## Rules

The rules are applied in order. The first rule that matches wins.

### Delete a selection

If a selection exists, backspace deletes the selected text.

```
12|+34|  ->  12
```

### Delete a single digit inside a number

If the cursor follows a digit of a number, one digit is deleted.

```
123|  ->  12|
```

### Delete a complete function group

If the cursor follows the opening parenthesis of a function call, the whole
function group is deleted.

```
sin(|  ->  |
```

For a non-empty call, delete inside first:

```
sin(30|  ->  sin(|  ->  |
```

Template blocks such as `derivative(, x)` are deleted as a complete group in
the same way.

### Delete a paired empty parenthesis group

If the cursor sits between an empty `()` pair, both parentheses are removed.

```
2+()|  ->  2+|
```

### Delete a constant or identifier token

If the cursor follows an identifier token, the entire token is deleted.

```
2+speedOfLight|  ->  2+|
```

### Delete one character

If no other rule applies, a single character is deleted.

```
2+|  ->  |2
```

## Forward delete

The `Delete` key deletes forward using a mirrored set of rules: identifier
tokens and empty parenthesis groups are deleted as units.

## Delete a word backward

`Ctrl+Backspace` deletes an entire word or token in one press.

- Numbers are deleted as a whole: `12+34|` becomes `12+|`.
- Identifiers are deleted as a whole: `2+ans|` becomes `2+|`.

## Predictability

The smart rules are designed to be predictable:

- Deleting inside a number always removes one digit, never the whole number.
- Deleting after a function always removes the function group, never a partial
  token.
- Deleting after a constant always removes the constant token.

## Next steps

- [Expression editing](/user-guide/expression-editing) covers cursor behavior.
- [Keyboard shortcuts](/user-guide/keyboard-shortcuts) lists the related keys.
