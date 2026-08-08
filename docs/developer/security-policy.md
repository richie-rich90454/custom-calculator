---
title: Security Policy
description: How the calculator handles untrusted input, the math engine boundary, and dependencies.
---

# Security Policy

The calculator treats user input as untrusted and confines evaluation to a
controlled math engine boundary.

## No arbitrary code execution

- Expressions are parsed through the math.js parser.
- `eval` and `new Function` are never used.
- There is no arbitrary code execution path.

## The math.js gateway

All math.js usage is confined to `src/infrastructure/mathjs`.

- `MathJsExpressionEvaluationGateway` is the only evaluation entry point.
- `MathJsFunctionWhitelist` limits which functions the engine may call to the
  registered function catalog.
- `MathJsConstantScopeBuilder` builds a controlled evaluation scope.
- `MathJsCalculationErrorMapper` converts engine errors to typed errors.

## Controlled scope

The evaluation scope contains only the constants and variables the calculator
manages. Untrusted names cannot reach global objects.

## Rendering safety

- React escapes rendered strings.
- Expressions are displayed as plain text in the input.
- No markup is injected from user input.

## Dependencies

- Dependencies are pinned in lockfiles.
- Supply chain health is reviewed before adding dependencies.

## Reporting a vulnerability

See [Security](/project/security) for reporting guidance.

## Next steps

- [Infrastructure layer](/developer/infrastructure-layer)
- [Performance](/developer/performance)
