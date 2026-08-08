---
title: Variables
description: How to create, use, save, and delete user-defined variables.
---

# Variables

Variables let you assign a name to a value and reuse it in later expressions.

## Creating a variable

1. Evaluate an expression to produce a result.
2. Open the **Variables** panel.
3. Enter a name and save the current result under that name.

You can also save the current result under a name from the variables panel.

## Using a variable

Type the variable name directly in an expression, or insert it from the
variables panel.

```
a + b
```

The cursor moves to after the inserted variable name.

## The `ans` variable

The previous result is always available as `ans`. Press the `Ans` key or type
`ans`.

```
ans + 1
```

## Managing variables

- The variables panel lists all saved variables.
- You can delete a variable from the panel.
- Variables are persisted and restored across sessions.

## Naming rules

- Names must start with a letter.
- Names must not collide with function names or constants.
- Names are case sensitive.

## Reserved names

Function names such as `sin` and constant names such as `pi` cannot be
overwritten as variables.

## Related documentation

- [Constants](/user-guide/constants) explains the constant catalog.
- [Memory](/user-guide/memory) explains the classic memory register.
