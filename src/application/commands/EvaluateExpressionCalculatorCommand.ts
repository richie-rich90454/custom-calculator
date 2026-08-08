import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { CalculationError } from "../../domain/model/CalculationError";
import type { CasBlockParser } from "../cas/CasBlockParser";
import type { CasBlockDescriptor } from "../cas/CasBlockDescriptor";
import type { CasExpressionRouterService } from "../cas/CasExpressionRouterService";
import type { CasService } from "../../domain/services/CasService";
import type { CalculusBlockParser } from "../calculus/CalculusBlockParser";
import type { CalculusBlockDescriptor } from "../calculus/CalculusBlockDescriptor";
import type { CalculusExpressionRouterService } from "../calculus/CalculusExpressionRouterService";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import type { ExpressionValidationService } from "../../domain/services/ExpressionValidationService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class EvaluateExpressionCalculatorCommand extends AbstractCalculatorCommand {
    public constructor(
        private readonly expressionEditingService: ExpressionEditingService,
        private readonly expressionValidationService: ExpressionValidationService,
        private readonly expressionEvaluationGateway: ExpressionEvaluationGateway,
        private readonly casBlockParser: CasBlockParser,
        private readonly casExpressionRouterService: CasExpressionRouterService,
        private readonly casService: CasService,
        private readonly calculusBlockParser: CalculusBlockParser,
        private readonly calculusExpressionRouterService: CalculusExpressionRouterService,
    ) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        const trimmedExpression = currentState.expressionText.trim();

        if (trimmedExpression.length === 0) {
            return currentState.copyWith({
                resultText: null,
                errorText: null,
            });
        }

        const autoClosedExpression = this.expressionEditingService.autoCloseParentheses(
            currentState.expressionText,
        );

        const evaluationState = currentState.copyWith({
            expressionText: autoClosedExpression,
            cursorPosition: autoClosedExpression.length,
            selectionStart: autoClosedExpression.length,
            selectionEnd: autoClosedExpression.length,
        });

        const casBlockDescriptor = this.casBlockParser.parseBlock(autoClosedExpression);

        if (casBlockDescriptor !== null) {
            return this.routeCasBlock(evaluationState, casBlockDescriptor);
        }

        const calculusBlockDescriptor = this.calculusBlockParser.parseBlock(autoClosedExpression);

        if (calculusBlockDescriptor !== null) {
            return this.routeCalculusBlock(evaluationState, calculusBlockDescriptor);
        }

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

    private routeCasBlock(
        evaluationState: CalculatorSessionState,
        casBlockDescriptor: CasBlockDescriptor,
    ): CalculatorSessionState {
        const resolution = this.casExpressionRouterService.routeBlock(
            casBlockDescriptor,
            evaluationState.casEnabled,
            this.casService,
        );

        if (resolution.errorText !== null) {
            return evaluationState.copyWith({
                resultText: null,
                errorText: resolution.errorText,
            });
        }

        return evaluationState.copyWith({
            resultText: resolution.resultText,
            lastResultText: resolution.resultText,
            lastResultValue: null,
            errorText: null,
        });
    }

    private routeCalculusBlock(
        evaluationState: CalculatorSessionState,
        calculusBlockDescriptor: CalculusBlockDescriptor,
    ): CalculatorSessionState {
        const resolution = this.calculusExpressionRouterService.routeBlock(
            calculusBlockDescriptor,
            evaluationState.angleMode,
        );

        if (resolution.errorText !== null) {
            return evaluationState.copyWith({
                resultText: null,
                errorText: resolution.errorText,
            });
        }

        return evaluationState.copyWith({
            resultText: resolution.resultText,
            lastResultText: resolution.resultText,
            lastResultValue: null,
            errorText: null,
        });
    }
}
