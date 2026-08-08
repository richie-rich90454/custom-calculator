---
title: Constants
description: How to insert scientific constants, browse the catalog, and use constants in expressions.
---

# Constants

The calculator ships with a catalog of scientific constants covering
mathematics, universal physics, atomic and particle data, and chemistry.

## Opening the constants panel

Press `Ctrl+E` or open **Constants** from the status bar. The panel lets you
search constants and select a category.

## Inserting a constant

Click a constant in the panel to insert its insertion text at the cursor. The
cursor moves to after the inserted constant.

```
2 * speedOfLight
```

## Categories

| Category | Examples |
| -------- | -------- |
| Math | `pi`, `e`, `tau`, `phi` |
| Physics | `speedOfLight`, `gravitationalConstant`, `planckConstant` |
| Atomic | `electronMass`, `protonMass`, `avogadro` |
| Chemistry | `molarGasConstant`, `faradayConstant` |

See the reference pages for the full lists:

- [Math constants](/scientific-reference/constants-math)
- [Physics constants](/scientific-reference/constants-physics)
- [Chemistry constants](/scientific-reference/constants-chemistry)
- [Atomic constants](/scientific-reference/constants-atomic)

## Typing constants directly

Constants are identified by name, so you can type them directly.

```
pi
e
speedOfLight
```

## Constants in expressions

Constants combine with operators and functions like any value.

```
pi * 2
sin(pi/2)
speedOfLight^2
```

## Insertion behavior

Inserting a constant is a token insertion: the cursor moves to after the whole
constant name, not between letters.

## Next steps

- [Variables](/user-guide/variables) explains user-defined variables.
- [Scientific reference](/scientific-reference/function-catalog) covers
  functions.
