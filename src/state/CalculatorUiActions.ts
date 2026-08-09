import { AngleMode } from "../domain/model/AngleMode";
import { NumericMode } from "../domain/model/NumericMode";
import { ResultFormatMode } from "../domain/model/ResultFormatMode";
import { ThemePreference } from "../domain/model/ThemePreference";
import type { CursorMoveDirection } from "../domain/model/CursorMoveDirection";

export interface CalculatorUiActions {
    onDigitPressed(digit: string): void;
    onOperatorPressed(operator: string): void;
    onFunctionPressed(functionName: string): void;
    onConstantPressed(constantId: string): void;
    onVariablePressed(variableName: string): void;
    onParenthesisPressed(parenthesis: string): void;
    onDeleteBackwardPressed(): void;
    onDeleteForwardPressed(): void;
    onDeleteWordBackwardPressed(): void;
    onClearPressed(): void;
    onEvaluatePressed(): void;
    onAngleModeTogglePressed(): void;
    onAngleModeChanged(angleMode: AngleMode): void;
    onNumericModeChanged(numericMode: NumericMode): void;
    onComplexNumbersTogglePressed(): void;
    onCasTogglePressed(): void;
    onThemeChanged(themePreference: ThemePreference): void;
    onExpressionTextChanged(
        expressionText: string,
        cursorPosition: number,
        selectionStart: number,
        selectionEnd: number,
    ): void;
    onPanelOpened(panelName: string): void;
    onHistoryEntrySelected(historyEntryId: string): void;
    onHistoryEntryDeleted(historyEntryId: string): void;
    onHistoryCleared(): void;
    onSaveVariablePressed(variableName: string): void;
    onVariableDeleted(variableName: string): void;
    onMemoryAddPressed(): void;
    onMemorySubtractPressed(): void;
    onMemoryRecallPressed(): void;
    onMemoryClearPressed(): void;
    onSimplifyPressed(): void;
    onExpandPressed(): void;
    onDifferentiatePressed(variableName: string): void;

    onShiftPressed(): void;
    onAlphaPressed(): void;
    onModifierDisarmed(): void;
    onInsertTextPressed(value: string): void;
    onInsertFunctionPressed(functionName: string): void;
    onInsertTemplatePressed(templateName: string): void;
    onInsertExponent10Pressed(): void;
    onEvaluateApproximatePressed(): void;
    onMenuOpened(): void;
    onOptnOpened(): void;
    onCalcPressed(): void;
    onSolvePressed(): void;
    onSDCyclePressed(): void;
    onEngTogglePressed(direction: "forward" | "reverse"): void;
    onFixSciMenuOpened(): void;
    onStoreModeArmed(): void;
    onRecallModeArmed(): void;
    onHyperbolicMenuOpened(inverse: boolean): void;
    onCursorMovePressed(direction: CursorMoveDirection): void;
    onConfirmPressed(): void;
    onHistoryStepBackPressed(): void;
    onHistoryStepForwardPressed(): void;
    onAppModeSelected(appModeId: string): void;
    onResultFormatChanged(resultFormatMode: ResultFormatMode, digits: number): void;
    onVariablePromptSubmitted(values: Readonly<Record<string, string>>): void;
    onVariablePromptCancelled(): void;
    onKaTeXPreviewToggled(): void;
}
