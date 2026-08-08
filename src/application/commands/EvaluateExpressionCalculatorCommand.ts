import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { CalculationError } from "../../domain/model/CalculationError";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import type { ExpressionValidationService } from "../../domain/services/ExpressionValidationService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class EvaluateExpressionCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(
    private readonly expressionEditingService: ExpressionEditingService,
    private readonly expressionValidationService: ExpressionValidationService,
    private readonly expressionEvaluationGateway: ExpressionEvaluationGateway
  ) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const trimmedExpression = currentState.expressionText.trim();

    if (trimmedExpression.length === 0) {
      return currentState.copyWith({
        resultText: null,
        errorText: null,
      });
    }

    const autoClosedExpression =
      this.expressionEditingService.autoCloseParentheses(currentState.expressionText);

    const evaluationState = currentState.copyWith({
      expressionText: autoClosedExpression,
      cursorPosition: autoClosedExpression.length,
      selectionStart: autoClosedExpression.length,
      selectionEnd: autoClosedExpression.length,
    });

    const validationError =
      this.expressionValidationService.validateExpression(evaluationState);

    if (validationError !== null) {
      return evaluationState.copyWith({
        resultText: null,
        errorText: validationError.message,
      });
    }

    try {
      const evaluationResult =
        this.expressionEvaluationGateway.evaluateExpression(evaluationState);

      return evaluationState.copyWith({
        resultText: evaluationResult.resultText,
        lastResultText: evaluationResult.resultText,
        lastResultValue: evaluationResult.rawValue,
        errorText: null,
      });
    } catch (error) {
      if (error instanceof CalculationError) {
        return evaluationState.copyWith({
          resultText: null,
          errorText: error.message,
        });
      }

      return evaluationState.copyWith({
        resultText: null,
        errorText: "Evaluation failed unexpectedly.",
      });
    }
  }
}
