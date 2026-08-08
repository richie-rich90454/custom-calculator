---
title: API Reference Index
description: A hand-maintained reference to the major classes and services of the calculator.
---

# API Reference Index

This index describes the major classes and services of the calculator,
organized by layer. The reference is hand-maintained so it stays accurate and
readable.

## Domain models

### CalculatorSessionState

Immutable session state passed through every command.

| Field | Type | Purpose |
| ----- | ---- | ------- |
| `expressionText` | `string` | The expression text |
| `cursorPosition` | `number` | The logical cursor position |
| `selectionStart` / `selectionEnd` | `number` | The selection range |
| `resultText` / `errorText` | `string \| null` | Evaluation output |
| `lastResultText` / `lastResultValue` | `string \| null` / `unknown` | The `ans` value |
| `angleMode` | `AngleMode` | DEG, RAD, or GON |
| `numericMode` | `NumericMode` | The numeric mode |
| `variables` | `readonly VariableAssignment[]` | Saved variables |
| `memoryValueText` | `string \| null` | The memory value |

Key methods:

- `createInitial()` — the default state.
- `copyWith(overrides)` — a new state with selected fields overridden.

### CalculatorSettings

Persisted settings: angle mode, numeric mode, complex number flag, CAS flag,
and theme preference.

### MemoryRegister

The classic memory register value.

### HistoryEntry

A recorded evaluation with expression, result, modes, and timestamp.

### ScientificConstant

A constant catalog entry with id, symbol, name, category, value, unit,
description, source, and aliases.

## Domain services

### ExpressionEditingService

| Method | Purpose |
| ------ | ------- |
| `insertText` | Insert text at the selection |
| `deleteBackward` | Smart backward deletion |
| `deleteForward` | Smart forward deletion |
| `deleteWordBackward` | Token deletion |
| `autoCloseParentheses` | Balance parentheses for evaluation |

### ExpressionValidationService

Validates expressions against the function and constant catalogs.

### ExpressionEvaluationGateway

The interface to the math engine.

### NumericModePolicyService

| Method | Purpose |
| ------ | ------- |
| `getSupportedNumericModes` | Modes available in this browser |
| `isNumericModeSupported` | Whether a mode is supported |
| `resolveEffectiveNumericMode` | Fallback resolution |

### ResultFormattingService

Formats numeric and symbolic results.

### ScientificFunctionCatalogService

| Method | Purpose |
| ------ | ------- |
| `getAllFunctions` | All function definitions |
| `getFunction` | A definition by name |
| `hasFunction` | Whether a function exists |

### ConstantCatalogService

Queries the constant catalog, including insertion text.

### CasService

| Method | Purpose |
| ------ | ------- |
| `simplifyExpression` | Simplify |
| `expandExpression` | Expand |
| `differentiateExpression` | Differentiate |

## Repositories

### HistoryRepository

Load, record, and clear history entries.

### VariablesRepository

Load, save, and remove variables.

### SettingsRepository

Load and save settings.

### ScientificConstantRepository

Provides the constant catalog data.

## Application layer

### CalculatorApplicationController

The facade the UI calls:

- `insertDigit`, `insertOperator`, `insertFunction`
- `insertConstant`, `insertVariable`, `insertParenthesis`
- `deleteBackward`, `deleteForward`, `deleteWordBackward`
- `clearSession`, `setExpressionText`
- `evaluateExpression`
- `cycleAngleMode`, `changeNumericMode`, `toggleComplexNumbers`, `toggleCasMode`
- `saveVariable`, `deleteVariable`
- `memoryAdd`, `memorySubtract`, `memoryRecall`, `memoryClear`
- `simplifyExpression`, `expandExpression`, `differentiateExpression`

### AbstractCalculatorCommand

Base class for commands with a single `execute(state)` method.

### CalculusBlockParser / CasBlockParser

Parse top-level calculus and CAS blocks from expression text.

### CalculusExpressionRouterService

Routes calculus descriptors to numeric or symbolic services.

## Infrastructure layer

### MathJsExpressionEvaluationGateway

The math.js evaluation gateway. Parses through the math.js parser, applies the
function whitelist and a controlled scope, and maps errors.

### MathJsFunctionWhitelist

Restricts which functions the engine may call.

### MathJsConstantScopeBuilder

Builds the evaluation scope from constants and variables.

### MathJsCasService

Implements `CasService` using math.js.

### IndexedDbHistoryRepository / IndexedDbVariablesRepository

Persist history and variables in IndexedDB via Dexie.

### LocalStorageSettingsRepository

Persists settings in local storage.

### BrowserFeatureDetectionService

Detects `BigInt` support at startup.

## State layer

### CalculatorUiState

The UI state shape consumed by components.

### CalculatorUiActions

The action interface implemented by the store.

### createCalculatorUiStore

Creates the Zustand store.

## Presentation layer

### CalculatorViewModel

Reads UI state and exposes prepared values to components.

### CalculatorViewModelMapper

Maps between UI state and session state.

### CalculatorKeyCommandDispatcherService

Maps a key definition to a store action.

### ExpressionEditorKeyboardService

Decides editor key behavior.

### ExpressionEditorSelectionService

Resolves the native selection range.

### ExpressionEditorCaretService

Decides whether to show the synthetic caret.

### CalculatorKeyboardShortcutRegistry

Resolves global shortcuts.

## Where to go next

- [Developer guide](/developer/architecture-overview) explains the layers.
- [Repository structure](/developer/repository-structure) maps the tree.
