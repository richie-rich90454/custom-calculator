import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { HistoryRepository } from "../../domain/repositories/HistoryRepository";
import type { SettingsRepository } from "../../domain/repositories/SettingsRepository";
import type { VariablesRepository } from "../../domain/repositories/VariablesRepository";
import type { CalculatorSessionOrchestrationService } from "./CalculatorSessionOrchestrationService";

export class DefaultCalculatorSessionOrchestrationService
  implements CalculatorSessionOrchestrationService
{
  public constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly variablesRepository: VariablesRepository,
    private readonly settingsRepository: SettingsRepository
  ) {}

  public async recordHistoryEntry(entry: HistoryEntry): Promise<void> {
    try {
      await this.historyRepository.saveHistoryEntry(entry);
    } catch {
      // Persistence is best effort; a failing write must not crash the app.
    }
  }

  public async refreshHistoryEntries(): Promise<readonly HistoryEntry[]> {
    try {
      return await this.historyRepository.loadHistoryEntries();
    } catch {
      return [];
    }
  }

  public async removeHistoryEntry(historyEntryId: string): Promise<void> {
    try {
      await this.historyRepository.deleteHistoryEntry(historyEntryId);
    } catch {
      // Persistence is best effort.
    }
  }

  public async clearHistoryEntries(): Promise<void> {
    try {
      await this.historyRepository.clearHistory();
    } catch {
      // Persistence is best effort.
    }
  }

  public async refreshVariables(): Promise<readonly VariableAssignment[]> {
    try {
      return await this.variablesRepository.loadVariables();
    } catch {
      return [];
    }
  }

  public async saveVariable(variable: VariableAssignment): Promise<void> {
    try {
      await this.variablesRepository.saveVariable(variable);
    } catch {
      // Persistence is best effort.
    }
  }

  public async removeVariable(variableName: string): Promise<void> {
    try {
      await this.variablesRepository.deleteVariable(variableName);
    } catch {
      // Persistence is best effort.
    }
  }

  public loadSettings(): CalculatorSettings | null {
    return this.settingsRepository.loadSettings();
  }

  public saveSettings(settings: CalculatorSettings): void {
    this.settingsRepository.saveSettings(settings);
  }
}
