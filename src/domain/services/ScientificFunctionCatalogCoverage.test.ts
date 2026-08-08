import { describe, expect, it } from "vitest";
import {
    ScientificFunctionCategory,
    ScientificFunctionDefinition,
} from "./ScientificFunctionDefinition";
import { DefaultScientificFunctionCatalogService } from "./DefaultScientificFunctionCatalogService";

describe("DefaultScientificFunctionCatalogService", () => {
    const catalog = new DefaultScientificFunctionCatalogService();

    it("returns a known function", () => {
        expect(catalog.getFunction("sin")?.name).toBe("sin");
    });

    it("returns null for an unknown function", () => {
        expect(catalog.getFunction("mystery")).toBeNull();
    });

    it("exposes every function and its names", () => {
        expect(catalog.getAllFunctions().length).toBeGreaterThan(0);
        expect(catalog.getFunctionNames()).toContain("sin");
    });
});

describe("ScientificFunctionDefinition", () => {
    it("reports a variadic function", () => {
        const definition = new ScientificFunctionDefinition(
            "max",
            "max",
            "Maximum",
            ScientificFunctionCategory.ARITHMETIC,
            1,
            999,
        );

        expect(definition.isVariadic).toBe(true);
    });

    it("reports a fixed arity function as non variadic", () => {
        const definition = new ScientificFunctionDefinition(
            "sin",
            "sin",
            "Sine",
            ScientificFunctionCategory.TRIGONOMETRIC,
            1,
            1,
        );

        expect(definition.isVariadic).toBe(false);
    });
});
