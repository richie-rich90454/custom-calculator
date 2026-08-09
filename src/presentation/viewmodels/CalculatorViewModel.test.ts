import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { AngleMode } from "../../domain/model/AngleMode";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { NumericMode } from "../../domain/model/NumericMode";
import { ResultFormatMode } from "../../domain/model/ResultFormatMode";
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
        activeModifierLayer: ModifierLayer.NONE,
        activeAppMode: "calculate",
        pendingVariablePrompts: [],
        isStoreModeArmed: false,
        isRecallModeArmed: false,
        isEngineeringEnabled: false,
        isFractionResultDisplayed: false,
        resultFormatMode: ResultFormatMode.STANDARD,
        resultFormatDigits: 2,
        hyperbolicMenuInverse: false,
        historyReplayIndex: null,
        isKaTeXPreviewEnabled: true,
        isApproximateResult: false,
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

    it("exposes the app mode and modifier state", () => {
        expect(viewModel.activeAppMode).toBe("calculate");
        expect(viewModel.activeAppName).toBe("Calculate");
        expect(viewModel.activeModifierLayer).toBe(ModifierLayer.NONE);
        expect(viewModel.appModes).toHaveLength(10);
    });

    it("falls back to the calculator name for an unknown app", () => {
        const unknownViewModel = new CalculatorViewModel(
            { ...buildUiState(), activeAppMode: "missing" },
            new CalculatorCompositionRoot(),
        );

        expect(unknownViewModel.activeAppName).toBe("Calculator");
    });

    it("exposes result format and prompt state", () => {
        const promptViewModel = new CalculatorViewModel(
            {
                ...buildUiState(),
                resultFormatMode: ResultFormatMode.FIX,
                resultFormatDigits: 4,
                pendingVariablePrompts: ["a"],
                isStoreModeArmed: true,
                isRecallModeArmed: false,
                isEngineeringEnabled: true,
                isFractionResultDisplayed: true,
                hyperbolicMenuInverse: true,
            },
            new CalculatorCompositionRoot(),
        );

        expect(promptViewModel.resultFormatMode).toBe(ResultFormatMode.FIX);
        expect(promptViewModel.resultFormatDigits).toBe(4);
        expect(promptViewModel.pendingVariablePrompts).toEqual(["a"]);
        expect(promptViewModel.isStoreModeArmed).toBe(true);
        expect(promptViewModel.isRecallModeArmed).toBe(false);
        expect(promptViewModel.isEngineeringEnabled).toBe(true);
        expect(promptViewModel.isFractionResultDisplayed).toBe(true);
        expect(promptViewModel.hyperbolicMenuInverse).toBe(true);
    });

    it("builds a display status model from the current state", () => {
        const statusViewModel = new CalculatorViewModel(
            {
                ...buildUiState(),
                angleMode: AngleMode.RAD,
                activeModifierLayer: ModifierLayer.SHIFT,
                memoryValueText: "10",
                casEnabled: true,
                complexNumbersEnabled: true,
                bigIntSupported: false,
            },
            new CalculatorCompositionRoot(),
        );

        const status = statusViewModel.status;

        expect(status.activeAppName).toBe("Calculate");
        expect(status.angleMode).toBe(AngleMode.RAD);
        expect(status.angleModeLabel).toBe("RAD");
        expect(status.shiftArmed).toBe(true);
        expect(status.alphaArmed).toBe(false);
        expect(status.hasMemory).toBe(true);
        expect(status.casEnabled).toBe(true);
        expect(status.complexNumbersEnabled).toBe(true);
        expect(status.bigIntSupported).toBe(false);
    });
});
