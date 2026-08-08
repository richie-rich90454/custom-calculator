import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { DefaultMathJsInstanceProvider } from "../mathjs/DefaultMathJsInstanceProvider";
import { MathJsCalculusExpressionEvaluator } from "./MathJsCalculusExpressionEvaluator";

describe("MathJsCalculusExpressionEvaluator", () => {
  const evaluator = new MathJsCalculusExpressionEvaluator(
    new DefaultMathJsInstanceProvider()
  );

  it("evaluates a plain expression at a point", () => {
    expect(evaluator.evaluate("x^2", "x", 3, AngleMode.RAD)).toBeCloseTo(9);
  });

  it("respects the active angle mode for sine", () => {
    expect(evaluator.evaluate("sin(x)", "x", 90, AngleMode.DEG)).toBeCloseTo(1);
    expect(evaluator.evaluate("sin(x)", "x", Math.PI / 2, AngleMode.RAD)).toBeCloseTo(
      1
    );
  });

  it("respects the active angle mode for gons", () => {
    expect(evaluator.evaluate("cos(x)", "x", 100, AngleMode.GON)).toBeCloseTo(0);
  });

  it("supports multiple variables through constants", () => {
    expect(evaluator.evaluate("x + 2", "x", 4, AngleMode.RAD)).toBeCloseTo(6);
  });

  it("throws a clear error for non finite results", () => {
    expect(() => evaluator.evaluate("1/x", "x", 0, AngleMode.RAD)).toThrow(
      "non finite"
    );
  });

  it("throws a clear error for invalid expressions", () => {
    expect(() => evaluator.evaluate("x +", "x", 1, AngleMode.RAD)).toThrow(
      "evaluation failed"
    );
  });
});
