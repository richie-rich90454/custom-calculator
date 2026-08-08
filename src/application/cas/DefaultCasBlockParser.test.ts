import { describe, expect, it } from "vitest";
import { CasOperationKind } from "./CasOperationKind";
import { DefaultCasBlockParser } from "./DefaultCasBlockParser";

describe("DefaultCasBlockParser", () => {
    const parser = new DefaultCasBlockParser();

    it("parses a plain cas block as a simplify operation", () => {
        const descriptor = parser.parseBlock("cas(x+x)");

        expect(descriptor).not.toBeNull();
        expect(descriptor?.operationKind).toBe(CasOperationKind.SIMPLIFY);
        expect(descriptor?.innerExpressionText).toBe("x+x");
        expect(descriptor?.derivativeVariableName).toBeNull();
    });

    it("parses an explicit casSimplify block", () => {
        const descriptor = parser.parseBlock("casSimplify(x^2 + 2*x + 1)");

        expect(descriptor?.operationKind).toBe(CasOperationKind.SIMPLIFY);
        expect(descriptor?.innerExpressionText).toBe("x^2 + 2*x + 1");
    });

    it("parses a casExpand block", () => {
        const descriptor = parser.parseBlock("casExpand((x+1)^2)");

        expect(descriptor?.operationKind).toBe(CasOperationKind.EXPAND);
        expect(descriptor?.innerExpressionText).toBe("(x+1)^2");
    });

    it("parses a casDerivative block with an explicit variable", () => {
        const descriptor = parser.parseBlock("casDerivative(x^2+x, x)");

        expect(descriptor?.operationKind).toBe(CasOperationKind.DERIVATIVE);
        expect(descriptor?.innerExpressionText).toBe("x^2+x");
        expect(descriptor?.derivativeVariableName).toBe("x");
    });

    it("defaults the derivative variable to x when omitted", () => {
        const descriptor = parser.parseBlock("casDerivative(x^2)");

        expect(descriptor?.operationKind).toBe(CasOperationKind.DERIVATIVE);
        expect(descriptor?.innerExpressionText).toBe("x^2");
        expect(descriptor?.derivativeVariableName).toBe("x");
    });

    it("handles nested parentheses inside the block", () => {
        const descriptor = parser.parseBlock("cas(x + (y + 1))");

        expect(descriptor?.operationKind).toBe(CasOperationKind.SIMPLIFY);
        expect(descriptor?.innerExpressionText).toBe("x + (y + 1)");
    });

    it("splits derivative arguments without splitting nested commas", () => {
        const descriptor = parser.parseBlock("casDerivative(sin(x, y), t)");

        expect(descriptor?.innerExpressionText).toBe("sin(x, y)");
        expect(descriptor?.derivativeVariableName).toBe("t");
    });

    it("returns null for a non CAS expression", () => {
        expect(parser.parseBlock("2+3")).toBeNull();
    });

    it("returns null for an empty expression", () => {
        expect(parser.parseBlock("")).toBeNull();
    });

    it("returns null for an empty cas block", () => {
        expect(parser.parseBlock("cas()")).toBeNull();
    });

    it("trims surrounding whitespace", () => {
        const descriptor = parser.parseBlock("  cas( x + x )  ");

        expect(descriptor?.innerExpressionText).toBe("x + x");
    });
});
