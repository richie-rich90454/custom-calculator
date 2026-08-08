import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { LimitDirection } from "./CalculusBlockDescriptor";
import { DefaultNumericDifferentiationService } from "./DefaultNumericDifferentiationService";
import { DefaultNumericIntegrationService } from "./DefaultNumericIntegrationService";
import { DefaultLimitEstimationService } from "./DefaultLimitEstimationService";
import { DefaultFiniteSummationService } from "./DefaultFiniteSummationService";
import { DefaultFiniteProductService } from "./DefaultFiniteProductService";
import { MathJsCalculusExpressionEvaluator } from "../../infrastructure/calculus/MathJsCalculusExpressionEvaluator";
import { DefaultMathJsInstanceProvider } from "../../infrastructure/mathjs/DefaultMathJsInstanceProvider";

const evaluator = new MathJsCalculusExpressionEvaluator(new DefaultMathJsInstanceProvider());

describe("DefaultNumericDifferentiationService", () => {
    const service = new DefaultNumericDifferentiationService(evaluator);

    it("approximates the derivative of sine at zero", () => {
        const result = service.estimateDerivative("sin(x)", "x", 0, AngleMode.RAD);

        expect(result).toBeCloseTo(1, 3);
    });

    it("approximates the derivative of a polynomial", () => {
        const result = service.estimateDerivative("x^2", "x", 3, AngleMode.RAD);

        expect(result).toBeCloseTo(6, 3);
    });

    it("respects the angle mode for degree based sine", () => {
        const result = service.estimateDerivative("sin(x)", "x", 0, AngleMode.DEG);

        expect(result).toBeCloseTo(Math.PI / 180, 3);
    });
});

describe("DefaultNumericIntegrationService", () => {
    const service = new DefaultNumericIntegrationService(evaluator);

    it("integrates a polynomial over a unit interval", () => {
        const result = service.integrate("x^2", "x", 0, 1, AngleMode.RAD);

        expect(result).toBeCloseTo(1 / 3, 6);
    });

    it("integrates sine over half a period", () => {
        const result = service.integrate("sin(x)", "x", 0, Math.PI, AngleMode.RAD);

        expect(result).toBeCloseTo(2, 3);
    });

    it("returns zero for equal bounds", () => {
        expect(service.integrate("x", "x", 2, 2, AngleMode.RAD)).toBe(0);
    });

    it("reports a clear error for a singular endpoint", () => {
        expect(() => service.integrate("1/x^2", "x", 0, 1, AngleMode.RAD)).toThrow(
            "does not converge",
        );
    });
});

describe("DefaultLimitEstimationService", () => {
    const service = new DefaultLimitEstimationService(evaluator);

    it("estimates the classic sine ratio limit", () => {
        const result = service.estimateLimit(
            "sin(x)/x",
            "x",
            0,
            LimitDirection.BOTH,
            AngleMode.RAD,
        );

        expect(result).toEqual({ kind: "FINITE", value: expect.any(Number) });
        if (result.kind === "FINITE") {
            expect(result.value).toBeCloseTo(1, 3);
        }
    });

    it("estimates a finite limit at a regular point", () => {
        const result = service.estimateLimit("x^2", "x", 3, LimitDirection.BOTH, AngleMode.RAD);

        if (result.kind === "FINITE") {
            expect(result.value).toBeCloseTo(9, 3);
        }
    });

    it("detects a positive infinite one sided limit", () => {
        const result = service.estimateLimit("1/x", "x", 0, LimitDirection.RIGHT, AngleMode.RAD);

        expect(result).toEqual({ kind: "INFINITY", sign: 1 });
    });

    it("detects a negative infinite one sided limit", () => {
        const result = service.estimateLimit("1/x", "x", 0, LimitDirection.LEFT, AngleMode.RAD);

        expect(result).toEqual({ kind: "INFINITY", sign: -1 });
    });

    it("rejects a two sided limit that diverges to opposite infinities", () => {
        expect(() =>
            service.estimateLimit("1/x", "x", 0, LimitDirection.BOTH, AngleMode.RAD),
        ).toThrow("does not exist");
    });

    it("rejects a non convergent oscillating limit", () => {
        expect(() =>
            service.estimateLimit("sin(1/x)", "x", 0, LimitDirection.BOTH, AngleMode.RAD),
        ).toThrow("does not exist");
    });
});

describe("DefaultFiniteSummationService", () => {
    const service = new DefaultFiniteSummationService(evaluator);

    it("sums squares from one to ten", () => {
        expect(service.sum("n^2", "n", 1, 10, AngleMode.RAD)).toBeCloseTo(385);
    });

    it("rejects non integer bounds", () => {
        expect(() => service.sum("n", "n", 1.5, 10, AngleMode.RAD)).toThrow("integers");
    });

    it("rejects inverted bounds", () => {
        expect(() => service.sum("n", "n", 5, 1, AngleMode.RAD)).toThrow("lower bound");
    });

    it("rejects excessively large ranges", () => {
        expect(() => service.sum("n", "n", 1, 200000, AngleMode.RAD)).toThrow("too large");
    });
});

describe("DefaultFiniteProductService", () => {
    const service = new DefaultFiniteProductService(evaluator);

    it("computes the product of integers one through five", () => {
        expect(service.product("n", "n", 1, 5, AngleMode.RAD)).toBeCloseTo(120);
    });

    it("rejects non integer bounds", () => {
        expect(() => service.product("n", "n", 1.5, 5, AngleMode.RAD)).toThrow("integers");
    });

    it("rejects inverted bounds", () => {
        expect(() => service.product("n", "n", 5, 1, AngleMode.RAD)).toThrow("lower bound");
    });

    it("rejects excessively large ranges", () => {
        expect(() => service.product("n", "n", 1, 200000, AngleMode.RAD)).toThrow("too large");
    });
});
