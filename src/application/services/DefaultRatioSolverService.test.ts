import { describe, expect, it } from "vitest";
import { DefaultRatioSolverService } from "./DefaultRatioSolverService";

describe("DefaultRatioSolverService", () => {
    const service = new DefaultRatioSolverService();

    it("solves for a missing d term", () => {
        const result = service.solve(2, 3, 4, null);

        expect(result.errorMessage).toBeNull();
        expect(result.value).toBe(6);
    });

    it("solves for a missing a term", () => {
        const result = service.solve(null, 3, 4, 6);

        expect(result.errorMessage).toBeNull();
        expect(result.value).toBe(2);
    });

    it("solves for a missing b term", () => {
        const result = service.solve(2, null, 4, 6);

        expect(result.errorMessage).toBeNull();
        expect(result.value).toBe(3);
    });

    it("solves for a missing c term", () => {
        const result = service.solve(2, 3, null, 6);

        expect(result.errorMessage).toBeNull();
        expect(result.value).toBe(4);
    });

    it("rejects multiple missing terms", () => {
        const result = service.solve(null, 3, null, 6);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects no missing terms", () => {
        const result = service.solve(2, 3, 4, 6);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a zero term", () => {
        const result = service.solve(2, 0, 4, null);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a negative term", () => {
        const result = service.solve(2, -3, 4, null);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an overflowing computation", () => {
        const result = service.solve(2, Number.MAX_VALUE, Number.MAX_VALUE, null);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
