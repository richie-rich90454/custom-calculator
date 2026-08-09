import { AngleMode } from "../domain/model/AngleMode";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import { ModifierLayer } from "../domain/model/ModifierLayer";
import { NumericMode } from "../domain/model/NumericMode";
import { ResultFormatMode } from "../domain/model/ResultFormatMode";
import { ThemePreference } from "../domain/model/ThemePreference";
import { VariableAssignment } from "../domain/model/VariableAssignment";

export enum CalculatorPanelName {
    NONE = "NONE",
    HISTORY = "HISTORY",
    CONSTANTS = "CONSTANTS",
    VARIABLES = "VARIABLES",
    MEMORY = "MEMORY",
    SETTINGS = "SETTINGS",
    CAS = "CAS",
    CALCULUS = "CALCULUS",
    HOME_MENU = "HOME_MENU",
    OPTN = "OPTN",
    VARIABLE_PROMPT = "VARIABLE_PROMPT",
    HYPERBOLIC = "HYPERBOLIC",
    FIX_SCI = "FIX_SCI",
}

export interface CalculatorUiState {
    expressionText: string;
    cursorPosition: number;
    selectionStart: number;
    selectionEnd: number;
    resultText: string | null;
    errorText: string | null;
    lastResultText: string | null;
    lastResultValue: unknown;
    angleMode: AngleMode;
    numericMode: NumericMode;
    complexNumbersEnabled: boolean;
    casEnabled: boolean;
    bigIntSupported: boolean;
    themePreference: ThemePreference;
    historyEntries: readonly HistoryEntry[];
    variables: readonly VariableAssignment[];
    memoryValueText: string | null;
    activePanel: CalculatorPanelName;
    statusMessage: string | null;
    activeModifierLayer: ModifierLayer;
    activeAppMode: string;
    pendingVariablePrompts: readonly string[];
    isStoreModeArmed: boolean;
    isRecallModeArmed: boolean;
    isEngineeringEnabled: boolean;
    isFractionResultDisplayed: boolean;
    resultFormatMode: ResultFormatMode;
    resultFormatDigits: number;
    hyperbolicMenuInverse: boolean;
    historyReplayIndex: number | null;
    isKaTeXPreviewEnabled: boolean;
    isApproximateResult: boolean;
}
