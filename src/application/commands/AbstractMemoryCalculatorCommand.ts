import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { EvaluationResult } from "../../domain/model/EvaluationResult";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export abstract class AbstractMemoryCalculatorCommand extends AbstractCalculatorCommand {
    protected constructor(
        protected readonly expressionEvaluationGateway: ExpressionEvaluationGateway,
    ) {
        super();
    }

    protected evaluateMemoryExpression(
        currentState: CalculatorSessionState,
        memoryValueText: string | null,
        resultText: string,
        operator: string,
    ): EvaluationResult | null {
        const memoryOperand = memoryValueText === null ? "0" : memoryValueText;
        const expressionText = `(${memoryOperand}) ${operator} (${resultText})`;

        const evaluationState = currentState.copyWith({
            expressionText: expressionText,
            resultText: null,
            errorText: null,
        });

        try {
            return this.expressionEvaluationGateway.evaluateExpression(evaluationState);
        } catch {
            return null;
        }
    }
}
