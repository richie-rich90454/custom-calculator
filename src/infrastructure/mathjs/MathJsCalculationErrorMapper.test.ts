import { describe, expect, it } from "vitest";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { MathJsCalculationErrorMapper } from "./MathJsCalculationErrorMapper";

describe("MathJsCalculationErrorMapper", () => {
  const mapper = new MathJsCalculationErrorMapper();

  describe("mapParseError", () => {
    it("maps an unexpected end of expression to missing parentheses", () => {
      const error = mapper.mapParseError(
        new Error("Unexpected end of expression")
      );

      expect(error.code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
    });

    it("maps a parenthesis message to missing parentheses", () => {
      const error = mapper.mapParseError(new Error("Parenthesis ) expected"));

      expect(error.code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
    });

    it("maps any other parse message to a syntax error", () => {
      const error = mapper.mapParseError(new Error("Undefined token '?'"));

      expect(error.code).toBe(CalculationErrorCode.SYNTAX_ERROR);
      expect(error.message).toContain("Undefined token");
    });
  });

  describe("mapEvaluationError", () => {
    it("maps lowercase division by zero", () => {
      const error = mapper.mapEvaluationError(
        new Error("Division by zero")
      );

      expect(error.code).toBe(CalculationErrorCode.DIVISION_BY_ZERO);
    });

    it("maps capitalized division by zero", () => {
      const error = mapper.mapEvaluationError(
        new Error("Division by Zero")
      );

      expect(error.code).toBe(CalculationErrorCode.DIVISION_BY_ZERO);
    });

    it("maps an undefined function message", () => {
      const error = mapper.mapEvaluationError(
        new Error("Undefined function mystery")
      );

      expect(error.code).toBe(CalculationErrorCode.UNKNOWN_FUNCTION);
      expect(error.message).toContain("mystery");
    });

    it("maps an undefined symbol message", () => {
      const error = mapper.mapEvaluationError(
        new Error("Undefined symbol zz")
      );

      expect(error.code).toBe(CalculationErrorCode.UNKNOWN_VARIABLE);
      expect(error.message).toContain("zz");
    });

    it("maps an unexpected token message", () => {
      const error = mapper.mapEvaluationError(
        new Error("Unexpected token ]")
      );

      expect(error.code).toBe(CalculationErrorCode.SYNTAX_ERROR);
    });

    it("maps any other evaluation message to a generic failure", () => {
      const error = mapper.mapEvaluationError(
        new Error("Value must be positive")
      );

      expect(error.code).toBe(CalculationErrorCode.EVALUATION_FAILED);
      expect(error.message).toContain("Value must be positive");
    });
  });

  describe("extractErrorMessage", () => {
    it("uses the message of an error instance", () => {
      expect(mapper.extractErrorMessage(new Error("boom"))).toBe("boom");
    });

    it("stringifies a non error value", () => {
      expect(mapper.extractErrorMessage("raw failure")).toBe("raw failure");
    });
  });
});
