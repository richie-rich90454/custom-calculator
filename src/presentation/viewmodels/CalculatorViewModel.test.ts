import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ThemePreference } from "../../domain/model/ThemePreference";
import { CalculatorPanelName, type CalculatorUiState } from "../../state/CalculatorUiState";
import { CalculatorViewModel } from "./CalculatorViewModel";

function buildUiState(): CalculatorUiState {
    return {
        expressionText: "2+3",
        cursorPosition: 2,
        selectionStart: 1,
        selectionEnd: 3,
        resultText: "5",
        errorText: null,
        lastResultText: "5",
        lastResultValue: 5,
        angleMode: AngleMode.DEG,
        numericMode: NumericMode.STANDARD,
        complexNumbersEnabled: false,
        casEnabled: false,
        bigIntSupported: true,
        themePreference: ThemePreference.SYSTEM,
        historyEntries: [],
        variables: [],
        memoryValueText: null,
        activePanel: CalculatorPanelName.NONE,
        statusMessage: null,
    };
}

describe("CalculatorViewModel", () => {
    const viewModel = new CalculatorViewModel(buildUiState(), new CalculatorCompositionRoot());

    it("exposes the editing and result getters", () => {
        expect(viewModel.expressionText).toBe("2+3");
        expect(viewModel.cursorPosition).toBe(2);
        expect(viewModel.selectionStart).toBe(1);
        expect(viewModel.selectionEnd).toBe(3);
        expect(viewModel.resultText).toBe("5");
        expect(viewModel.errorText).toBeNull();
    });

    it("exposes the mode and state getters", () => {
        expect(viewModel.angleMode).toBe(AngleMode.DEG);
        expect(viewModel.numericMode).toBe(NumericMode.STANDARD);
        expect(viewModel.complexNumbersEnabled).toBe(false);
        expect(viewModel.casEnabled).toBe(false);
        expect(viewModel.bigIntSupported).toBe(true);
        expect(viewModel.themePreference).toBe(ThemePreference.SYSTEM);
        expect(viewModel.memoryValueText).toBeNull();
        expect(viewModel.activePanel).toBe(CalculatorPanelName.NONE);
        expect(viewModel.statusMessage).toBeNull();
        expect(viewModel.hasMemory).toBe(false);
    });

    it("exposes the function and constant catalogs", () => {
        expect(viewModel.functions.length).toBeGreaterThan(0);
        expect(viewModel.constants.length).toBeGreaterThan(0);
        expect(viewModel.supportedNumericModes).toContain(NumericMode.STANDARD);
    });
});
