import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionTextEdit } from "../../domain/services/ExpressionEditingService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

/**
 * Applies a precomputed text edit to the session state.
 *
 * The edit carries the exact text and cursor position produced by the
 * presentation insertion service, so template cursor placement and selection
 * wrapping stay out of the domain layer.
 */
export class ApplyTextEditCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(private readonly edit: ExpressionTextEdit) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return currentState.copyWith({
      expressionText: this.edit.text,
      cursorPosition: this.edit.cursorPosition,
      selectionStart: this.edit.selectionStart,
      selectionEnd: this.edit.selectionEnd,
      resultText: null,
      errorText: null,
    });
  }
}
