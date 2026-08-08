---
title: Memory
description: How the classic memory register works: M+, M-, MR, MC.
---

# Memory

The calculator includes a classic memory register, familiar from traditional
scientific calculators.

## Operations

| Key | Meaning |
| --- | ------- |
| `M+` | Add the current result to memory |
| `M-` | Subtract the current result from memory |
| `MR` | Recall the memory value into the expression |
| `MC` | Clear memory |

## Using memory

1. Evaluate an expression to produce a result.
2. Press `M+` to add the result to memory.
3. Use `MR` to insert the memory value into the expression.

```
MR * 2
```

## The memory panel

Press `Ctrl+M` to open the memory panel. It shows the current memory value and
offers the memory operations.

## Insertion behavior

Recalling memory inserts the value token and moves the cursor to after it,
consistent with constant and variable insertion.

## Persistence

The memory value is part of the session and is shown in the memory panel.

## Related documentation

- [Variables](/user-guide/variables) explains user-defined variables.
- [Keyboard shortcuts](/user-guide/keyboard-shortcuts) lists the shortcuts.
