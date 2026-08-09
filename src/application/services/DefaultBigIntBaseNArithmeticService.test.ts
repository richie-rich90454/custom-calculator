import { describe, expect, it } from "vitest";
import { DefaultBigIntBaseNArithmeticService } from "./DefaultBigIntBaseNArithmeticService";

describe("DefaultBigIntBaseNArithmeticService", () => {
    const service = new DefaultBigIntBaseNArithmeticService();

    it("renders a decimal value in hex", () => {
        expect(service.toBase(255n, 16, 32)).toBe("FF");
    });

    it("renders a decimal value in binary grouped by bytes", () => {
        expect(service.toBase(255n, 2, 32)).toBe("00000000 00000000 00000000 11111111");
    });

    it("renders negative one at 32 bits in hex and binary", () => {
        expect(service.toBase(-1n, 16, 32)).toBe("FFFFFFFF");
        expect(service.toBase(-1n, 2, 32)).toBe("11111111 11111111 11111111 11111111");
    });

    it("renders a decimal value in octal", () => {
        expect(service.toBase(64n, 8, 32)).toBe("100");
    });

    it("renders zero in every base", () => {
        expect(service.toBase(0n, 16, 32)).toBe("0");
        expect(service.toBase(0n, 2, 32)).toBe("0");
    });

    it("parses a decimal value in hex", () => {
        expect(service.parse("255", 10, 32)).toBe(255n);
    });

    it("parses a single plus or minus sign as zero", () => {
        expect(service.parse("-", 10, 32)).toBe(0n);
        expect(service.parse("+", 10, 32)).toBe(0n);
    });

    it("parses a hex text into a bigint", () => {
        expect(service.parse("FF", 16, 32)).toBe(255n);
    });

    it("parses a binary text into a bigint", () => {
        expect(service.parse("1010", 2, 32)).toBe(10n);
    });

    it("parses a negative value with two's complement offset", () => {
        expect(service.parse("-1", 10, 32)).toBe(0xffffffffn);
    });

    it("parses an empty text as zero", () => {
        expect(service.parse("", 10, 32)).toBe(0n);
    });

    it("parses an invalid digit as zero", () => {
        expect(service.parse("G", 16, 32)).toBe(0n);
    });

    it("computes bitwise and", () => {
        expect(service.and(0xffn, 0x0fn, 32)).toBe(0x0fn);
    });

    it("wraps an addition on word overflow", () => {
        expect(service.add(0x7fffffffn, 1n, 32)).toBe(0x80000000n);
    });

    it("computes bitwise or", () => {
        expect(service.or(0xf0n, 0x0fn, 32)).toBe(0xffn);
    });

    it("computes bitwise xor", () => {
        expect(service.xor(0xffn, 0x0fn, 32)).toBe(0xf0n);
    });

    it("computes bitwise not with word masking", () => {
        expect(service.not(0n, 32)).toBe(0xffffffffn);
    });

    it("computes negation with word masking", () => {
        expect(service.neg(1n, 32)).toBe(0xffffffffn);
    });

    it("masks bitwise not at eight bits", () => {
        expect(service.not(0n, 8)).toBe(0xffn);
    });
});
