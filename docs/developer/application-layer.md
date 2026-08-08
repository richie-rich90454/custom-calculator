---
title: Application Layer
description: "The application layer: commands, controllers, and orchestration services."
---

# Application Layer

The application layer turns user intent into domain operations. It contains the command classes, the application controller, and orchestration services.

## Location

```
src/application/
├── commands/       One command per user operation
├── controllers/    The application controller facade
├── services/       Orchestration and identifier services
├── cas/            CAS block parsing and routing
└── calculus/       Calculus block parsing and routing
```

## The controller

`CalculatorApplicationController` is the facade the UI talks to. It exposes operations such as:

- `insertDigit`, `insertOperator`, `insertFunction`
- `insertConstant`, `insertVariable`, `insertParenthesis`
- `deleteBackward`, `deleteForward`, `deleteWordBackward`
- `clearSession`, `setExpressionText`
- `evaluateExpression`
- `cycleAngleMode`, `changeNumericMode`, `toggleComplexNumbers`, `toggleCasMode`
- `saveVariable`, `deleteVariable`
- `memoryAdd`, `memorySubtract`, `memoryRecall`, `memoryClear`
- `simplifyExpression`, `expandExpression`, `differentiateExpression`

Each operation constructs the matching command and executes it.

## The command pattern

Every mutation is a command object with a single `execute` method that takes the current session state and returns the next session state.

```ts
const edit = this.expressionEditingService.insertText(
    currentState.expressionText,
    this.digit,
    currentState.selectionStart,
    currentState.selectionEnd,
);

return currentState.copyWith({
    expressionText: edit.text,
    cursorPosition: edit.cursorPosition,
    selectionStart: edit.selectionStart,
    selectionEnd: edit.selectionEnd,
});
```

See [Command pattern](/developer/command-pattern).

## CAS and calculus routing

The application layer parses `cas(...)` and calculus blocks from raw expression text and routes them to the correct engine.

- [CAS routing](/architecture/cas-routing)
- [Calculus routing](/architecture/cas-routing)

## Orchestration

`CalculatorSessionOrchestrationService` coordinates repositories for loading and saving settings, history, and variables.

## Next steps

- [Command pattern](/developer/command-pattern)
- [State management](/developer/state-management)
