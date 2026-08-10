import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";

describe("calculus evaluation flow", () => {
    const compositionRoot = new CalculatorCompositionRoot();
    const controller = compositionRoot.calculatorApplicationController;

    function evaluate(
        expressionText: string,
        angleMode: AngleMode = AngleMode.DEG,
    ): CalculatorSessionState {
        const initialState = CalculatorSessionState.createInitial().copyWith({
            expressionText: expressionText,
            angleMode: angleMode,
        });

        return controller.evaluateExpression(initialState);
    }

    it("differentiates a symbolic block", () => {
        const nextState = evaluate("derivative(x^2, x)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("2*x");
    });

    it("differentiates with a default variable when omitted", () => {
        const nextState = evaluate("derivative(x^3)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("3*x^2");
    });

    it("integrates a symbolic block", () => {
        const nextState = evaluate("integrate(x, x)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("x^2/2");
    });

    it("computes a definite integral", () => {
        const nextState = evaluate("integral(x^2, x, 0, 1)");

        expect(nextState.errorText).toBeNull();
        expect(Number(nextState.resultText)).toBeCloseTo(1 / 3, 6);
    });

    it("estimates a limit", () => {
        const nextState = evaluate("limit(sin(x)/x, x, 0)", AngleMode.RAD);

        expect(nextState.errorText).toBeNull();
        expect(Number(nextState.resultText)).toBeCloseTo(1, 3);
    });

    it("expands a taylor series", () => {
        const nextState = evaluate("taylor(sin(x), x, 0, 5)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toContain("x^5/120");
    });

    it("sums a finite series", () => {
        const nextState = evaluate("sum(n^2, n, 1, 10)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("385");
    });

    it("computes a finite product", () => {
        const nextState = evaluate("product(n, n, 1, 5)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("120");
    });

    it("warns for symbolic calculus under a non radian angle mode", () => {
        const nextState = evaluate("derivative(x^2, x)", AngleMode.DEG);

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("2*x");
    });

    it("surfaces symbolic errors inline", () => {
        const nextState = evaluate("integrate(sec(x), x)");

        expect(nextState.resultText).toBeNull();
        expect(nextState.errorText).toContain("not supported");
    });

    it("routes calculus blocks before numeric evaluation", () => {
        const nextState = evaluate("sum(n, n, 1, 3)");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("6");
    });

    it("keeps plain expressions numeric", () => {
        const nextState = evaluate("2+3");

        expect(nextState.errorText).toBeNull();
        expect(nextState.resultText).toBe("5");
    });

    it("converts trig arguments from degrees in numeric calculus", () => {
        const radiansState = evaluate("numericDerivative(sin(x), x, 0)", AngleMode.RAD);
        const degreesState = evaluate("numericDerivative(sin(x), x, 0)", AngleMode.DEG);

        expect(radiansState.errorText).toBeNull();
        expect(degreesState.errorText).toBeNull();

        const radiansValue = Number(radiansState.resultText);
        const degreesValue = Number(degreesState.resultText);

        expect(degreesValue / radiansValue).toBeCloseTo(Math.PI / 180, 6);
    });

    it("converts trig arguments from gons in numeric calculus", () => {
        const radiansState = evaluate("numericDerivative(sin(x), x, 0)", AngleMode.RAD);
        const gonsState = evaluate("numericDerivative(sin(x), x, 0)", AngleMode.GON);

        expect(radiansState.errorText).toBeNull();
        expect(gonsState.errorText).toBeNull();

        const radiansValue = Number(radiansState.resultText);
        const gonsValue = Number(gonsState.resultText);

        expect(gonsValue / radiansValue).toBeCloseTo(Math.PI / 200, 6);
    });
});
