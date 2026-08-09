import { describe, expect, it, vi } from "vitest";
import type { ResultFormatGateway } from "./ResultFormatGateway";
import { DefaultResultFormatService } from "./ResultFormatService";

describe("DefaultResultFormatService", () => {
    const gateway: ResultFormatGateway = {
        toFractionText: vi.fn(() => ({ text: "1/2", isExact: true })),
        toDecimalText: vi.fn(() => ({ text: "0.5", isExact: true })),
        toEngineeringText: vi.fn(() => "12.345×10^3"),
        toFixedText: vi.fn(() => "3.1416"),
        toSignificantText: vi.fn(() => "3.142"),
    };

    const service = new DefaultResultFormatService(gateway);

    it("delegates fraction conversion", () => {
        expect(service.convertToFraction(0.5)).toEqual({ text: "1/2", isExact: true });
    });

    it("delegates decimal conversion", () => {
        expect(service.convertToDecimal(0.5)).toEqual({ text: "0.5", isExact: true });
    });

    it("delegates engineering formatting", () => {
        expect(service.formatEngineering(12345)).toBe("12.345×10^3");
    });

    it("delegates fixed formatting", () => {
        expect(service.formatFixed(Math.PI, 4)).toBe("3.1416");
    });

    it("delegates significant formatting", () => {
        expect(service.formatSignificant(Math.PI, 4)).toBe("3.142");
    });
});
