---
title: Enabling CAS
description: How to turn on and use the CAS-style symbolic operations.
---

# Enabling CAS

CAS-style symbolic operations are opt-in. This page explains how to enable and use them.

## Toggle CAS in settings

1. Open the settings panel (`Ctrl+,`).
2. Toggle **CAS** on.
3. Close the panel.

The status bar reflects the CAS state, and CAS operation keys appear on the keypad.

## What changes when CAS is on

- The CAS control pad appears on the keypad with `cas`, `simplify`, `expand`, and `derivative` keys.
- `cas(...)` blocks evaluate to symbolic results instead of errors.
- The CAS toggle is persisted across sessions.

## CAS operation keys

| Key          | Inserts             |
| ------------ | ------------------- |
| `cas`        | `cas(\|)`           |
| `simplify`   | `casSimplify(\|)`   |
| `expand`     | `casExpand(\|)`     |
| `derivative` | `casDerivative(\|)` |

## Evaluation routing

When an expression begins with a `cas(...)` block, the CAS engine handles it before the numeric engine. See [CAS routing](/architecture/cas-routing).

## Related pages

- [CAS overview](/cas/overview) describes the operations.
- [Settings](/user-guide/settings) lists all settings.
