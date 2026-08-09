import { describe, expect, it } from "vitest";
import { DefaultMathJsInstanceProvider } from "./DefaultMathJsInstanceProvider";
import { MathJsVectorOperationsGateway } from "./MathJsVectorOperationsGateway";

describe("MathJsVectorOperationsGateway", () => {
    const gateway = new MathJsVectorOperationsGateway(new DefaultMathJsInstanceProvider());

    it("computes a cross product of two 3-component vectors", () => {
        const result = gateway.cross([1, 0, 0], [0, 1, 0]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]).toBeCloseTo(0, 10);
        expect(result.value?.[1]).toBeCloseTo(0, 10);
        expect(result.value?.[2]).toBeCloseTo(1, 10);
    });

    it("computes a dot product of perpendicular vectors", () => {
        const result = gateway.dot([1, 0], [0, 1]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]).toBeCloseTo(0, 10);
    });

    it("computes the magnitude of a vector", () => {
        expect(gateway.magnitude([3, 4])).toBeCloseTo(5, 10);
    });

    it("computes the angle between two perpendicular vectors in radians", () => {
        const result = gateway.angleBetween([1, 0], [0, 1]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]).toBeCloseTo(Math.PI / 2, 10);
    });

    it("clamps the cosine argument of the angle", () => {
        const result = gateway.angleBetween([1, 0], [2, 0]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]).toBeCloseTo(0, 10);
    });

    it("computes the unit vector of a 2-component vector", () => {
        const result = gateway.unit([3, 4]);

        expect(result.errorMessage).toBeNull();
        expect(result.value?.[0]).toBeCloseTo(0.6, 10);
        expect(result.value?.[1]).toBeCloseTo(0.8, 10);
    });

    it("rejects a zero vector unit", () => {
        const result = gateway.unit([0, 0]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a cross product of 2-component vectors", () => {
        const result = gateway.cross([1, 0], [0, 1]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects a dot product of mismatched dimensions", () => {
        const result = gateway.dot([1, 0], [1]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("rejects an angle between vectors of mismatched dimensions", () => {
        const result = gateway.angleBetween([1, 0], [1, 0, 0]);

        expect(result.value).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
