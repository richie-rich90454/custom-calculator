import { describe, expect, it } from "vitest";
import { CalculationError } from "../model/CalculationError";
import { DefaultResultFormattingService } from "./DefaultResultFormattingService";

describe("DefaultResultFormattingService", () => {
  const service = new DefaultResultFormattingService();

  it("removes floating-point noise", () => {
    expect(service.formatNumber(0.1 + 0.2)).toBe("0.3");
  });

  it("removes unnecessary trailing zeros", () => {
    expect(service.formatNumber(2.5)).toBe("2.5");
    expect(service.formatNumber(2.0)).toBe("2");
  });

  it("formats whole numbers without a decimal point", () => {
    expect(service.formatNumber(42)).toBe("42");
  });

  it("formats zero as a single digit", () => {
    expect(service.formatNumber(0)).toBe("0");
  });

  it("uses scientific notation for very large values", () => {
    expect(service.formatNumber(1e20)).toBe("1e+20");
  });

  it("uses scientific notation for very small values", () => {
    expect(service.formatNumber(1e-10)).toBe("1e-10");
  });

  it("throws an overflow error for infinity", () => {
    expect(() => service.formatNumber(Number.POSITIVE_INFINITY)).toThrow(
      CalculationError
    );
  });

  it("throws an overflow error for NaN", () => {
    expect(() => service.formatNumber(Number.NaN)).toThrow(CalculationError);
  });

  it("normalizes spaces out of raw result text", () => {
    expect(service.normalizeResultText("1 / 2")).toBe("1/2");
    expect(service.normalizeResultText("2 + 3i")).toBe("2+3i");
  });

  it("reports whether a value is finite", () => {
    expect(service.isFiniteNumber(3)).toBe(true);
    expect(service.isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
