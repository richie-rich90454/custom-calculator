import { CalculatorSessionState } from "../model/CalculatorSessionState";
import { EvaluationResult } from "../model/EvaluationResult";

export interface ExpressionEvaluationGateway {
  evaluateExpression(
    sessionState: CalculatorSessionState
  ): EvaluationResult;
}
