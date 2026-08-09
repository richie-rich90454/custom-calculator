import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { MathJsMatrixOperationsGateway } from "./MathJsMatrixOperationsGateway";

describe("MathJsMatrixOperationsGateway", () => {
    const gateway = new MathJsMatrixOperationsGateway(new DefaultMathJsInstanceProvider());

    it("computes the determinant of a 2x2 matrix", () => {
        const result = gateway.determinant([
            [1, 2],
            [3, 4],
        ]);

        expect(result.errorMessage).toBeNull();
        expect(result.value).toBeCloseTo(-2, 10);
    });

    it("inverts a 2x2 matrix", () => {
        const result = gateway.inverse([
            [1, 2],
            [3, 4],
        ]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]?.[0]).toBeCloseTo(-2, 10);
        expect(result.value?.[0]?.[1]).toBeCloseTo(1, 10);
        expect(result.value?.[1]?.[0]).toBeCloseTo(1.5, 10);
        expect(result.value?.[1]?.[1]).toBeCloseTo(-0.5, 10);
    });

    it("transposes a 2x2 matrix", () => {
        const result = gateway.transpose([
            [1, 2],
            [3, 4],
        ]);

        expect(result).toEqual([
            [1, 3],
            [2, 4],
        ]);
    });

    it("adds two matrices", () => {
        const result = gateway.add(
            [
                [1, 2],
                [3, 4],
            ],
            [
                [5, 6],
                [7, 8],
            ],
        );

        expect(result.errorMessage).toBeNull();
        expect(result.value).toEqual([
            [6, 8],
            [10, 12],
        ]);
    });

    it("subtracts two matrices", () => {
        const result = gateway.subtract(
            [
                [5, 6],
                [7, 8],
            ],
            [
                [1, 2],
                [3, 4],
            ],
        );

        expect(result.errorMessage).toBeNull();
        expect(result.value).toEqual([
            [4, 4],
            [4, 4],
        ]);
    });

    it("multiplies two matrices", () => {
        const result = gateway.multiply(
            [
                [1, 2],
                [3, 4],
            ],
            [
                [5, 6],
                [7, 8],
            ],
        );

        expect(result.errorMessage).toBeNull();
        expect(result.value).toEqual([
            [19, 22],
            [43, 50],
        ]);
    });

    it("creates an identity matrix", () => {
        expect(gateway.identity(3)).toEqual([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]);
    });

    it("rejects a dimension mismatch for addition", () => {
        const result = gateway.add(
            [
                [1, 2],
                [3, 4],
            ],
            [
                [1, 2, 3],
                [3, 4, 5],
                [6, 7, 8],
            ],
        );

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a dimension mismatch for multiplication", () => {
        const result = gateway.multiply(
            [
                [1, 2],
                [3, 4],
            ],
            [[1], [2], [3]],
        );

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects multiplication with an empty first matrix", () => {
        const result = gateway.multiply([], [[1], [2]]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a determinant on a non-square matrix", () => {
        const result = gateway.determinant([
            [1, 2, 3],
            [4, 5, 6],
        ]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an inverse on a non-square matrix", () => {
        const result = gateway.inverse([
            [1, 2, 3],
            [4, 5, 6],
        ]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an inverse on a singular matrix", () => {
        const result = gateway.inverse([
            [1, 2],
            [2, 4],
        ]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an operation on an empty matrix", () => {
        const result = gateway.add([], []);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
