import { describe, expect, it } from "vitest";
import { CasOperationKind } from "./CasOperationKind";
import { DefaultCasOperationCatalogService } from "./DefaultCasOperationCatalogService";

describe("DefaultCasOperationCatalogService", () => {
    const catalog = new DefaultCasOperationCatalogService();

    it("lists the supported CAS function names", () => {
        expect(catalog.getOperationNames()).toEqual([
            "cas",
            "casSimplify",
            "casExpand",
            "casDerivative",
        ]);
    });

    it("reports a known CAS operation", () => {
        expect(catalog.hasOperation("casSimplify")).toBe(true);
    });

    it("rejects an unknown CAS operation", () => {
        expect(catalog.hasOperation("casIntegrate")).toBe(false);
    });

    it("exposes invocation text for every operation", () => {
        for (const operation of catalog.getOperations()) {
            expect(operation.invocationText.endsWith("(")).toBe(true);
            expect(operation.ariaLabel.length).toBeGreaterThan(0);
        }
    });

    it("maps each function name to its operation kind", () => {
        const operations = catalog.getOperations();

        expect(
            operations.find((operation) => operation.functionName === "cas")?.operationKind,
        ).toBe(CasOperationKind.SIMPLIFY);
        expect(
            operations.find((operation) => operation.functionName === "casExpand")?.operationKind,
        ).toBe(CasOperationKind.EXPAND);
        expect(
            operations.find((operation) => operation.functionName === "casDerivative")
                ?.operationKind,
        ).toBe(CasOperationKind.DERIVATIVE);
    });
});
