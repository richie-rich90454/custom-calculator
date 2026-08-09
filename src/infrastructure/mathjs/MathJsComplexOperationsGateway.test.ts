import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { MathJsComplexOperationsGateway } from "./MathJsComplexOperationsGateway";

describe("MathJsComplexOperationsGateway", () => {
    const gateway = new MathJsComplexOperationsGateway(new DefaultMathJsInstanceProvider());

    it("multiplies two complex numbers", () => {
        const result = gateway.multiply({ re: 3, im: 4 }, { re: 1, im: -2 });

        expect(result.re).toBeCloseTo(11, 10);
        expect(result.im).toBeCloseTo(-2, 10);
    });

    it("adds two complex numbers", () => {
        const result = gateway.add({ re: 1, im: 2 }, { re: 3, im: -4 });

        expect(result.re).toBeCloseTo(4, 10);
        expect(result.im).toBeCloseTo(-2, 10);
    });

    it("subtracts two complex numbers", () => {
        const result = gateway.subtract({ re: 5, im: 6 }, { re: 2, im: 3 });

        expect(result.re).toBeCloseTo(3, 10);
        expect(result.im).toBeCloseTo(3, 10);
    });

    it("divides two complex numbers", () => {
        const result = gateway.divide({ re: 1, im: 2 }, { re: 3, im: 4 });

        expect(result.re).toBeCloseTo(0.44, 10);
        expect(result.im).toBeCloseTo(0.08, 10);
    });

    it("conjugates a complex number", () => {
        const result = gateway.conjugate({ re: 3, im: 4 });

        expect(result.re).toBe(3);
        expect(result.im).toBe(-4);
    });

    it("computes the absolute value of a complex number", () => {
        expect(gateway.abs({ re: 3, im: 4 })).toBeCloseTo(5, 10);
    });

    it("computes the argument of a complex number in radians", () => {
        expect(gateway.arg({ re: 1, im: 1 })).toBeCloseTo(Math.PI / 4, 10);
    });

    it("converts rectangular to polar form", () => {
        const polar = gateway.rectToPolar({ re: 3, im: 4 });

        expect(polar.radius).toBeCloseTo(5, 10);
        expect(polar.angle).toBeCloseTo(Math.atan2(4, 3), 10);
    });

    it("converts polar to rectangular form", () => {
        const rect = gateway.polarToRect(5, Math.atan2(4, 3));

        expect(rect.re).toBeCloseTo(3, 10);
        expect(rect.im).toBeCloseTo(4, 10);
    });
});
