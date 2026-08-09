import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { MathJsResultFormatGateway } from "./MathJsResultFormatGateway";

describe("MathJsResultFormatGateway", () => {
    const gateway = new MathJsResultFormatGateway(new DefaultMathJsInstanceProvider());

    describe("toFractionText", () => {
        it("converts 0.5 to one half exactly", () => {
            const conversion = gateway.toFractionText(0.5);

            expect(conversion.text).toBe("1/2");
            expect(conversion.isExact).toBe(true);
        });

        it("converts 0.75 to three quarters exactly", () => {
            const conversion = gateway.toFractionText(0.75);

            expect(conversion.text).toBe("3/4");
            expect(conversion.isExact).toBe(true);
        });

        it("marks irrational values as approximate", () => {
            const conversion = gateway.toFractionText(Math.SQRT2);

            expect(conversion.isExact).toBe(false);
        });

        it("keeps values formatted exponentially as decimals", () => {
            const conversion = gateway.toFractionText(1e21);

            expect(conversion.isExact).toBe(false);
            expect(conversion.text).toContain("e");
        });

        it("falls back to decimal for non-numeric values", () => {
            const conversion = gateway.toFractionText(Number.NaN);

            expect(conversion.isExact).toBe(false);
        });
    });

    describe("toDecimalText", () => {
        it("formats a decimal value", () => {
            expect(gateway.toDecimalText(0.5).text).toBe("0.5");
        });
    });

    describe("toEngineeringText", () => {
        it("renders 12345 as 12.345 times ten to the three", () => {
            expect(gateway.toEngineeringText(12345)).toBe("12.345×10^3");
        });

        it("renders zero as zero", () => {
            expect(gateway.toEngineeringText(0)).toBe("0");
        });

        it("keeps non-finite values as plain decimals", () => {
            expect(gateway.toEngineeringText(Number.POSITIVE_INFINITY)).toBe("Infinity");
        });
    });

    describe("toFixedText", () => {
        it("renders pi to four decimal places", () => {
            expect(gateway.toFixedText(Math.PI, 4)).toBe("3.1416");
        });
    });

    describe("toSignificantText", () => {
        it("renders pi to four significant digits", () => {
            expect(gateway.toSignificantText(Math.PI, 4)).toBe("3.142");
        });
    });
});
