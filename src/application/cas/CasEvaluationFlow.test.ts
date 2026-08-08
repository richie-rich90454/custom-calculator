import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";

describe("CAS evaluation flow", () => {
    const compositionRoot = new CalculatorCompositionRoot();
    const controller = compositionRoot.calculatorApplicationController;

    function evaluate(expressionText: string, casEnabled: boolean): CalculatorSessionState {
        const initialState = CalculatorSessionState.createInitial().copyWith({
            expressionText: expressionText,
            casEnabled: casEnabled,
        });

        return controller.evaluateExpression(initialState);
    }

    it("reports a clear error when evaluating cas() with CAS disabled", () => {
        const nextState = evaluate("cas(x+x)", false);

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).toBe("CAS is disabled.");
    });

    it("simplifies a cas block when CAS is enabled", () => {
        const nextState = evaluate("cas(x+x)", true);

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("2*x");
    });

    it("expands a casExpand block when CAS is enabled", () => {
        const nextState = evaluate("casExpand((x+1)^2)", true);

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("x^2+2*x+1");
    });

    it("differentiates a casDerivative block when CAS is enabled", () => {
        const nextState = evaluate("casDerivative(x^2+x, x)", true);

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("2*x+1");
    });

    it("routes CAS before numeric evaluation so numeric mode never processes blocks", () => {
        const nextState = evaluate("cas(2+3)", false);

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).toBe("CAS is disabled.");
    });

    it("keeps a plain expression numeric even when CAS is enabled", () => {
        const nextState = evaluate("2+3", true);

        expect(nextState.resultText).toBe("5");
    });

    it("surfaces CAS engine errors inline", () => {
        const nextState = evaluate("cas(1/)", true);

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).not.toBeNull();
    });
});
