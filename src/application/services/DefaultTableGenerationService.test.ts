import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "../../infrastructure/mathjs/DefaultMathJsInstanceProvider";
import { NewtonRaphsonEquationSolvingGateway } from "../../infrastructure/mathjs/NewtonRaphsonEquationSolvingGateway";
import { DefaultTableGenerationService } from "./DefaultTableGenerationService";

describe("DefaultTableGenerationService", () => {
    const service = new DefaultTableGenerationService(
        new NewtonRaphsonEquationSolvingGateway(new DefaultMathJsInstanceProvider()),
    );

    it("generates a table for a quadratic expression", () => {
        const result = service.generate("x^2", 1, 3, 1);

        expect(result.errorMessage).toBeNull();
        expect(result.rows.map((row) => row.x)).toEqual([1, 2, 3]);
        expect(result.rows.map((row) => row.fx)).toEqual([1, 4, 9]);
    });

    it("generates a table with an optional second expression", () => {
        const result = service.generate("x", 1, 2, 1, "x*2");

        expect(result.errorMessage).toBeNull();
        expect(result.rows.map((row) => row.gx)).toEqual([2, 4]);
    });

    it("marks non-finite evaluations as null", () => {
        const result = service.generate("sqrt(x)", -1, -1, 1);

        expect(result.errorMessage).toBeNull();
        expect(result.rows[0]?.fx).toBeNull();
    });

    it("rejects a non-positive step", () => {
        const result = service.generate("x", 0, 5, 0);

        expect(result.rows).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an end below the start", () => {
        const result = service.generate("x", 5, 1, 1);

        expect(result.rows).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects non-finite bounds", () => {
        const result = service.generate("x", Number.POSITIVE_INFINITY, 1, 1);

        expect(result.rows).toEqual([]);
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a range generating too many rows", () => {
        const result = service.generate("x", 0, 1000, 0.001);

        expect(result.rows).toEqual([]);
        expect(result.errorMessage).toContain("limit");
    });
});
