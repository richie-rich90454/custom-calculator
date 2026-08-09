import type { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import type { AngleMode } from "../../domain/model/AngleMode";
import type { HistoryEntry } from "../../domain/model/HistoryEntry";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import type { NumericMode } from "../../domain/model/NumericMode";
import type { ResultFormatMode } from "../../domain/model/ResultFormatMode";
import type { ScientificConstant } from "../../domain/model/ScientificConstant";
import type { ThemePreference } from "../../domain/model/ThemePreference";
import type { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { ScientificFunctionDefinition } from "../../domain/services/ScientificFunctionDefinition";
import type { CalculatorPanelName, CalculatorUiState } from "../../state/CalculatorUiState";
import type { AppModeDescriptor } from "../services/AppModeDescriptor";
import { DisplayStatusModel } from "./DisplayStatusModel";

export class CalculatorViewModel {
    public constructor(
        private readonly uiState: CalculatorUiState,
        private readonly compositionRoot: CalculatorCompositionRoot,
    ) {}

    public get expressionText(): string {
        return this.uiState.expressionText;
    }

    public get cursorPosition(): number {
        return this.uiState.cursorPosition;
    }

    public get selectionStart(): number {
        return this.uiState.selectionStart;
    }

    public get selectionEnd(): number {
        return this.uiState.selectionEnd;
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

    public get activeModifierLayer(): ModifierLayer {
        return this.uiState.activeModifierLayer;
    }

    public get activeAppMode(): string {
        return this.uiState.activeAppMode;
    }

    public get activeAppName(): string {
        return (
            this.compositionRoot.appModeRegistryService.getApp(this.uiState.activeAppMode)?.name ??
            "Calculator"
        );
    }

    public get appModes(): readonly AppModeDescriptor[] {
        return this.compositionRoot.appModeRegistryService.getAllApps();
    }

    public get isEngineeringEnabled(): boolean {
        return this.uiState.isEngineeringEnabled;
    }

    public get isFractionResultDisplayed(): boolean {
        return this.uiState.isFractionResultDisplayed;
    }

    public get resultFormatMode(): ResultFormatMode {
        return this.uiState.resultFormatMode;
    }

    public get resultFormatDigits(): number {
        return this.uiState.resultFormatDigits;
    }

    public get pendingVariablePrompts(): readonly string[] {
        return this.uiState.pendingVariablePrompts;
    }

    public get isStoreModeArmed(): boolean {
        return this.uiState.isStoreModeArmed;
    }

    public get isRecallModeArmed(): boolean {
        return this.uiState.isRecallModeArmed;
    }

    public get hyperbolicMenuInverse(): boolean {
        return this.uiState.hyperbolicMenuInverse;
    }

    public get isKaTeXPreviewEnabled(): boolean {
        return this.uiState.isKaTeXPreviewEnabled;
    }

    public get isApproximateResult(): boolean {
        return this.uiState.isApproximateResult;
    }

    public get status(): DisplayStatusModel {
        return new DisplayStatusModel(
            this.activeAppName,
            this.uiState.angleMode,
            this.uiState.numericMode,
            this.uiState.activeModifierLayer === ModifierLayer.SHIFT,
            this.uiState.activeModifierLayer === ModifierLayer.ALPHA,
            this.hasMemory,
            this.uiState.casEnabled,
            this.uiState.complexNumbersEnabled,
            this.uiState.bigIntSupported,
        );
    }
}
