import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";

function buildGateway(): ExpressionEvaluationGateway {
    return new CalculatorCompositionRoot().expressionEvaluationGateway;
}

function evaluateExpression(
    gateway: ExpressionEvaluationGateway,
    expressionText: string,
    overrides: Partial<CalculatorSessionState> = {},
) {
    const initialState = CalculatorSessionState.createInitial().copyWith({
        expressionText: expressionText,
        ...overrides,
    });

    return gateway.evaluateExpression(initialState);
}

describe("MathJsExpressionEvaluationGateway", () => {
    const gateway = buildGateway();

    it("evaluates a basic addition", () => {
        expect(evaluateExpression(gateway, "2+3").resultText).toBe("5");
    });

    it("evaluates a compound scientific expression", () => {
        expect(evaluateExpression(gateway, "sqrt(16)*2").resultText).toBe("8");
    });

    it("removes floating-point noise in standard mode", () => {
        expect(evaluateExpression(gateway, "0.1+0.2").resultText).toBe("0.3");
    });

    it("evaluates exactly in exact decimal mode", () => {
        const result = evaluateExpression(gateway, "0.1+0.2", {
            numericMode: NumericMode.EXACT_DECIMAL,
        });

        expect(result.resultText).toBe("0.3");
    });

    it("produces exact fractions in fraction mode", () => {
        const result = evaluateExpression(gateway, "1/3+1/6", {
            numericMode: NumericMode.FRACTION,
        });

        expect(result.resultText).toBe("1/2");
    });

    it("evaluates large integers in BigInt mode", () => {
        const result = evaluateExpression(gateway, "123456789012345678901234567890*2", {
            numericMode: NumericMode.BIGINT,
        });

        expect(result.resultText).toBe("246913578024691357802469135780");
    });

    it("rejects non-integer results in BigInt mode", () => {
        expect(() =>
            evaluateExpression(gateway, "1.5+1", { numericMode: NumericMode.BIGINT }),
        ).toThrowError(CalculationError);
    });

    it("respects the active angle mode for degrees", () => {
        const result = evaluateExpression(gateway, "sin(30)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("0.5");
    });

    it("applies the degree angle mode to cosine", () => {
        const result = evaluateExpression(gateway, "cos(60)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("0.5");
    });

    it("applies the degree angle mode to tangent", () => {
        const result = evaluateExpression(gateway, "tan(45)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("1");
    });

    it("applies the degree angle mode to inverse sine", () => {
        const result = evaluateExpression(gateway, "asin(0.5)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("30");
    });

    it("applies the degree angle mode to inverse cosine", () => {
        const result = evaluateExpression(gateway, "acos(0.5)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("60");
    });

    it("applies the degree angle mode to inverse tangent", () => {
        const result = evaluateExpression(gateway, "atan(1)", {
            angleMode: AngleMode.DEG,
        });

        expect(result.resultText).toBe("45");
    });

    it("respects the active angle mode for radians", () => {
        const result = evaluateExpression(gateway, "sin(pi/6)", {
            angleMode: AngleMode.RAD,
        });

        expect(Number(result.resultText)).toBeCloseTo(0.5, 10);
    });

    it("respects the active angle mode for gons", () => {
        const result = evaluateExpression(gateway, "sin(50)", {
            angleMode: AngleMode.GON,
        });

        expect(Number(result.resultText)).toBeCloseTo(Math.SQRT1_2, 8);
    });

    it("returns the imaginary unit for sqrt of negative one when complex is enabled", () => {
        const result = evaluateExpression(gateway, "sqrt(-1)", {
            complexNumbersEnabled: true,
        });

        expect(result.resultText).toBe("i");
    });

    it("reports a domain error for sqrt of negative one when complex is disabled", () => {
        expect(() => evaluateExpression(gateway, "sqrt(-1)")).toThrowError(CalculationError);
    });

    it("reports a domain error for the logarithm of zero", () => {
        expect(() => evaluateExpression(gateway, "log(0)")).toThrowError(CalculationError);
    });

    it("reports a domain error for the logarithm of a negative value", () => {
        expect(() => evaluateExpression(gateway, "log(-5)")).toThrowError(CalculationError);
    });

    it("reports a division by zero error", () => {
        try {
            evaluateExpression(gateway, "1/0");
            expect.unreachable();
        } catch (error) {
            expect(error).toBeInstanceOf(CalculationError);
            expect((error as CalculationError).code).toBe(CalculationErrorCode.DIVISION_BY_ZERO);
        }
    });

    it("reports an unknown function error", () => {
        try {
            evaluateExpression(gateway, "notAFunction(2)");
            expect.unreachable();
        } catch (error) {
            expect(error).toBeInstanceOf(CalculationError);
            expect((error as CalculationError).code).toBe(CalculationErrorCode.UNKNOWN_FUNCTION);
        }
    });

    it("reports an unknown variable error", () => {
        try {
            evaluateExpression(gateway, "2+unknownVariable");
            expect.unreachable();
        } catch (error) {
            expect(error).toBeInstanceOf(CalculationError);
            expect((error as CalculationError).code).toBe(CalculationErrorCode.UNKNOWN_VARIABLE);
        }
    });

    it("evaluates constants from the catalog", () => {
        expect(Number(evaluateExpression(gateway, "speedOfLight").resultText)).toBe(299792458);
    });

    it("evaluates pi", () => {
        expect(Number(evaluateExpression(gateway, "pi").resultText)).toBeCloseTo(Math.PI, 12);
    });

    it("treats exponentiation as right associative", () => {
        expect(Number(evaluateExpression(gateway, "2^3^2").resultText)).toBe(512);
    });

    it("supports implicit multiplication", () => {
        expect(Number(evaluateExpression(gateway, "2pi").resultText)).toBeCloseTo(2 * Math.PI, 10);
    });

    it("resolves user variables from the session", () => {
        const result = evaluateExpression(gateway, "x+1", {
            expressionText: "x+1",
            variables: [
                new VariableAssignment("x", "4", NumericMode.STANDARD, new Date().toISOString()),
            ],
        });

        expect(result.resultText).toBe("5");
    });

    it("resolves the previous answer symbol", () => {
        const result = evaluateExpression(gateway, "ans*2", {
            lastResultValue: 21,
        });

        expect(result.resultText).toBe("42");
    });

    it("reports an overflow for a non-finite result", () => {
        expect(() => evaluateExpression(gateway, "1e308*10")).toThrowError(CalculationError);
    });

    it("reports a missing parentheses error for an incomplete expression", () => {
        try {
            evaluateExpression(gateway, "2+");
            expect.unreachable();
        } catch (error) {
            expect((error as CalculationError).code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
        }
    });

    it("reports a missing parentheses error for unbalanced parentheses", () => {
        try {
            evaluateExpression(gateway, "(2+3");
            expect.unreachable();
        } catch (error) {
            expect((error as CalculationError).code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
        }
    });

    it("reports a syntax error for an unexpected token", () => {
        try {
            evaluateExpression(gateway, "2+*3");
            expect.unreachable();
        } catch (error) {
            expect((error as CalculationError).code).toBe(CalculationErrorCode.SYNTAX_ERROR);
        }
    });

    it("reports a generic evaluation failure for an unsupported operation", () => {
        try {
            evaluateExpression(gateway, "factorial(-1)");
            expect.unreachable();
        } catch (error) {
            expect((error as CalculationError).code).toBe(CalculationErrorCode.EVALUATION_FAILED);
        }
    });

    it("reports a domain error for a square root of a negative number", () => {
        expect(() => evaluateExpression(gateway, "sqrt(-4)")).toThrowError(CalculationError);
    });
});
