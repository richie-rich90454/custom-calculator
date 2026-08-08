import { describe, expect, it } from "vitest";
import { CalculusOperationKind } from "./CalculusOperationKind";
import { LimitDirection } from "./CalculusBlockDescriptor";
import { DefaultCalculusBlockParser } from "./DefaultCalculusBlockParser";

describe("DefaultCalculusBlockParser", () => {
  const parser = new DefaultCalculusBlockParser();

  it("returns null for non calculus expressions", () => {
    expect(parser.parseBlock("2 + 2")).toBeNull();
    expect(parser.parseBlock("sin(x)")).toBeNull();
    expect(parser.parseBlock("")).toBeNull();
    expect(parser.parseBlock("derivative()")).toBeNull();
  });

  it("parses derivative expressions with a variable", () => {
    const block = parser.parseBlock("derivative(x^2, x)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.DERIVATIVE);
    expect(block.innerExpressionText).toBe("x^2");
    expect(block.variableName).toBe("x");
  });

  it("parses the diff alias", () => {
    const block = parser.parseBlock("diff(sin(x), t)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.DERIVATIVE);
    expect(block.innerExpressionText).toBe("sin(x)");
    expect(block.variableName).toBe("t");
  });

  it("defaults the derivative variable to x", () => {
    const block = parser.parseBlock("derivative(x^3)")!;

    expect(block.variableName).toBe("x");
  });

  it("parses numeric derivative expressions", () => {
    const block = parser.parseBlock("numericDerivative(sin(x), x, 0)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.NUMERIC_DERIVATIVE);
    expect(block.limitTarget).toBe(0);
  });

  it("parses the nderivative alias", () => {
    const block = parser.parseBlock("nderivative(cos(x), x, 1)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.NUMERIC_DERIVATIVE);
    expect(block.limitTarget).toBe(1);
  });

  it("rejects a numeric derivative with a non numeric point", () => {
    expect(() => parser.parseBlock("numericDerivative(sin(x), x, a)")).toThrow(
      "point"
    );
  });

  it("parses definite integral expressions", () => {
    const block = parser.parseBlock("integral(x^2, x, 0, 1)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.INTEGRAL);
    expect(block.lowerBound).toBe(0);
    expect(block.upperBound).toBe(1);
  });

  it("parses symbolic integration expressions", () => {
    const block = parser.parseBlock("integrate(x, x)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.INTEGRATE);
    expect(block.variableName).toBe("x");
  });

  it("rejects invalid bounds", () => {
    expect(() => parser.parseBlock("integral(x^2, x, a, 1)")).toThrow(
      /lower bound/
    );
  });

  it("parses two sided limits", () => {
    const block = parser.parseBlock("limit(sin(x)/x, x, 0)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.LIMIT);
    expect(block.limitTarget).toBe(0);
    expect(block.limitDirection).toBe(LimitDirection.BOTH);
  });

  it("parses one sided limits", () => {
    const left = parser.parseBlock("limit(1/x, x, 0, left)")!;
    const right = parser.parseBlock("limit(1/x, x, 0, right)")!;

    expect(left.limitDirection).toBe(LimitDirection.LEFT);
    expect(right.limitDirection).toBe(LimitDirection.RIGHT);
  });

  it("rejects an invalid limit direction", () => {
    expect(() => parser.parseBlock("limit(1/x, x, 0, sideways)")).toThrow(
      "direction"
    );
  });

  it("rejects a non numeric limit target", () => {
    expect(() => parser.parseBlock("limit(sin(x)/x, x, infinity)")).toThrow(
      "target"
    );
  });

  it("parses Taylor series expressions", () => {
    const block = parser.parseBlock("taylor(sin(x), x, 0, 5)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.TAYLOR);
    expect(block.center).toBe(0);
    expect(block.order).toBe(5);
  });

  it("rejects a non integer Taylor order", () => {
    expect(() => parser.parseBlock("taylor(sin(x), x, 0, 1.5)")).toThrow(
      "integer"
    );
  });

  it("parses finite summation expressions", () => {
    const block = parser.parseBlock("sum(n^2, n, 1, 10)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.SUM);
    expect(block.lowerBound).toBe(1);
    expect(block.upperBound).toBe(10);
  });

  it("parses finite product expressions", () => {
    const block = parser.parseBlock("product(n, n, 1, 5)")!;

    expect(block.operationKind).toBe(CalculusOperationKind.PRODUCT);
    expect(block.lowerBound).toBe(1);
    expect(block.upperBound).toBe(5);
  });

  it("splits arguments without confusing nested parentheses", () => {
    const block = parser.parseBlock("integral(1/(x+1), x, 0, 1)")!;

    expect(block.innerExpressionText).toBe("1/(x+1)");
    expect(block.lowerBound).toBe(0);
    expect(block.upperBound).toBe(1);
  });
});
