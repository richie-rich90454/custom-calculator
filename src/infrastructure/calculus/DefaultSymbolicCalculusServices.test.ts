import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { DefaultResultFormattingService } from "../../domain/services/DefaultResultFormattingService";
import { CalculusAngleModePolicy } from "../../application/calculus/CalculusAngleModePolicy";
import { DefaultCalculusAngleModePolicyService } from "../../application/calculus/DefaultCalculusAngleModePolicyService";
import { MathJsCalculusExpressionEvaluator } from "./MathJsCalculusExpressionEvaluator";
import { DefaultSymbolicDifferentiationService } from "./DefaultSymbolicDifferentiationService";
import { DefaultSymbolicIntegrationService } from "./DefaultSymbolicIntegrationService";
import { DefaultTaylorSeriesService } from "./DefaultTaylorSeriesService";
import { DefaultMathJsInstanceProvider } from "../mathjs/DefaultMathJsInstanceProvider";

const instanceProvider = new DefaultMathJsInstanceProvider();
const resultFormattingService = new DefaultResultFormattingService();
const angleModePolicyService = new DefaultCalculusAngleModePolicyService();
const differentiationService = new DefaultSymbolicDifferentiationService(
    instanceProvider,
    angleModePolicyService,
    resultFormattingService,
);
const integrationService = new DefaultSymbolicIntegrationService(
    instanceProvider,
    resultFormattingService,
);

describe("DefaultSymbolicDifferentiationService", () => {
    it("differentiates a polynomial in radian mode", () => {
        const result = differentiationService.differentiateSymbolically(
            "x^2",
            "x",
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toBe("2*x");
    });

    it("differentiates a sum of powers", () => {
        const result = differentiationService.differentiateSymbolically(
            "x^3 + 2*x",
            "x",
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result.replace(/\s/g, "")).toBe("3*x^2+2");
    });

    it("differentiates sine to cosine in radian mode", () => {
        const result = differentiationService.differentiateSymbolically(
            "sin(x)",
            "x",
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toBe("cos(x)");
    });

    it("ignores the angle mode under the radians only policy", () => {
        const result = differentiationService.differentiateSymbolically(
            "sin(x)",
            "x",
            AngleMode.DEG,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toBe("cos(x)");
    });

    it("applies the degree conversion factor under the angle mode aware policy", () => {
        const result = differentiationService.differentiateSymbolically(
            "sin(x)",
            "x",
            AngleMode.DEG,
            CalculusAngleModePolicy.ANGLE_MODE_AWARE,
        );

        expect(result).toContain("0.017453292519943295");
        expect(result).toContain("cos");
    });

    it("applies the gon conversion factor under the angle mode aware policy", () => {
        const result = differentiationService.differentiateSymbolically(
            "sin(x)",
            "x",
            AngleMode.GON,
            CalculusAngleModePolicy.ANGLE_MODE_AWARE,
        );

        expect(result).toContain("0.015707963267948967");
        expect(result).toContain("cos");
    });

    it("returns cosine unchanged under angle aware radian mode", () => {
        const result = differentiationService.differentiateSymbolically(
            "cos(x)",
            "x",
            AngleMode.RAD,
            CalculusAngleModePolicy.ANGLE_MODE_AWARE,
        );

        expect(result).toBe("-sin(x)");
    });

    it("leaves non trig functions untouched under angle aware mode", () => {
        const result = differentiationService.differentiateSymbolically(
            "log(x)",
            "x",
            AngleMode.DEG,
            CalculusAngleModePolicy.ANGLE_MODE_AWARE,
        );

        expect(result).toBe("1/x");
    });

    it("scales only trig functions in a mixed expression under angle aware mode", () => {
        const result = differentiationService.differentiateSymbolically(
            "x^2 + sin(x)",
            "x",
            AngleMode.DEG,
            CalculusAngleModePolicy.ANGLE_MODE_AWARE,
        );

        expect(result).toContain("0.017453292519943295");
        expect(result).toContain("2*x");
    });

    it("reports a clear error for non differentiable functions", () => {
        expect(() =>
            differentiationService.differentiateSymbolically(
                "gamma(x)",
                "x",
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(/Symbolic differentiation failed/);
    });

    it("reports a clear error for invalid input", () => {
        expect(() =>
            differentiationService.differentiateSymbolically(
                "x +",
                "x",
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(/Symbolic differentiation failed/);
    });
});

describe("DefaultSymbolicIntegrationService", () => {
    it("integrates the identity function", () => {
        expect(integrationService.integrateSymbolically("x", "x")).toBe("x^2/2");
    });

    it("integrates a squared power", () => {
        expect(integrationService.integrateSymbolically("x^2", "x")).toBe("x^3/3");
    });

    it("integrates a scaled power", () => {
        expect(integrationService.integrateSymbolically("2*x", "x")).toBe("x^2");
    });

    it("integrates sine", () => {
        expect(integrationService.integrateSymbolically("sin(x)", "x")).toBe("-cos(x)");
    });

    it("integrates cosine", () => {
        expect(integrationService.integrateSymbolically("cos(x)", "x")).toBe("sin(x)");
    });

    it("integrates the exponential function", () => {
        expect(integrationService.integrateSymbolically("exp(x)", "x")).toBe("exp(x)");
    });

    it("integrates the reciprocal function", () => {
        expect(integrationService.integrateSymbolically("1/x", "x")).toBe("log(x)");
    });

    it("integrates a sum term by term", () => {
        expect(integrationService.integrateSymbolically("x^2 + 2*x", "x")).toBe("x^3/3+x^2");
    });

    it("rejects unsupported functions with a clear error", () => {
        expect(() => integrationService.integrateSymbolically("sec(x)", "x")).toThrow(
            "Symbolic integration is not supported for this expression.",
        );
    });

    it("rejects composite function arguments with a clear error", () => {
        expect(() => integrationService.integrateSymbolically("sin(x^2)", "x")).toThrow(
            "Symbolic integration is not supported for this expression.",
        );
    });

    it("reports a clear error for invalid input", () => {
        expect(() => integrationService.integrateSymbolically("x +", "x")).toThrow(
            /Symbolic integration failed/,
        );
    });

    it("integrates a non variable symbol as a coefficient", () => {
        expect(integrationService.integrateSymbolically("a", "x")).toBe("a*x");
    });

    it("integrates a difference term by term", () => {
        expect(integrationService.integrateSymbolically("x - 1", "x")).toBe("x^2/2-x");
    });

    it("integrates a unary minus", () => {
        expect(integrationService.integrateSymbolically("-x", "x")).toBe("x^2*-1/2");
    });

    it("integrates a constant quotient", () => {
        expect(integrationService.integrateSymbolically("2/3", "x")).toBe("x*2/3");
    });

    it("integrates a reciprocal power", () => {
        expect(integrationService.integrateSymbolically("1/x^2", "x")).toBe("x^3/3");
    });

    it("rejects an inverse power as unsupported", () => {
        expect(() => integrationService.integrateSymbolically("x^-1", "x")).toThrow(
            "not supported",
        );
    });

    it("integrates a natural logarithm", () => {
        expect(integrationService.integrateSymbolically("log(x)", "x")).toBe("x*(log(x)-1)");
    });

    it("integrates the ln alias", () => {
        expect(integrationService.integrateSymbolically("ln(x)", "x")).toBe("x*(log(x)-1)");
    });

    it("integrates a square root", () => {
        expect(integrationService.integrateSymbolically("sqrt(x)", "x")).toBe("sqrt(x)^(3/2)*2/3");
    });

    it("integrates a function with no variable argument", () => {
        expect(integrationService.integrateSymbolically("sin(2)", "x")).toBe(
            "0.9092974268256817*x",
        );
    });

    it("rejects a product of two variable factors", () => {
        expect(() => integrationService.integrateSymbolically("x*x", "x")).toThrow("not supported");
    });

    it("integrates a product with the variable factor on the left", () => {
        expect(integrationService.integrateSymbolically("x*2", "x")).toBe("x^2");
    });

    it("rejects a quotient with a variable numerator", () => {
        expect(() => integrationService.integrateSymbolically("x/2", "x")).toThrow("not supported");
    });

    it("rejects a quotient whose denominator is not a power of the variable", () => {
        expect(() => integrationService.integrateSymbolically("1/(x+1)", "x")).toThrow(
            "not supported",
        );
    });

    it("integrates an unwrapped parenthesized expression", () => {
        expect(integrationService.integrateSymbolically("(x)", "x")).toBe("x^2/2");
    });

    it("rejects an unsupported operator", () => {
        expect(() => integrationService.integrateSymbolically("x mod 2", "x")).toThrow(
            "not supported",
        );
    });

    it("rejects a non operator node type", () => {
        expect(() => integrationService.integrateSymbolically("[1]", "x")).toThrow("not supported");
    });

    it("rejects a power with a non symbol base", () => {
        expect(() => integrationService.integrateSymbolically("2^x", "x")).toThrow("not supported");
    });

    it("rejects a function with multiple arguments", () => {
        expect(() => integrationService.integrateSymbolically("sin(x, 2)", "x")).toThrow(
            "not supported",
        );
    });

    it("rejects a function whose argument is not the variable", () => {
        expect(() => integrationService.integrateSymbolically("sin(x^2)", "x")).toThrow(
            "not supported",
        );
    });
});

describe("DefaultTaylorSeriesService", () => {
    const taylorService = new DefaultTaylorSeriesService(
        instanceProvider,
        differentiationService,
        new MathJsCalculusExpressionEvaluator(instanceProvider),
        resultFormattingService,
    );

    it("expands sine about zero to the requested order", () => {
        const result = taylorService.expand(
            "sin(x)",
            "x",
            0,
            5,
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result.replace(/\s/g, "")).toContain("x");
        expect(result.replace(/\s/g, "")).toContain("x^5/120");
    });

    it("expands the exponential function about zero", () => {
        const result = taylorService.expand(
            "exp(x)",
            "x",
            0,
            4,
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result.replace(/\s/g, "")).toContain("x^2/2");
        expect(result.replace(/\s/g, "")).toContain("x^4/24");
    });

    it("returns the function value as the order zero polynomial", () => {
        const result = taylorService.expand(
            "exp(x)",
            "x",
            0,
            0,
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toBe("1");
    });

    it("rejects an order beyond the maximum", () => {
        expect(() =>
            taylorService.expand(
                "sin(x)",
                "x",
                0,
                30,
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(/order is too large/);
    });

    it("reports a clear error when the expression is not analytic at the center", () => {
        expect(() =>
            taylorService.expand(
                "1/x",
                "x",
                0,
                3,
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(/Taylor series could not be computed/);
    });

    it("falls back to a decimal coefficient for non rational values", () => {
        const result = taylorService.expand(
            "exp(x)",
            "x",
            1,
            2,
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toContain("(");
        expect(result).toContain("e+8");
    });
});
