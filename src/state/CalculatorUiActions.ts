import { AngleMode } from "../domain/model/AngleMode";
import { NumericMode } from "../domain/model/NumericMode";
import { ThemePreference } from "../domain/model/ThemePreference";

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
}
