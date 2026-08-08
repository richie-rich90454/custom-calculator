import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import { AbstractMemoryCalculatorCommand } from "./AbstractMemoryCalculatorCommand";

export class MemorySubtractCalculatorCommand extends AbstractMemoryCalculatorCommand {
    public constructor(expressionEvaluationGateway: ExpressionEvaluationGateway) {
        super(expressionEvaluationGateway);
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        if (currentState.resultText === null) {
            return currentState;
        }

        const evaluationResult = this.evaluateMemoryExpression(
            currentState,
            currentState.memoryValueText,
            currentState.resultText,
            "-",
        );

        if (evaluationResult === null) {
            return currentState;
        }

        return currentState.copyWith({
            memoryValueText: evaluationResult.resultText,
            errorText: null,
        });
    }
}
