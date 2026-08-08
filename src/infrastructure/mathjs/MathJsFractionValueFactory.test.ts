import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { DefaultMathJsFractionValueFactory } from "./MathJsFractionValueFactory";

function buildFactory(): DefaultMathJsFractionValueFactory {
  return new DefaultMathJsFractionValueFactory();
}

function createFraction(
  factory: DefaultMathJsFractionValueFactory,
  valueText: string
): string {
  const math = new CalculatorCompositionRoot().mathJsInstanceProvider.getInstance();

  return String(factory.createFractionFromValueText(math, valueText));
}

describe("DefaultMathJsFractionValueFactory", () => {
  it("expands a positive exponent notation value", () => {
    expect(buildFactory().expandExponentNotation("6.02214076e23")).toBe(
      "602214076000000000000000"
    );
  });

  it("expands a negative exponent notation value", () => {
    expect(buildFactory().expandExponentNotation("6.6743e-11")).toBe(
      "0.000000000066743"
    );
  });

  it("expands an exponent with a leading plus sign", () => {
    expect(buildFactory().expandExponentNotation("1.5e+3")).toBe("1500");
  });

  it("expands a negative mantissa", () => {
    expect(buildFactory().expandExponentNotation("-2.5e-2")).toBe("-0.025");
  });

  it("expands an exponent on an integer mantissa", () => {
    expect(buildFactory().expandExponentNotation("299792458e0")).toBe(
      "299792458"
    );
  });

  it("leaves plain decimal text unchanged", () => {
    expect(buildFactory().expandExponentNotation("0.5")).toBe("0.5");
  });

  it("creates an exact fraction from exponent notation text", () => {
    const factory = buildFactory();

    expect(createFraction(factory, "6.6743e-11")).toBe(
      "0.000000000066743"
    );
  });

  it("creates an exact fraction from a plain ratio text", () => {
    const factory = buildFactory();

    expect(createFraction(factory, "1/3").startsWith("0.(3)")).toBe(true);
  });

  it("creates a fraction from a plain decimal text", () => {
    const factory = buildFactory();

    expect(createFraction(factory, "0.25")).toBe("0.25");
  });
});
