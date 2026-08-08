import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";

describe("EvaluateExpressionCalculatorCommand", () => {
    const compositionRoot = new CalculatorCompositionRoot();
    const controller = compositionRoot.calculatorApplicationController;

    function evaluate(expressionText: string): CalculatorSessionState {
        const initialState = CalculatorSessionState.createInitial().copyWith({
            expressionText: expressionText,
        });

        return controller.evaluateExpression(initialState);
    }

    it("evaluates a valid expression and stores the result", () => {
        const nextState = evaluate("2+3");

        expect(nextState.resultText).toBe("5");
        expect(nextState.errorText).toBeNull();
        expect(nextState.lastResultText).toBe("5");
    });

    it("preserves the expression after evaluation", () => {
        const nextState = evaluate("sqrt(16)");

        expect(nextState.expressionText).toBe("sqrt(16)");
        expect(nextState.resultText).toBe("4");
    });

    it("automatically closes an unbalanced opening parenthesis", () => {
        const nextState = evaluate("(2+3");

        expect(nextState.expressionText).toBe("(2+3)");
        expect(nextState.resultText).toBe("5");
    });

    it("captures a division by zero error inline", () => {
        const nextState = evaluate("1/0");

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).not.toBeNull();
    });

    it("returns no result for an empty expression", () => {
        const nextState = evaluate("");

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).toBeNull();
    });
});
