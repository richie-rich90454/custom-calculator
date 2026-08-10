import { describe, expect, it } from "vitest";
import { DefaultRegressionAnalysisService } from "./DefaultRegressionAnalysisService";

describe("DefaultRegressionAnalysisService", () => {
    const service = new DefaultRegressionAnalysisService();

    it("fits a perfect linear line", () => {
        const result = service.linear([1, 2, 3], [2, 4, 6]);

        expect(result.errorMessage).toBeNull();
        expect(result.linear?.slope).toBeCloseTo(2, 10);
        expect(result.linear?.intercept).toBeCloseTo(0, 10);
        expect(result.linear?.r).toBeCloseTo(1, 10);
        expect(result.linear?.r2).toBeCloseTo(1, 10);
    });

    it("fits a linear line with an intercept", () => {
        const result = service.linear([1, 2, 3, 4], [3, 5, 7, 9]);

        expect(result.errorMessage).toBeNull();
        expect(result.linear?.slope).toBeCloseTo(2, 10);
        expect(result.linear?.intercept).toBeCloseTo(1, 10);
    });

    it("keeps r at one for constant y data", () => {
        const result = service.linear([1, 2, 3], [5, 5, 5]);

        expect(result.errorMessage).toBeNull();
        expect(result.linear?.slope).toBeCloseTo(0, 10);
        expect(result.linear?.r).toBe(1);
        expect(result.linear?.r2).toBe(1);
    });

    it("reports a singular quadratic fit", () => {
        const result = service.quadratic([1, 1, 1], [1, 2, 3]);

        expect(result.quadratic).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("fits a quadratic whose normal equations require pivoting", () => {
        const result = service.quadratic([10, 1, 2], [104, 3, 8]);

        expect(result.errorMessage).toBeNull();
        expect(result.quadratic?.a).toBeCloseTo(0.7777777778, 8);
        expect(result.quadratic?.b).toBeCloseTo(2.6666666667, 8);
        expect(result.quadratic?.c).toBeCloseTo(-0.4444444444, 8);
    });

    it("reports zero correlation for a constant quadratic fit", () => {
        const result = service.quadratic([1, 2, 3], [7, 7, 7]);

        expect(result.errorMessage).toBeNull();
        expect(result.quadratic?.a).toBeCloseTo(0, 8);
        expect(result.quadratic?.b).toBeCloseTo(0, 8);
        expect(result.quadratic?.c).toBeCloseTo(7, 8);
        expect(result.quadratic?.r2).toBe(0);
    });

    it("fits a quadratic curve", () => {
        const result = service.quadratic([-1, 0, 1], [1, 0, 1]);

        expect(result.errorMessage).toBeNull();
        expect(result.quadratic?.a).toBeCloseTo(1, 10);
        expect(result.quadratic?.b).toBeCloseTo(0, 10);
        expect(result.quadratic?.c).toBeCloseTo(0, 10);
        expect(result.quadratic?.r2).toBeCloseTo(1, 10);
    });

    it("reports an error for degenerate x data in linear fit", () => {
        const result = service.linear([2, 2, 2], [1, 2, 3]);

        expect(result.linear).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error when data sets have different lengths", () => {
        const result = service.linear([1, 2, 3], [1, 2, 3, 4]);

        expect(result.linear).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error when there are fewer than three points", () => {
        const result = service.quadratic([1, 2], [1, 2]);

        expect(result.quadratic).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
