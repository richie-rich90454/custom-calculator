import { describe, expect, it } from "vitest";
import { AnalyticPolynomialRootService } from "./AnalyticPolynomialRootService";

describe("AnalyticPolynomialRootService", () => {
    const service = new AnalyticPolynomialRootService();

    it("solves a quadratic with real roots", () => {
        const result = service.solve([1, -3, 2]);

        expect(result.errorMessage).toBeNull();
        expect(result.roots.map((root) => root.re).sort()).toEqual([1, 2]);
        expect(result.roots.every((root) => root.im === 0)).toBe(true);
    });

    it("solves a quadratic with complex roots", () => {
        const result = service.solve([1, 0, 1]);

        expect(result.errorMessage).toBeNull();
        expect(result.roots[0]?.re).toBeCloseTo(0, 8);
        expect(result.roots[0]?.im).toBeCloseTo(1, 8);
        expect(result.roots[1]?.re).toBeCloseTo(0, 8);
        expect(result.roots[1]?.im).toBeCloseTo(-1, 8);
    });

    it("solves a cubic", () => {
        const result = service.solve([1, -6, 11, -6]);

        expect(result.errorMessage).toBeNull();
        const realRoots = result.roots.map((root) => Math.round(root.re)).sort();

        expect(realRoots).toEqual([1, 2, 3]);
        expect(result.roots.every((root) => Math.abs(root.im) < 1e-8)).toBe(true);
    });

    it("solves a quartic with symmetric real roots", () => {
        const result = service.solve([1, 0, -5, 0, 4]);

        expect(result.errorMessage).toBeNull();
        const realRoots = result.roots.map((root) => Math.round(root.re)).sort((a, b) => a - b);

        expect(realRoots).toEqual([-2, -1, 1, 2]);
        expect(result.roots.every((root) => Math.abs(root.im) < 1e-6)).toBe(true);
    });

    it("reports an error for empty coefficients", () => {
        const result = service.solve([]);

        expect(result.roots).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error for a zero leading coefficient", () => {
        const result = service.solve([0, 1, 2]);

        expect(result.roots).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error for a linear polynomial", () => {
        const result = service.solve([2, 1]);

        expect(result.roots).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("solves a cubic with a repeated root", () => {
        const result = service.solve([1, -4, 5, -2]);

        expect(result.errorMessage).toBeNull();
        expect(result.roots.map((root) => Math.round(root.re)).sort((a, b) => a - b)).toEqual([
            1, 1, 2,
        ]);
    });

    it("solves a cubic with a triple root", () => {
        const result = service.solve([1, -6, 12, -8]);

        expect(result.errorMessage).toBeNull();
        expect(result.roots.map((root) => Math.round(root.re))).toEqual([2, 2, 2]);
        expect(result.roots.every((root) => Math.abs(root.im) < 1e-4)).toBe(true);
    });

    it("reports a verification failure for a hard numeric case", () => {
        const result = service.solve([-1, 0, 0, 1]);

        expect(result.roots).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error for a degree above four", () => {
        const result = service.solve([1, 0, 0, 0, 0, 1]);

        expect(result.roots).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });
});
