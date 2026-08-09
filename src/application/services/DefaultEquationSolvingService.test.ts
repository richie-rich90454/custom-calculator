import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "../../infrastructure/mathjs/DefaultMathJsInstanceProvider";
import { NewtonRaphsonEquationSolvingGateway } from "../../infrastructure/mathjs/NewtonRaphsonEquationSolvingGateway";
import { DefaultEquationSolvingService } from "./DefaultEquationSolvingService";

describe("DefaultEquationSolvingService", () => {
    const service = new DefaultEquationSolvingService(
        new NewtonRaphsonEquationSolvingGateway(new DefaultMathJsInstanceProvider()),
    );

    it("solves x^2-4 from a guess of 3 to the root 2", () => {
        const result = service.solve("x^2-4", "x", 3);

        expect(result.converged).toBe(true);
        expect(result.root).toBeCloseTo(2, 6);
        expect(result.iterationCount).toBeGreaterThan(0);
    });

    it("solves cos(x)-x to the fixed point 0.7390851332", () => {
        const result = service.solve("cos(x)-x", "x", 1);

        expect(result.converged).toBe(true);
        expect(result.root).toBeCloseTo(0.7390851332, 7);
    });

    it("reports non-convergence clearly for 1/x from a guess of 0", () => {
        const result = service.solve("1/x", "x", 0);

        expect(result.converged).toBe(false);
        expect(result.root).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("solves a two-sided equation split on equals", () => {
        const result = service.solve("x^2 = 4", "x", 3);

        expect(result.converged).toBe(true);
        expect(result.root).toBeCloseTo(2, 6);
    });

    it("rejects an empty equation", () => {
        const result = service.solve("=", "x", 1);

        expect(result.converged).toBe(false);
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a blank expression", () => {
        const result = service.solve("", "x", 1);

        expect(result.converged).toBe(false);
        expect(result.errorMessage).not.toBeNull();
    });

    it("converges when the iteration step becomes negligible", () => {
        const result = service.solve("1000*x+0.000000001", "x", 0);

        expect(result.converged).toBe(true);
        expect(result.root).toBeCloseTo(-1e-12, 12);
    });

    it("reports a flat slope as non-convergent", () => {
        const result = service.solve("2", "x", 1);

        expect(result.converged).toBe(false);
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an oscillating iteration as non-convergent", () => {
        const result = service.solve("x^3-2x+2", "x", 0);

        expect(result.converged).toBe(false);
        expect(result.root).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
