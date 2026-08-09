import { describe, expect, it } from "vitest";
import { DefaultScientificFunctionCatalogService } from "../../domain/services/DefaultScientificFunctionCatalogService";
import { StaticScientificConstantRepository } from "../../infrastructure/constants/StaticScientificConstantRepository";
import { DefaultConstantCatalogService } from "../../domain/services/DefaultConstantCatalogService";
import { DefaultExpressionVariablePromptService } from "./DefaultExpressionVariablePromptService";

describe("DefaultExpressionVariablePromptService", () => {
    const service = new DefaultExpressionVariablePromptService(
        new DefaultScientificFunctionCatalogService(),
        new DefaultConstantCatalogService(new StaticScientificConstantRepository()),
    );

    it("reports identifiers that are not functions, constants, or variables", () => {
        expect(service.resolveMissingVariableNames("a+b", [])).toEqual(["a", "b"]);
    });

    it("ignores function names", () => {
        expect(service.resolveMissingVariableNames("sin(x)+cos(x)", [])).toEqual(["x"]);
    });

    it("ignores known constants", () => {
        expect(service.resolveMissingVariableNames("pi*e", [])).toEqual([]);
    });

    it("ignores known variables", () => {
        expect(service.resolveMissingVariableNames("x+y", ["x", "y"])).toEqual([]);
    });

    it("deduplicates repeated identifiers", () => {
        expect(service.resolveMissingVariableNames("a+a+a", [])).toEqual(["a"]);
    });

    it("does not split multi-letter implicit factors", () => {
        expect(service.resolveMissingVariableNames("ab", [])).toEqual(["ab"]);
    });

    it("ignores the previous answer symbol", () => {
        expect(service.resolveMissingVariableNames("ans+1", [])).toEqual([]);
    });
});
