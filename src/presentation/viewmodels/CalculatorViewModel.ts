import type { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import type { AngleMode } from "../../domain/model/AngleMode";
import type { HistoryEntry } from "../../domain/model/HistoryEntry";
import type { NumericMode } from "../../domain/model/NumericMode";
import type { ScientificConstant } from "../../domain/model/ScientificConstant";
import type { ThemePreference } from "../../domain/model/ThemePreference";
import type { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { ScientificFunctionDefinition } from "../../domain/services/ScientificFunctionDefinition";
import type { CalculatorPanelName, CalculatorUiState } from "../../state/CalculatorUiState";

export class CalculatorViewModel {
  public constructor(
    private readonly uiState: CalculatorUiState,
    private readonly compositionRoot: CalculatorCompositionRoot
  ) {}

  public get expressionText(): string {
    return this.uiState.expressionText;
  }

  public get resultText(): string | null {
    return this.uiState.resultText;
  }

  public get errorText(): string | null {
    return this.uiState.errorText;
  }

  public get angleMode(): AngleMode {
    return this.uiState.angleMode;
  }

  public get numericMode(): NumericMode {
    return this.uiState.numericMode;
  }

  public get complexNumbersEnabled(): boolean {
    return this.uiState.complexNumbersEnabled;
  }

  public get casEnabled(): boolean {
    return this.uiState.casEnabled;
  }

  public get bigIntSupported(): boolean {
    return this.uiState.bigIntSupported;
  }

  public get themePreference(): ThemePreference {
    return this.uiState.themePreference;
  }

  public get memoryValueText(): string | null {
    return this.uiState.memoryValueText;
  }

  public get activePanel(): CalculatorPanelName {
    return this.uiState.activePanel;
  }

  public get statusMessage(): string | null {
    return this.uiState.statusMessage;
  }

  public get historyEntries(): readonly HistoryEntry[] {
    return this.uiState.historyEntries;
  }

  public get variables(): readonly VariableAssignment[] {
    return this.uiState.variables;
  }

  public get functions(): readonly ScientificFunctionDefinition[] {
    return this.compositionRoot.functionCatalogService.getAllFunctions();
  }

  public get constants(): readonly ScientificConstant[] {
    return this.compositionRoot.constantCatalogService.getAllConstants();
  }

  public get supportedNumericModes(): readonly NumericMode[] {
    return this.compositionRoot.numericModePolicyService.getSupportedNumericModes();
  }

  public get hasMemory(): boolean {
    return this.uiState.memoryValueText !== null;
  }
}
