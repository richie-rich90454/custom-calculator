import { AngleMode } from "../domain/model/AngleMode";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import { NumericMode } from "../domain/model/NumericMode";
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
}
