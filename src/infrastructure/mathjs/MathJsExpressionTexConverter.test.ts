import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { DefaultMathJsExpressionTexConverter } from "./MathJsExpressionTexConverter";

describe("DefaultMathJsExpressionTexConverter", () => {
    const converter = new DefaultMathJsExpressionTexConverter(new DefaultMathJsInstanceProvider());

    it("converts a two-argument log to a base-first LaTeX expression", () => {
        const result = converter.convertToTex("log(2,3)");

        expect(result.tex).toBe("\\log_{2}\\left(3\\right)");
    });

    it("converts a one-argument log to LaTeX", () => {
        const result = converter.convertToTex("log(100)");

        expect(result.tex).toBe("\\log\\left(100\\right)");
    });

    it("converts ln to its LaTeX form", () => {
        const result = converter.convertToTex("ln(x)");

        expect(result.tex).toBe("\\ln\\left( x\\right)");
    });

    it("converts powers, roots, and fractions", () => {
        expect(converter.convertToTex("x^2").tex).toBe("{ x}^{2}");
        expect(converter.convertToTex("sqrt(x)").tex).toBe("\\sqrt{ x}");
        expect(converter.convertToTex("1/2").tex).toBe("\\frac{1}{2}");
        expect(converter.convertToTex("cbrt(27)").tex).toBe("\\sqrt[3]{27}");
    });

    it("converts trig and constants", () => {
        expect(converter.convertToTex("sin(30)").tex).toBe("\\sin\\left(30\\right)");
        expect(converter.convertToTex("2*pi").tex).toBe("2\\cdot\\pi");
    });

    it("returns null for an incomplete expression", () => {
        const result = converter.convertToTex("2+");

        expect(result.tex).toBeNull();
    });

    it("returns null for an unparsable expression", () => {
        const result = converter.convertToTex("sin(");

        expect(result.tex).toBeNull();
    });
});
