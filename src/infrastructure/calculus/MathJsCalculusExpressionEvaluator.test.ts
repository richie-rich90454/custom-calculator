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

  it("returns the input unchanged under radian mode", () => {
    expect(evaluator.evaluate("sin(x)", "x", 0, AngleMode.RAD)).toBeCloseTo(0);
  });

  it("applies the inverse sine conversion", () => {
    expect(evaluator.evaluate("asin(x)", "x", 1, AngleMode.DEG)).toBeCloseTo(90);
  });

  it("applies the inverse cosine conversion", () => {
    expect(evaluator.evaluate("acos(x)", "x", 0, AngleMode.DEG)).toBeCloseTo(90);
  });

  it("applies the inverse tangent conversion", () => {
    expect(evaluator.evaluate("atan(x)", "x", 1, AngleMode.DEG)).toBeCloseTo(45);
  });

  it("applies the inverse sine conversion in gons", () => {
    expect(evaluator.evaluate("asin(x)", "x", 1, AngleMode.GON)).toBeCloseTo(100);
  });

  it("applies the tangent conversion", () => {
    expect(evaluator.evaluate("tan(x)", "x", 45, AngleMode.DEG)).toBeCloseTo(1);
  });

  it("applies the inverse cosine conversion in gons", () => {
    expect(evaluator.evaluate("acos(x)", "x", 0, AngleMode.GON)).toBeCloseTo(100);
  });

  it("applies the inverse tangent conversion in gons", () => {
    expect(evaluator.evaluate("atan(x)", "x", 1, AngleMode.GON)).toBeCloseTo(50);
  });

  it("stringifies a non error thrown value", () => {
    const throwingEvaluator = new MathJsCalculusExpressionEvaluator({
      getInstance: () => {
        const math = new DefaultMathJsInstanceProvider().getInstance();

        return new Proxy(math, {
          get(target, property) {
            if (property === "evaluate") {
              return () => {
                throw "raw failure";
              };
            }

            return Reflect.get(target, property);
          },
        }) as never;
      },
    });

    expect(() =>
      throwingEvaluator.evaluate("x", "x", 1, AngleMode.RAD)
    ).toThrow("raw failure");
  });
});
