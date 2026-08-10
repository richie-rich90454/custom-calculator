---
title: Keymap Reference
description: Every keycap in the instrument with its primary, SHIFT, and ALPHA layers.
---

# Keymap Reference

Every keycap is described by a frozen catalog entry with up to three silkscreen
layers. The **primary** layer applies when no modifier is armed, the **SHIFT**
layer when `SHIFT` is armed, and the **ALPHA** layer when `ALPHA` is armed.
Arming one modifier disarms the other, and pressing a keycap consumes the
armed layer.

| Key | Primary | SHIFT | ALPHA |
| --- | ------- | ----- | ----- |
| `MENU` | open the app menu | | |
| `SHIFT` | arm shift layer | | |
| `ALPHA` | arm alpha layer | | |
| `OPTN` | open the options catalog | | |
| `CALC` | evaluate with a variable prompt | `SOLVE` | |
| `∫` | integral template | derivative template | |
| `lim` | limit template | Taylor series template | |
| `Σ` | summation template | product template | |
| `a/b` | fraction template | mixed fraction template | |
| `√` | square root | cube root | `F` |
| `x²` | square | cube | |
| `xʸ` | power operator | nth root | |
| `log` | log base a | `10ˣ` | `E` |
| `ln` | natural log | `eˣ` | `D` |
| `1/x` | reciprocal | factorial | |
| `π` | pi | `e` | |
| `sin` | sine | arcsine | `A` |
| `cos` | cosine | arccosine | `B` |
| `tan` | tangent | arctangent | `C` |
| `hyp` | hyperbolic menu | inverse hyperbolic menu | |
| `STO` | arm store-to-variable mode | `RCL` | |
| `ENG` | toggle engineering format | reverse direction | |
| `S⇔D` | cycle decimal and fraction | display format menu | |
| `M+` | add result to memory | `M-` | `M` |
| `(` | open parenthesis | | |
| `×10ˣ` | insert times ten to the power of | `Ran#` | |
| `Ans` | insert previous answer | `%` | `Y` |
| `DEL` | delete the token before the caret | | |
| `AC` | clear expression and result | | |
| `0`-`9`, `.` | digits and decimal point | | |
| `=`, `+`, `−`, `×`, `÷`, `,` | evaluate and operators | `≈` on equals | |
| `▲` | step back through history | | |
| `▼` | step forward through history | | |
| `◀`, `▶` | move the caret left / right | | |
| `OK` | evaluate | | |

## Modifier layers

- Sticky and mutually exclusive: arming `SHIFT` disarms `ALPHA` and vice versa.
- The armed layer is consumed by the next keycap press.
- `Escape` disarms the active modifier without side effects.
- The status strip arrows mirror the armed layer.

## Store and recall flow

1. Press `STO` to arm store mode.
2. Press a variable key (`A`-`F`, `X`, `Y`, `M`, or any letter) to store the
   current result into that variable.
3. Press `RCL` then a variable key to insert the variable's name, which
   evaluates to its stored value.

Variables `A`, `B`, `C`, `D`, `E`, `F`, `X`, `Y`, `M`, and `ans` persist
across sessions through Dexie.

## Templates

Templates insert structured text and place the caret at the first editable
slot, for example `integral(|, x, a, b)` and `derivative(|, x)`.

## Next steps

- [Interface overview](/user-guide/interface-overview)
- [Keyboard shortcuts](/user-guide/keyboard-shortcuts)
- [Design system: visual language](/design-system/visual-language)
