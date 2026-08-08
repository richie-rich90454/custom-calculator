import { CalculatorSettings } from "../domain/model/CalculatorSettings";
import { CalculatorPanelName, type CalculatorUiState } from "./CalculatorUiState";

export function createInitialCalculatorUiState(
    settings: CalculatorSettings,
    bigIntSupported: boolean,
    statusMessage: string | null,
): CalculatorUiState {
    return {
        expressionText: "",
        cursorPosition: 0,
        selectionStart: 0,
        selectionEnd: 0,
        resultText: null,
        errorText: null,
        lastResultText: null,
        lastResultValue: null,
        angleMode: settings.angleMode,
        numericMode: settings.numericMode,
        complexNumbersEnabled: settings.complexNumbersEnabled,
        casEnabled: settings.casEnabled,
        bigIntSupported: bigIntSupported,
        themePreference: settings.themePreference,
        historyEntries: [],
        variables: [],
        memoryValueText: null,
        activePanel: CalculatorPanelName.NONE,
        statusMessage: statusMessage,
    };
}
