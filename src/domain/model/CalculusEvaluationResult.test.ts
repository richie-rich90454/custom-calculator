import { describe, expect, it } from "vitest";
import { FailedEvaluationResult } from "./FailedEvaluationResult";
import { NumericEvaluationResult } from "./NumericEvaluationResult";
import { SymbolicEvaluationResult } from "./SymbolicEvaluationResult";

describe("NumericEvaluationResult", () => {
    it("exposes the numeric text and value", () => {
        const result = new NumericEvaluationResult("0.333333333333", 0.333333333333);

        expect(result.numericText).toBe("0.333333333333");
        expect(result.numericValue).toBeCloseTo(0.333333333333);
        expect(result.expressionText).toBe("0.333333333333");
        expect(result.rawValue).toBe(0.333333333333);
    });
});

describe("SymbolicEvaluationResult", () => {
    it("exposes the symbolic, LaTeX, and display text", () => {
        const result = new SymbolicEvaluationResult("2*x", "2 \\cdot x", "2x");

        expect(result.symbolicText).toBe("2*x");
        expect(result.latexText).toBe("2 \\cdot x");
        expect(result.displayText).toBe("2x");
        expect(result.resultText).toBe("2x");
        expect(result.rawValue).toBe("2*x");
    });
});

describe("FailedEvaluationResult", () => {
    it("exposes the failed expression and message", () => {
        const result = new FailedEvaluationResult(
            "integrate(sec(x), x)",
            "Symbolic integration is not supported for this expression.",
        );

        expect(result.failedExpressionText).toBe("integrate(sec(x), x)");
        expect(result.failureMessage).toBe(
            "Symbolic integration is not supported for this expression.",
        );
        expect(result.resultText).toBe(
            "Symbolic integration is not supported for this expression.",
        );
        expect(result.rawValue).toBeNull();
    });
});
