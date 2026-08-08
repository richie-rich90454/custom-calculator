---
title: Infrastructure Layer
description: "The infrastructure layer: the math.js gateway, persistence, feature detection, and data modules."
---

# Infrastructure Layer

The infrastructure layer implements the external boundaries of the
application: the math.js engine, persistence, feature detection, and static
data catalogs.

## Location

```
src/infrastructure/
├── mathjs/             math.js gateway and helpers
├── calculus/           Symbolic calculus implementations
├── constants/          Static constant data and repository
├── functions/          Function definition data modules
├── featuredetection/   BigInt and browser feature detection
└── persistence/        IndexedDB, local storage, and in-memory repositories
```

## math.js gateway

All math.js usage lives under `src/infrastructure/mathjs`.

- `MathJsInstanceProvider` — creates the math.js instance.
- `MathJsExpressionEvaluationGateway` — implements `ExpressionEvaluationGateway`.
- `MathJsFunctionWhitelist` — restricts which functions may be called.
- `MathJsConstantScopeBuilder` — builds the evaluation scope from constants.
- `MathJsCalculationErrorMapper` — maps engine errors to typed errors.
- `MathJsCasService` — implements `CasService` for symbolic operations.

## Security boundary

The math.js gateway is the security boundary for evaluation.

- The expression is parsed through the math.js parser, never through `eval` or
  `new Function`.
- A function allowlist limits which functions the engine may call.
- User input is treated as untrusted.

See [Security policy](/developer/security-policy).

## Feature detection

`BrowserFeatureDetectionService` detects `BigInt` support at startup. The
numeric mode policy uses the result to expose or hide BigInt mode.

## Persistence

- `IndexedDbHistoryRepository` — history in IndexedDB.
- `IndexedDbVariablesRepository` — variables in IndexedDB.
- `LocalStorageSettingsRepository` — settings in local storage.
- `InMemoryHistoryRepository` / `InMemoryVariablesRepository` — fallbacks when
  storage is unavailable.

## Static data

- `scientificFunctionDefinitionRegistry` — all function definitions.
- `constantRegistry` — all constants, aggregated by category.

## Next steps

- [Adding a function](/developer/adding-a-function) explains function data.
- [Persistence](/architecture/persistence) explains storage flows.
