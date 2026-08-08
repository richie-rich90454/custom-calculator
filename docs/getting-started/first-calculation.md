---
title: First Calculation
description: A step-by-step walkthrough of entering, editing, and evaluating your first expression.
---

# First Calculation

This page walks through a complete calculation session: entering an expression, editing it, evaluating it, and continuing with the result.

## Step one: enter an expression

The expression editor is focused on load, so type directly:

```
45 * 3
```

The result line stays empty until you evaluate.

## Step two: edit before evaluating

You can move the cursor with the arrow keys and edit anywhere in the expression.

- `Left` and `Right` move the caret.
- `Home` and `End` jump to the start and end.
- `Backspace` deletes smartly (see [Smart backspace](/user-guide/smart-backspace)).
- `Ctrl+Backspace` deletes a word or token.

For example, with the caret at the end of `45 * 3`, pressing `Backspace` removes the `3`, giving `45 *`.

## Step three: evaluate

Press `Enter` or the equals key.

```
45 * 3 = 135
```

The result `135` is shown in the result line, and the expression is stored in history.

## Step four: continue after a result

After evaluation, behavior depends on what you press next.

- Pressing a **digit** starts a new expression.
- Pressing a **function** starts a new expression with that function.
- Pressing an **operator** continues from the previous result, using it as the left operand.

This keeps the natural flow of a scientific calculator: you rarely need to clear between calculations.

## Example session

| Action                                       | Expression     | Result |
| -------------------------------------------- | -------------- | ------ |
| Type `10 / 4` and press `Enter`              | `10 / 4`       | `2.5`  |
| Press `+` then `0.5`, press `Enter`          | `10 / 4 + 0.5` | `3`    |
| Press `2` then `^`, then `10`, press `Enter` | `2^10`         | `1024` |

## Next steps

- [Interface tour](/getting-started/interface-tour) describes every region of the screen.
- [Expression editing](/user-guide/expression-editing) covers the editing model in depth.
