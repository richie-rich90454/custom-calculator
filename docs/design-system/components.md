---
title: Components
description: The component inventory of the calculator and how components are organized.
---

# Components

Components live in `src/presentation/components` and are split into shells,
primitives, and feature components.

## Shell components

| Component | Role |
| --------- | ---- |
| `CalculatorShellComponent` | Top-level layout |
| `CalculatorDisplayComponent` | Expression editor, result, and error lines |
| `CalculatorKeypadComponent` | Keypad regions and dispatch |
| `CalculatorStatusBarComponent` | Mode indicators and panel access |

## Expression components

| Component | Role |
| --------- | ---- |
| `CalculatorExpressionEditorComponent` | The primary input |
| `CalculatorResultLineComponent` | Result presentation |
| `CalculatorErrorLineComponent` | Error presentation |
| `CalculatorCaretIndicatorComponent` | Synthetic caret indicator |

## Keypad components

| Component | Role |
| --------- | ---- |
| `CalculatorCorePadComponent` | Digits, operators, equals |
| `CalculatorScientificFunctionPadComponent` | Scientific functions |
| `CalculatorCasControlPadComponent` | CAS operations |
| `CalculatorCalculusControlPadComponent` | Calculus operations |
| `CalculatorKeypadGridSectionComponent` | Grid section shell |
| `CalculatorKeyComponent` | Single key |

## Panel components

| Component | Role |
| --------- | ---- |
| `HistoryPanelComponent` | History list |
| `ConstantsPanelComponent` | Constant catalog |
| `VariablesPanelComponent` | Saved variables |
| `MemoryPanelComponent` | Memory register |
| `SettingsPanelComponent` | Settings controls |
| `CasPanelComponent` | CAS help and actions |
| `CalculusPanelComponent` | Calculus help and actions |

## Primitives

The primitives wrap React Aria in `src/presentation/primitives`:

- `AccessibleButtonComponent`
- `AccessibleTextFieldComponent`
- `AccessibleSelectComponent`
- `AccessibleSwitchComponent`
- `AccessibleDialogComponent`
- `PanelComponent` and panel sections

## Component rules

- Components render and forward events only.
- Logic lives in services and view models.
- Every interactive control exposes an accessible name.

## Next steps

- [Panels](/design-system/panels)
- [Buttons](/design-system/buttons)
