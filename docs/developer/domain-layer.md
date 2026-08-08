---
title: Domain Layer
description: The domain layer, its models, services, and repositories.
---

# Domain Layer

The domain layer holds the pure TypeScript model of the calculator: session
state, editing rules, validation, formatting, and the service interfaces the
rest of the application depends on.

## Location

```
src/domain/
├── model/       Domain models
├── repositories/  Repository interfaces
└── services/    Domain service interfaces and default implementations
```

## Models

- `CalculatorSessionState` — the immutable session state passed through every
  command.
- `CalculatorSettings` — persisted settings.
- `AngleMode`, `NumericMode`, `ThemePreference` — value enums.
- `EvaluationResult`, `FailedEvaluationResult`, `NumericEvaluationResult`,
  `SymbolicEvaluationResult` — evaluation outcomes.
- `MemoryRegister` — the memory register value.
- `VariableAssignment` — a saved variable.
- `HistoryEntry` — a history record.
- `ScientificConstant` — a constant catalog entry.
- `CalculationError` / `CalculationErrorCode` — typed errors.

## Services

- `ExpressionEditingService` — insertion and smart deletion rules.
- `ExpressionValidationService` — validation of expressions.
- `ExpressionEvaluationGateway` — the interface to the math engine.
- `NumericModePolicyService` — which numeric modes are supported.
- `ResultFormattingService` — formatting numbers and results.
- `ScientificFunctionCatalogService` — the function catalog.
- `ConstantCatalogService` — the constant catalog.
- `AngleConversionService` — angle conversions.
- `CasService` — symbolic operations.

## Repositories

- `HistoryRepository`
- `VariablesRepository`
- `SettingsRepository`
- `ScientificConstantRepository`

## Dependency rule

The domain layer has no external dependencies. It does not import React,
math.js, or browser APIs. This keeps the core logic trivially testable.

## Testability

Because domain services are pure, they are covered by direct unit tests with no
DOM. See [Testing guide](/developer/testing-guide).

## Next steps

- [Application layer](/developer/application-layer) consumes these services.
- [Expression editing model](/architecture/expression-editing-model) explains
  the editing service.
