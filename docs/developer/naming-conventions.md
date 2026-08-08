---
title: Naming Conventions
description: The naming conventions used across the repository.
---

# Naming Conventions

The repository follows Java-flavored TypeScript naming conventions.

## Files

- Class and interface files use the class name: `DefaultExpressionEditingService.ts`.
- Component files use the component name: `CalculatorKeypadComponent.tsx`.
- Test files mirror the source file: `DefaultExpressionEditingService.test.ts`.

## Classes and interfaces

- Interfaces are named for what they describe: `ExpressionEditingService`,
  `CalculatorApplicationController`.
- Abstract classes are prefixed with `Abstract`: `AbstractCalculatorCommand`.
- Default implementations are prefixed with `Default`:
  `DefaultExpressionEditingService`.
- Concrete classes describe their role: `MathJsExpressionEvaluationGateway`.

## Components

- Components are suffixed with `Component`: `CalculatorShellComponent`,
  `AccessibleButtonComponent`.
- Props interfaces are suffixed with `Properties`:
  `CalculatorKeypadComponentProperties`.

## Types and models

- Interfaces use `readonly` modifiers on properties.
- Models are classes with `readonly` public fields and a `copyWith` method.

## Variables

- Use long, explicit names over abbreviations.
- Avoid single-letter names except for math variables and indices.
- Booleans read as questions: `isExcludedFromTabOrder`, `casEnabled`.

## American English

Use American English spellings in every identifier: `behavior`, `color`,
`customize`, `initialize`, `organization`, `license`.

## Enums

- Enum values are `UPPER_SNAKE_CASE`.
- Enum names are `UpperCamelCase`.

## Next steps

- [Code style guide](/developer/code-style-guide)
- [Repository structure](/developer/repository-structure)
