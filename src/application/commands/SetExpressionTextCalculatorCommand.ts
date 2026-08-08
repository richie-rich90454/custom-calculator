import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class SetExpressionTextCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(private readonly expressionText: string) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const nextCursorPosition = this.expressionText.length;

    return currentState.copyWith({
      expressionText: this.expressionText,
      cursorPosition: nextCursorPosition,
      selectionStart: nextCursorPosition,
      selectionEnd: nextCursorPosition,
      resultText: null,
      errorText: null,
    });
  }
}
