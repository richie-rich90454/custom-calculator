import { describe, expect, it, vi } from "vitest";
import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ThemePreference } from "../../domain/model/ThemePreference";
import type { HistoryRepository } from "../../domain/repositories/HistoryRepository";
import type { SettingsRepository } from "../../domain/repositories/SettingsRepository";
import type { VariablesRepository } from "../../domain/repositories/VariablesRepository";
import { DefaultCalculatorSessionOrchestrationService } from "./DefaultCalculatorSessionOrchestrationService";

function buildHistoryRepository(overrides: Partial<HistoryRepository> = {}): HistoryRepository {
    return {
        loadHistoryEntries: vi.fn(async () => []),
        saveHistoryEntry: vi.fn(async () => undefined),
        deleteHistoryEntry: vi.fn(async () => undefined),
        clearHistory: vi.fn(async () => undefined),
        ...overrides,
    };
}

function buildVariablesRepository(
    overrides: Partial<VariablesRepository> = {},
): VariablesRepository {
    return {
        loadVariables: vi.fn(async () => []),
        saveVariable: vi.fn(async () => undefined),
        deleteVariable: vi.fn(async () => undefined),
        clearVariables: vi.fn(async () => undefined),
        ...overrides,
    };
}

function buildSettingsRepository(overrides: Partial<SettingsRepository> = {}): SettingsRepository {
    return {
        loadSettings: vi.fn(() => null),
        saveSettings: vi.fn(() => undefined),
        clearSettings: vi.fn(() => undefined),
        ...overrides,
    };
}

function buildEntry(): HistoryEntry {
    return new HistoryEntry(
        "1",
        "2+2",
        "4",
        AngleMode.DEG,
        NumericMode.STANDARD,
        false,
        "2026-01-01T00:00:00.000Z",
    );
}

function buildVariable(): VariableAssignment {
    return new VariableAssignment("x", "4", NumericMode.STANDARD, "2026-01-01T00:00:00.000Z");
}

describe("DefaultCalculatorSessionOrchestrationService", () => {
    it("records a history entry through the repository", async () => {
        const historyRepository = buildHistoryRepository();
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await service.recordHistoryEntry(buildEntry());

        expect(historyRepository.saveHistoryEntry).toHaveBeenCalledWith(buildEntry());
    });

    it("swallows history write failures", async () => {
        const historyRepository = buildHistoryRepository({
            saveHistoryEntry: vi.fn(async () => {
                throw new Error("disk full");
            }),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await expect(service.recordHistoryEntry(buildEntry())).resolves.toBeUndefined();
    });

    it("refreshes history entries", async () => {
        const historyRepository = buildHistoryRepository({
            loadHistoryEntries: vi.fn(async () => [buildEntry()]),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await expect(service.refreshHistoryEntries()).resolves.toEqual([buildEntry()]);
    });

    it("returns an empty list when history refresh fails", async () => {
        const historyRepository = buildHistoryRepository({
            loadHistoryEntries: vi.fn(async () => {
                throw new Error("boom");
            }),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await expect(service.refreshHistoryEntries()).resolves.toEqual([]);
    });

    it("removes a history entry", async () => {
        const historyRepository = buildHistoryRepository();
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await service.removeHistoryEntry("1");

        expect(historyRepository.deleteHistoryEntry).toHaveBeenCalledWith("1");
    });

    it("clears history entries", async () => {
        const historyRepository = buildHistoryRepository();
        const service = new DefaultCalculatorSessionOrchestrationService(
            historyRepository,
            buildVariablesRepository(),
            buildSettingsRepository(),
        );

        await service.clearHistoryEntries();

        expect(historyRepository.clearHistory).toHaveBeenCalledOnce();
    });

    it("refreshes variables", async () => {
        const variablesRepository = buildVariablesRepository({
            loadVariables: vi.fn(async () => [buildVariable()]),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            buildHistoryRepository(),
            variablesRepository,
            buildSettingsRepository(),
        );

        await expect(service.refreshVariables()).resolves.toEqual([buildVariable()]);
    });

    it("returns an empty list when variable refresh fails", async () => {
        const variablesRepository = buildVariablesRepository({
            loadVariables: vi.fn(async () => {
                throw new Error("boom");
            }),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            buildHistoryRepository(),
            variablesRepository,
            buildSettingsRepository(),
        );

        await expect(service.refreshVariables()).resolves.toEqual([]);
    });

    it("saves and removes a variable", async () => {
        const variablesRepository = buildVariablesRepository();
        const service = new DefaultCalculatorSessionOrchestrationService(
            buildHistoryRepository(),
            variablesRepository,
            buildSettingsRepository(),
        );

        await service.saveVariable(buildVariable());
        await service.removeVariable("x");

        expect(variablesRepository.saveVariable).toHaveBeenCalledWith(buildVariable());
        expect(variablesRepository.deleteVariable).toHaveBeenCalledWith("x");
    });

    it("loads and saves settings", () => {
        const settings = new CalculatorSettings(
            AngleMode.RAD,
            NumericMode.STANDARD,
            false,
            false,
            ThemePreference.DARK,
        );
        const settingsRepository = buildSettingsRepository({
            loadSettings: vi.fn(() => settings),
        });
        const service = new DefaultCalculatorSessionOrchestrationService(
            buildHistoryRepository(),
            buildVariablesRepository(),
            settingsRepository,
        );

        expect(service.loadSettings()).toEqual(settings);

        service.saveSettings(settings);

        expect(settingsRepository.saveSettings).toHaveBeenCalledWith(settings);
    });
});
