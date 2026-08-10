import { describe, expect, it } from "vitest";
import { DefaultTemperatureConversionPolicy } from "./DefaultTemperatureConversionPolicy";

describe("DefaultTemperatureConversionPolicy", () => {
    const policy = new DefaultTemperatureConversionPolicy();

    it("converts celsius to fahrenheit", () => {
        expect(policy.convert(0, "C", "F")).toBe(32);
        expect(policy.convert(100, "C", "F")).toBe(212);
    });

    it("converts fahrenheit to celsius", () => {
        expect(policy.convert(32, "F", "C")).toBe(0);
        expect(policy.convert(212, "F", "C")).toBe(100);
    });

    it("converts celsius to kelvin", () => {
        expect(policy.convert(0, "C", "K")).toBe(273.15);
    });

    it("converts kelvin to celsius", () => {
        expect(policy.convert(273.15, "K", "C")).toBe(0);
    });

    it("converts celsius to rankine", () => {
        expect(policy.convert(0, "C", "R")).toBeCloseTo(491.67, 10);
    });

    it("converts rankine to celsius", () => {
        expect(policy.convert(491.67, "R", "C")).toBeCloseTo(0, 10);
    });

    it("converts fahrenheit to kelvin directly", () => {
        expect(policy.convert(32, "F", "K")).toBeCloseTo(273.15, 10);
    });

    it("converts kelvin to fahrenheit", () => {
        expect(policy.convert(273.15, "K", "F")).toBe(32);
    });

    it("converts rankine to fahrenheit", () => {
        expect(policy.convert(491.67, "R", "F")).toBe(32);
    });

    it("converts fahrenheit to rankine", () => {
        expect(policy.convert(32, "F", "R")).toBeCloseTo(491.67, 10);
    });

    it("keeps celsius unchanged", () => {
        expect(policy.convert(21, "C", "C")).toBe(21);
    });
});
