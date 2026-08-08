---
title: Command Pattern
description: How the command pattern models every user mutation.
---

# Command Pattern

Every mutation in the calculator is modeled as a command object. Commands keep
the controller small and make each operation independently testable.

## The command shape

Commands extend `AbstractCalculatorCommand` and implement a single `execute`
method that transforms session state:

```ts
export class InsertDigitCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(
    private readonly expressionEditingService: ExpressionEditingService,
    private readonly digit: string
  ) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const edit = this.expressionEditingService.insertText(
      currentState.expressionText,
      this.digit,
      currentState.selectionStart,
      currentState.selectionEnd
    );

    return currentState.copyWith({
      expressionText: edit.text,
      cursorPosition: edit.cursorPosition,
      selectionStart: edit.selectionStart,
      selectionEnd: edit.selectionEnd,
      resultText: null,
      errorText: null,
    });
  }
}
```

## Command families

| Family | Commands |
| ------ | -------- |
| Insertion | `InsertDigit`, `InsertOperator`, `InsertFunction`, `InsertConstant`, `InsertVariable`, `InsertParenthesis` |
| Deletion | `DeleteBackward`, `DeleteForward`, `DeleteWordBackward` |
| Session | `ClearSession`, `SetExpressionText` |
| Evaluation | `EvaluateExpression` |
| Mode | `CycleAngleMode`, `ChangeNumericMode`, `ToggleComplexNumbers`, `ToggleCasMode` |
| Memory | `MemoryAdd`, `MemorySubtract`, `MemoryRecall`, `MemoryClear` |
| Variables | `SaveVariable`, `DeleteVariable` |
| CAS | `SimplifyExpression`, `ExpandExpression`, `DifferentiateExpression` |

## Why commands

- Each operation is a focused class with one responsibility.
- State transitions are explicit and testable.
- The controller is a thin facade.
- New operations are added without touching existing commands.

## Session state is immutable

`CalculatorSessionState` is immutable. Commands return a new state via
`copyWith`, never mutating the input.

## Next steps

- [Adding a function](/developer/adding-a-function)
- [Application layer](/developer/application-layer)
