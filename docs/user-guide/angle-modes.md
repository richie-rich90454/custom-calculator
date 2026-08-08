---
title: Angle Modes
description: How degrees, radians, and gradians work and how to switch between them.
---

# Angle Modes

Trigonometric functions depend on the angle mode. The calculator supports three
modes:

- **DEG** — degrees. A full circle is 360 degrees.
- **RAD** — radians. A full circle is `2*pi` radians.
- **GON** — gradians. A full circle is 400 gradians.

## Switching modes

- Press `Ctrl+D` to cycle through DEG, RAD, and GON.
- Use the settings panel to choose the mode explicitly.

The status bar shows the active mode.

## Examples

| Mode | Expression | Result |
| ---- | ---------- | ------ |
| DEG | `sin(30)` | `0.5` |
| RAD | `sin(pi/6)` | `0.5` |
| GON | `sin(100/3)` | approximately `0.5` |
| DEG | `sin(45)` | `0.7071067811865476` |
| RAD | `sin(pi/4)` | `0.7071067811865476` |

## Consistency with calculus

The calculus engine has its own angle policy. Because numeric approximations of
derivatives and integrals are extremely sensitive to angle units, the calculus
operations evaluate trigonometric functions in radian mode internally, with
documented exceptions. See [Angle mode policy](/calculus/angle-mode-policy).

## Persistence

The selected angle mode is saved as part of the settings and restored the next
time the app loads.

## Next steps

- [Settings](/user-guide/settings) explains the settings panel.
- [Calculus angle mode policy](/calculus/angle-mode-policy) explains calculus
  behavior.
