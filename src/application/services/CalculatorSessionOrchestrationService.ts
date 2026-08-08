import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { VariableAssignment } from "../../domain/model/VariableAssignment";

export interface CalculatorSessionOrchestrationService {
    recordHistoryEntry(entry: HistoryEntry): Promise<void>;
    refreshHistoryEntries(): Promise<readonly HistoryEntry[]>;
    removeHistoryEntry(historyEntryId: string): Promise<void>;
    clearHistoryEntries(): Promise<void>;
    refreshVariables(): Promise<readonly VariableAssignment[]>;
    saveVariable(variable: VariableAssignment): Promise<void>;
    removeVariable(variableName: string): Promise<void>;
    loadSettings(): CalculatorSettings | null;
    saveSettings(settings: CalculatorSettings): void;
}
