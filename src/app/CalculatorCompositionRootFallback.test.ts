import { describe, expect, it, vi } from "vitest";
import { CalculatorCompositionRoot } from "./CalculatorCompositionRoot";
import { InMemoryHistoryRepository } from "../infrastructure/persistence/InMemoryHistoryRepository";
import { InMemoryVariablesRepository } from "../infrastructure/persistence/InMemoryVariablesRepository";

vi.mock("../infrastructure/persistence/CalculatorDexieDatabase", () => {
    return {
        CalculatorDexieDatabase: class {
            public constructor() {
                throw new Error("IndexedDB unavailable");
            }
        },
    };
});

describe("CalculatorCompositionRoot persistence fallback", () => {
    it("falls back to in-memory repositories when IndexedDB construction fails", () => {
        Object.defineProperty(globalThis, "indexedDB", {
            value: {},
            configurable: true,
        });

        try {
            const root = new CalculatorCompositionRoot();

            expect(root.historyRepository).toBeInstanceOf(InMemoryHistoryRepository);
            expect(root.variablesRepository).toBeInstanceOf(InMemoryVariablesRepository);
        } finally {
            Object.defineProperty(globalThis, "indexedDB", {
                value: undefined,
                configurable: true,
            });
        }
    });
});
