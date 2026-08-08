import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "./CalculatorCompositionRoot";
import { IndexedDbHistoryRepository } from "../infrastructure/persistence/IndexedDbHistoryRepository";
import { IndexedDbVariablesRepository } from "../infrastructure/persistence/IndexedDbVariablesRepository";

describe("CalculatorCompositionRoot with IndexedDB available", () => {
    it("uses IndexedDB backed repositories when IndexedDB is available", () => {
        const root = new CalculatorCompositionRoot();

        expect(root.historyRepository).toBeInstanceOf(IndexedDbHistoryRepository);
        expect(root.variablesRepository).toBeInstanceOf(IndexedDbVariablesRepository);
    });
});
