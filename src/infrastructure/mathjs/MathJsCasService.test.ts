import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";

describe("MathJsCasService operation failures", () => {
  const root = new CalculatorCompositionRoot();
  const casService = root.casService;

  it("maps an operation stage failure to a calculation error", () => {
    expect(() => casService.differentiateExpression("sin(x)", "0")).toThrowError(
      "Symbolic operation failed"
    );
  });

  it("maps a parse stage failure to a calculation error", () => {
    expect(() => casService.simplifyExpression("2**")).toThrowError(
      "Symbolic operation failed"
    );
  });
});
