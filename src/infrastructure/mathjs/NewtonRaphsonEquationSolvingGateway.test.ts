import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { NewtonRaphsonEquationSolvingGateway } from "./NewtonRaphsonEquationSolvingGateway";

describe("NewtonRaphsonEquationSolvingGateway", () => {
    const gateway = new NewtonRaphsonEquationSolvingGateway(new DefaultMathJsInstanceProvider());

    it("evaluates an expression at a point", () => {
        expect(gateway.evaluate("x^2-4", "x", 3)).toBeCloseTo(5, 10);
    });

    it("returns NaN for an unparseable expression", () => {
        expect(gateway.evaluate("x +", "x", 1)).toBeNaN();
    });

    it("returns NaN when evaluation throws", () => {
        expect(gateway.evaluate("foo(1)", "x", 1)).toBeNaN();
    });

    it("approximates the derivative numerically", () => {
        expect(gateway.numericDerivative("x^2", "x", 3)).toBeCloseTo(6, 6);
    });

    it("returns NaN for a non-finite derivative", () => {
        expect(gateway.numericDerivative("sqrt(x)", "x", 0)).toBeNaN();
    });
});
