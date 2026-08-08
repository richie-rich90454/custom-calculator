import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { LimitDirection } from "./CalculusBlockDescriptor";
import type { CalculusExpressionEvaluator } from "./CalculusExpressionEvaluator";
import { DefaultFiniteProductService } from "./DefaultFiniteProductService";
import { DefaultFiniteSummationService } from "./DefaultFiniteSummationService";
import { DefaultLimitEstimationService } from "./DefaultLimitEstimationService";
import { DefaultNumericDifferentiationService } from "./DefaultNumericDifferentiationService";
import { DefaultNumericIntegrationService } from "./DefaultNumericIntegrationService";

function fakeEvaluator(
    evaluate: CalculusExpressionEvaluator["evaluate"],
): CalculusExpressionEvaluator {
    return { evaluate };
}

describe("DefaultLimitEstimationService reconciliation branches", () => {
    it("returns the shared limit when both sides diverge to the same infinity", () => {
        const evaluator = fakeEvaluator((_expressionText, _variableName, value) => {
            return 1 / Math.pow(value, 2);
        });
        const service = new DefaultLimitEstimationService(evaluator);

        const estimate = service.estimateLimit("f(x)", "x", 0, LimitDirection.BOTH, AngleMode.RAD);

        expect(estimate).toEqual({ kind: "INFINITY", sign: 1 });
    });

    it("rejects a two sided limit where one side is finite and the other diverges", () => {
        const evaluator = fakeEvaluator((_expressionText, _variableName, value) => {
            return value < 0 ? 1 / value : 1;
        });
        const service = new DefaultLimitEstimationService(evaluator);

        expect(() =>
            service.estimateLimit("f(x)", "x", 0, LimitDirection.BOTH, AngleMode.RAD),
        ).toThrow("do not agree");
    });

    it("rejects a two sided limit where both sides are finite but disagree", () => {
        const evaluator = fakeEvaluator((_expressionText, _variableName, value) => {
            return value < 0 ? 0 : 5;
        });
        const service = new DefaultLimitEstimationService(evaluator);

        expect(() =>
            service.estimateLimit("f(x)", "x", 0, LimitDirection.BOTH, AngleMode.RAD),
        ).toThrow("do not agree");
    });

    it("returns an infinite one sided limit", () => {
        const evaluator = fakeEvaluator((_expressionText, _variableName, value) => {
            return 1 / value;
        });
        const service = new DefaultLimitEstimationService(evaluator);

        const estimate = service.estimateLimit("f(x)", "x", 0, LimitDirection.RIGHT, AngleMode.RAD);

        expect(estimate).toEqual({ kind: "INFINITY", sign: 1 });
    });
});

describe("DefaultNumericDifferentiationService non converging fallback", () => {
    it("returns the last estimate when convergence never settles", () => {
        const evaluator = fakeEvaluator((_expressionText, _variableName, value) => {
            return Math.sin(1 / value);
        });
        const service = new DefaultNumericDifferentiationService(evaluator);

        const estimate = service.estimateDerivative("f(x)", "x", 0, AngleMode.RAD);

        expect(Number.isFinite(estimate)).toBe(true);
    });
});

describe("DefaultNumericIntegrationService error rethrow", () => {
    it("rethrows errors that are not non finite evaluation failures", () => {
        const evaluator = fakeEvaluator(() => {
            throw new Error("unexpected failure");
        });
        const service = new DefaultNumericIntegrationService(evaluator);

        expect(() => service.integrate("f(x)", "x", 0, 1, AngleMode.RAD)).toThrow(
            "unexpected failure",
        );
    });
});

describe("DefaultFiniteSummationService bound validation branches", () => {
    const service = new DefaultFiniteSummationService(fakeEvaluator(() => 1));

    it("rejects a non integer upper bound", () => {
        expect(() => service.sum("n", "n", 1, 2.5, AngleMode.RAD)).toThrow("integers");
    });

    it("rejects an upper bound that falls below the lower bound", () => {
        expect(() => service.sum("n", "n", 5, 1, AngleMode.RAD)).toThrow("lower bound");
    });
});

describe("DefaultFiniteProductService bound validation branches", () => {
    const service = new DefaultFiniteProductService(fakeEvaluator(() => 1));

    it("rejects a non integer upper bound", () => {
        expect(() => service.product("n", "n", 1, 2.5, AngleMode.RAD)).toThrow("integers");
    });

    it("rejects an upper bound that falls below the lower bound", () => {
        expect(() => service.product("n", "n", 5, 1, AngleMode.RAD)).toThrow("lower bound");
    });
});
