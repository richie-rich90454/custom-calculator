import { describe, expect, it } from "vitest";
import { GaussianEliminationSimultaneousEquationService } from "./GaussianEliminationSimultaneousEquationService";

describe("GaussianEliminationSimultaneousEquationService", () => {
    const service = new GaussianEliminationSimultaneousEquationService();

    it("solves a two-unknown system", () => {
        const result = service.solve(
            [
                [2, 3],
                [1, -1],
            ],
            [8, 1],
        );

        expect(result.errorMessage).toBeNull();
        expect(result.solution?.[0]).toBeCloseTo(2.2, 10);
        expect(result.solution?.[1]).toBeCloseTo(1.2, 10);
    });

    it("solves a three-unknown system", () => {
        const result = service.solve(
            [
                [1, 1, 1],
                [1, -1, 1],
                [2, 1, -1],
            ],
            [6, 0, 1],
        );

        expect(result.errorMessage).toBeNull();
        expect(result.solution?.[0]).toBeCloseTo(1 / 3, 10);
        expect(result.solution?.[1]).toBeCloseTo(3, 10);
        expect(result.solution?.[2]).toBeCloseTo(8 / 3, 10);
    });

    it("reports a singular system clearly", () => {
        const result = service.solve(
            [
                [1, 1],
                [2, 2],
            ],
            [1, 2],
        );

        expect(result.solution).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects unsupported sizes", () => {
        const result = service.solve([[1]], [1]);

        expect(result.solution).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects mismatched constants", () => {
        const result = service.solve(
            [
                [1, 1],
                [1, -1],
            ],
            [1],
        );

        expect(result.solution).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a ragged coefficient matrix", () => {
        const result = service.solve(
            [
                [1, 1],
                [1, 1, 2],
            ],
            [1, 2],
        );

        expect(result.solution).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
