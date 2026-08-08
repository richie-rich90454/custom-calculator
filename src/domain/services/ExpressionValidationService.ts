import { CalculationError } from "../model/CalculationError";
import { CalculatorSessionState } from "../model/CalculatorSessionState";

export interface ExpressionValidationService {
  validateExpression(
    sessionState: CalculatorSessionState
  ): CalculationError | null;
}
