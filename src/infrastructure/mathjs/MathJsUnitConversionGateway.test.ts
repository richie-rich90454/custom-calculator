import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { MathJsUnitConversionGateway } from "./MathJsUnitConversionGateway";

describe("MathJsUnitConversionGateway", () => {
    const gateway = new MathJsUnitConversionGateway(new DefaultMathJsInstanceProvider());

    it("converts kilometers to bar for pressure", () => {
        const result = gateway.convert(100, "kPa", "bar");

        expect(result.value).toBeCloseTo(1, 10);
        expect(result.text).toContain("bar");
    });

    it("converts meters to centimeters", () => {
        const result = gateway.convert(1, "m", "cm");

        expect(result.value).toBeCloseTo(100, 10);
    });

    it("converts miles to kilometers", () => {
        const result = gateway.convert(1, "mile", "km");

        expect(result.value).toBeCloseTo(1.609344, 10);
    });

    it("converts hectares to square meters", () => {
        const result = gateway.convert(1, "ha", "m^2");

        expect(result.value).toBeCloseTo(10000, 10);
    });

    it("converts miles per hour to kilometers per hour", () => {
        const result = gateway.convert(1, "mph", "km/h");

        expect(result.value).toBeCloseTo(1.609344, 10);
    });

    it("converts knots to kilometers per hour", () => {
        const result = gateway.convert(1, "knot", "km/h");

        expect(result.value).toBeCloseTo(1.852, 6);
    });

    it("converts gons to radians", () => {
        const result = gateway.convert(1, "gon", "rad");

        expect(result.value).toBeCloseTo(Math.PI / 200, 10);
    });

    it("converts calories to joules", () => {
        const result = gateway.convert(1, "cal", "J");

        expect(result.value).toBeCloseTo(4.184, 10);
    });

    it("rejects incompatible units", () => {
        expect(() => gateway.convert(1, "m", "kg")).toThrow();
    });

    it("formats a negative zero result without a sign", () => {
        const result = gateway.convert(-0, "m", "cm");

        expect(result.text).toContain("0 cm");
    });
});
