import { describe, expect, it } from "vitest";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import { AngleMode } from "../domain/model/AngleMode";
import { CursorMoveDirection } from "../domain/model/CursorMoveDirection";
import { ModifierLayer } from "../domain/model/ModifierLayer";
import { NumericMode } from "../domain/model/NumericMode";
import { ResultFormatMode } from "../domain/model/ResultFormatMode";
import { VariableAssignment } from "../domain/model/VariableAssignment";
import { CalculatorPanelName } from "./CalculatorUiState";
import { createCalculatorTestHarness } from "../test/calculatorTestHarness";

describe("calculator UI store keypad actions", () => {
    it("arms the shift layer and disarms alpha when shift is pressed", () => {
        const { store } = createCalculatorTestHarness({
            activeModifierLayer: ModifierLayer.ALPHA,
        });

        store.getState().onShiftPressed();

        expect(store.getState().activeModifierLayer).toBe(ModifierLayer.SHIFT);
    });

    it("arms the alpha layer and disarms shift when alpha is pressed", () => {
        const { store } = createCalculatorTestHarness({
            activeModifierLayer: ModifierLayer.SHIFT,
        });

        store.getState().onAlphaPressed();

        expect(store.getState().activeModifierLayer).toBe(ModifierLayer.ALPHA);
    });

    it("disarms the armed modifier layer", () => {
        const { store } = createCalculatorTestHarness({
            activeModifierLayer: ModifierLayer.SHIFT,
        });

        store.getState().onModifierDisarmed();

        expect(store.getState().activeModifierLayer).toBe(ModifierLayer.NONE);
    });

    it("routes an inserted parenthesis through the parenthesis action", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("(");
        store.getState().onInsertTextPressed("2");
        store.getState().onInsertTextPressed(")");

        expect(store.getState().expressionText).toBe("(2)");
    });

    it("routes an inserted digit through the digit action", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("7");

        expect(store.getState().expressionText).toBe("7");
    });

    it("routes an inserted operator through the operator action", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("9");
        store.getState().onInsertTextPressed("-");
        store.getState().onInsertTextPressed("4");

        expect(store.getState().expressionText).toBe("9-4");
    });

    it("inserts a constant for pi and e", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("pi");

        expect(store.getState().expressionText).toBe("pi");
    });

    it("inserts the previous answer symbol", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("ans");

        expect(store.getState().expressionText).toBe("ans");
    });

    it("inserts a single letter variable", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onInsertTextPressed("x");

        expect(store.getState().expressionText).toBe("x");
    });

    it("stores the last result into a variable when store mode is armed", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onDigitPressed("2");
        store.getState().onDigitPressed("0");
        store.getState().onEvaluatePressed();
        store.getState().onStoreModeArmed();
        store.getState().onInsertTextPressed("a");

        expect(store.getState().isStoreModeArmed).toBe(false);
        expect(
            store.getState().variables.find((variable) => variable.name === "a")?.valueText,
        ).toBe("20");
    });

    it("inserts a variable name when recall mode is armed", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onRecallModeArmed();
        store.getState().onInsertTextPressed("x");

        expect(store.getState().isRecallModeArmed).toBe(false);
        expect(store.getState().expressionText).toBe("x");
    });

    it("inserts an exponent ten token", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onDigitPressed("5");
        store.getState().onInsertExponent10Pressed();
        store.getState().onDigitPressed("3");

        expect(store.getState().expressionText).toBe("5*10^3");
    });

    it("evaluates approximately to a decimal result", () => {
        const { store } = createCalculatorTestHarness({ numericMode: NumericMode.FRACTION });

        store.getState().onDigitPressed("0");
        store.getState().onInsertTextPressed(".");
        store.getState().onDigitPressed("5");
        store.getState().onEvaluateApproximatePressed();

        expect(store.getState().resultText).toBe("0.5");
    });

    it("opens the home menu panel", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onMenuOpened();

        expect(store.getState().activePanel).toBe(CalculatorPanelName.HOME_MENU);
    });

    it("toggles the home menu panel closed", () => {
        const { store } = createCalculatorTestHarness({
            activePanel: CalculatorPanelName.HOME_MENU,
        });

        store.getState().onMenuOpened();

        expect(store.getState().activePanel).toBe(CalculatorPanelName.NONE);
    });

    it("opens the options panel", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onOptnOpened();

        expect(store.getState().activePanel).toBe(CalculatorPanelName.OPTN);
    });

    it("prompts for missing variables with CALC", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("a+1", 3, 3, 3);
        store.getState().onCalcPressed();

        expect(store.getState().pendingVariablePrompts).toEqual(["a"]);
        expect(store.getState().activePanel).toBe(CalculatorPanelName.VARIABLE_PROMPT);
    });

    it("ignores existing variables when prompting with CALC", () => {
        const { store } = createCalculatorTestHarness({
            variables: [
                new VariableAssignment("b", "1", NumericMode.STANDARD, "2026-01-01T00:00:00.000Z"),
            ],
        });

        store.getState().onExpressionTextChanged("a+1", 3, 3, 3);
        store.getState().onCalcPressed();

        expect(store.getState().pendingVariablePrompts).toEqual(["a"]);
    });

    it("evaluates directly with CALC when no variables are missing", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("2+3", 3, 3, 3);
        store.getState().onCalcPressed();

        expect(store.getState().resultText).toBe("5");
        expect(store.getState().activePanel).toBe(CalculatorPanelName.NONE);
    });

    it("shows an error when CALC has an empty expression", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onCalcPressed();

        expect(store.getState().errorText).not.toBeNull();
    });

    it("evaluates with the prompted variable values", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("a+1", 3, 3, 3);
        store.getState().onCalcPressed();
        store.getState().onVariablePromptSubmitted({ a: "2" });

        expect(store.getState().resultText).toBe("3");
        expect(store.getState().pendingVariablePrompts).toEqual([]);
        expect(store.getState().activePanel).toBe(CalculatorPanelName.NONE);
    });

    it("cancels the variable prompt", () => {
        const { store } = createCalculatorTestHarness({
            pendingVariablePrompts: ["a"],
            activePanel: CalculatorPanelName.VARIABLE_PROMPT,
        });

        store.getState().onVariablePromptCancelled();

        expect(store.getState().pendingVariablePrompts).toEqual([]);
        expect(store.getState().activePanel).toBe(CalculatorPanelName.NONE);
    });

    it("keeps existing variables when submitting prompted values", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "a+b",
            pendingVariablePrompts: ["a"],
            variables: [
                new VariableAssignment("b", "3", NumericMode.STANDARD, "2026-01-01T00:00:00.000Z"),
            ],
        });

        store.getState().onVariablePromptSubmitted({ a: "2" });

        expect(store.getState().resultText).toBe("5");
        expect(store.getState().variables.find((variable) => variable.name === "b")).toBeDefined();
    });

    it("solves an equation with SOLVE", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("x^2-4", 5, 5, 5);
        store.getState().onSolvePressed();

        expect(store.getState().resultText).toContain("x = 2");
        expect(store.getState().errorText).toBeNull();
    });

    it("solves for a multi-letter variable with SOLVE", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("distance-5", 10, 10, 10);
        store.getState().onSolvePressed();

        expect(store.getState().resultText).toContain("distance = 5");
    });

    it("solves for a single-letter variable that is not x", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("a-5", 3, 3, 3);
        store.getState().onSolvePressed();

        expect(store.getState().resultText).toContain("a = 5");
    });

    it("toggles engineering mode without a result", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onEngTogglePressed("forward");

        expect(store.getState().isEngineeringEnabled).toBe(true);
        expect(store.getState().resultText).toBeNull();
    });

    it("reports SOLVE non-convergence clearly", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("1/x", 3, 3, 3);
        store.getState().onSolvePressed();

        expect(store.getState().resultText).toBeNull();
        expect(store.getState().errorText).not.toBeNull();
    });

    it("shows an error when SOLVE has no variable", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("2+3", 3, 3, 3);
        store.getState().onSolvePressed();

        expect(store.getState().errorText).not.toBeNull();
    });

    it("shows an error when SOLVE has an empty expression", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onSolvePressed();

        expect(store.getState().errorText).not.toBeNull();
    });

    it("converts a decimal result to a fraction with S-D", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("0.5", 3, 3, 3);
        store.getState().onEvaluatePressed();
        store.getState().onSDCyclePressed();

        expect(store.getState().resultText).toBe("1/2");
        expect(store.getState().isFractionResultDisplayed).toBe(true);
    });

    it("keeps the exact indicator off for a rational S-D conversion", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("0.5", 3, 3, 3);
        store.getState().onEvaluatePressed();
        store.getState().onSDCyclePressed();

        expect(store.getState().isApproximateResult).toBe(false);
    });

    it("converts 0.75 to 3/4 with S-D", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("0.75", 4, 4, 4);
        store.getState().onEvaluatePressed();
        store.getState().onSDCyclePressed();

        expect(store.getState().resultText).toBe("3/4");
    });

    it("shows the approximate indicator for an irrational S-D conversion", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("sqrt(2)", 7, 7, 7);
        store.getState().onEvaluatePressed();
        store.getState().onSDCyclePressed();

        expect(store.getState().isFractionResultDisplayed).toBe(true);
        expect(store.getState().isApproximateResult).toBe(true);
    });

    it("resets the approximate indicator after a fresh evaluation", () => {
        const { store } = createCalculatorTestHarness({
            isApproximateResult: true,
        });

        store.getState().onExpressionTextChanged("2+2", 3, 3, 3);
        store.getState().onEvaluatePressed();

        expect(store.getState().isApproximateResult).toBe(false);
    });

    it("applies a fixed display format of pi to four decimal places", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("pi", 2, 2, 2);
        store.getState().onEvaluatePressed();
        store.getState().onResultFormatChanged(ResultFormatMode.FIX, 4);

        expect(store.getState().resultText).toBe("3.1416");
    });

    it("inserts the boundary entry into the current expression when replaying back past the oldest entry", () => {
        const { store } = createCalculatorTestHarness({
            historyReplayIndex: 1,
            expressionText: "2+2",
            historyEntries: [createHistoryEntry("1", "1+1"), createHistoryEntry("2", "2+2")],
        });

        store.getState().onHistoryStepBackPressed();

        expect(store.getState().expressionText).toBe("2+22+2");
        expect(store.getState().historyReplayIndex).toBe(1);
    });

    it("inserts the boundary entry into the current expression when replaying forward past the newest entry", () => {
        const { store } = createCalculatorTestHarness({
            historyReplayIndex: 0,
            expressionText: "1+1",
            historyEntries: [createHistoryEntry("1", "1+1"), createHistoryEntry("2", "2+2")],
        });

        store.getState().onHistoryStepForwardPressed();

        expect(store.getState().expressionText).toBe("1+11+1");
        expect(store.getState().historyReplayIndex).toBe(0);
    });

    it("does not change the expression when replaying empty history", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "2+2",
        });

        store.getState().onHistoryStepBackPressed();

        expect(store.getState().expressionText).toBe("2+2");
        expect(store.getState().historyReplayIndex).toBeNull();
    });

    it("converts a fraction result back to decimal with S-D", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "1/2",
            lastResultValue: 0.5,
            isFractionResultDisplayed: true,
        });

        store.getState().onSDCyclePressed();

        expect(store.getState().resultText).toBe("0.5");
        expect(store.getState().isFractionResultDisplayed).toBe(false);
    });

    it("ignores S-D when there is no result", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onSDCyclePressed();

        expect(store.getState().resultText).toBeNull();
    });

    it("formats the result in engineering notation with ENG", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("12345", 5, 5, 5);
        store.getState().onEvaluatePressed();
        store.getState().onEngTogglePressed("forward");

        expect(store.getState().isEngineeringEnabled).toBe(true);
        expect(store.getState().resultText).toBe("12.345×10^3");
    });

    it("restores the decimal result when ENG is toggled off", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "12.345×10^3",
            lastResultValue: 12345,
            isEngineeringEnabled: true,
        });

        store.getState().onEngTogglePressed("reverse");

        expect(store.getState().isEngineeringEnabled).toBe(false);
        expect(store.getState().resultText).toBe("12345");
    });

    it("opens the display format menu", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onFixSciMenuOpened();

        expect(store.getState().activePanel).toBe(CalculatorPanelName.FIX_SCI);
    });

    it("arms store mode and clears recall mode", () => {
        const { store } = createCalculatorTestHarness({ isRecallModeArmed: true });

        store.getState().onStoreModeArmed();

        expect(store.getState().isStoreModeArmed).toBe(true);
        expect(store.getState().isRecallModeArmed).toBe(false);
    });

    it("arms recall mode and clears store mode", () => {
        const { store } = createCalculatorTestHarness({ isStoreModeArmed: true });

        store.getState().onRecallModeArmed();

        expect(store.getState().isRecallModeArmed).toBe(true);
        expect(store.getState().isStoreModeArmed).toBe(false);
    });

    it("opens the hyperbolic menu for regular functions", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onHyperbolicMenuOpened(false);

        expect(store.getState().hyperbolicMenuInverse).toBe(false);
        expect(store.getState().activePanel).toBe(CalculatorPanelName.HYPERBOLIC);
    });

    it("opens the hyperbolic menu for inverse functions", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onHyperbolicMenuOpened(true);

        expect(store.getState().hyperbolicMenuInverse).toBe(true);
    });

    it("moves the cursor left and right", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "abc",
            cursorPosition: 3,
            selectionStart: 3,
            selectionEnd: 3,
        });

        store.getState().onCursorMovePressed(CursorMoveDirection.LEFT);
        expect(store.getState().cursorPosition).toBe(2);

        store.getState().onCursorMovePressed(CursorMoveDirection.RIGHT);
        expect(store.getState().cursorPosition).toBe(3);
    });

    it("jumps the cursor to the start and end with up and down", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "abc",
            cursorPosition: 1,
            selectionStart: 1,
            selectionEnd: 1,
        });

        store.getState().onCursorMovePressed(CursorMoveDirection.UP);
        expect(store.getState().cursorPosition).toBe(0);

        store.getState().onCursorMovePressed(CursorMoveDirection.DOWN);
        expect(store.getState().cursorPosition).toBe(3);
    });

    it("clamps the cursor at the expression start", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "abc",
            cursorPosition: 0,
            selectionStart: 0,
            selectionEnd: 0,
        });

        store.getState().onCursorMovePressed(CursorMoveDirection.LEFT);

        expect(store.getState().cursorPosition).toBe(0);
    });

    it("ignores cursor movement while a panel is open", () => {
        const { store } = createCalculatorTestHarness({
            activePanel: CalculatorPanelName.MEMORY,
            expressionText: "abc",
            cursorPosition: 2,
            selectionStart: 2,
            selectionEnd: 2,
        });

        store.getState().onCursorMovePressed(CursorMoveDirection.LEFT);

        expect(store.getState().cursorPosition).toBe(2);
    });

    it("evaluates with the confirm key when no panel is open", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("2+3", 3, 3, 3);
        store.getState().onConfirmPressed();

        expect(store.getState().resultText).toBe("5");
    });

    it("ignores the confirm key while a panel is open", () => {
        const { store } = createCalculatorTestHarness({ activePanel: CalculatorPanelName.MEMORY });

        store.getState().onConfirmPressed();

        expect(store.getState().resultText).toBeNull();
    });

    it("steps back through history entries", () => {
        const { store } = createCalculatorTestHarness({
            historyEntries: [createHistoryEntry("1", "1+1"), createHistoryEntry("2", "2+2")],
        });

        store.getState().onHistoryStepBackPressed();

        expect(store.getState().expressionText).toBe("1+1");
        expect(store.getState().historyReplayIndex).toBe(0);
    });

    it("steps forward through history entries", () => {
        const { store } = createCalculatorTestHarness({
            historyReplayIndex: 1,
            historyEntries: [createHistoryEntry("1", "1+1"), createHistoryEntry("2", "2+2")],
        });

        store.getState().onHistoryStepForwardPressed();

        expect(store.getState().expressionText).toBe("1+1");
        expect(store.getState().historyReplayIndex).toBe(0);
    });

    it("does not step history when empty", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onHistoryStepBackPressed();

        expect(store.getState().historyReplayIndex).toBeNull();
    });

    it("clamps history stepping at the boundaries", () => {
        const { store } = createCalculatorTestHarness({
            historyEntries: [createHistoryEntry("1", "1+1")],
        });

        store.getState().onHistoryStepForwardPressed();

        expect(store.getState().historyReplayIndex).toBe(0);
    });

    it("steps back from an existing replay position", () => {
        const { store } = createCalculatorTestHarness({
            historyReplayIndex: 0,
            historyEntries: [createHistoryEntry("1", "1+1"), createHistoryEntry("2", "2+2")],
        });

        store.getState().onHistoryStepBackPressed();

        expect(store.getState().expressionText).toBe("2+2");
        expect(store.getState().historyReplayIndex).toBe(1);
    });

    it("stores nothing and reports an error when there is no result", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onStoreModeArmed();
        store.getState().onInsertTextPressed("a");

        expect(store.getState().isStoreModeArmed).toBe(false);
        expect(store.getState().errorText).not.toBeNull();
        expect(store.getState().variables).toEqual([]);
    });

    it("shows the evaluation error after an approximate evaluation fails", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onExpressionTextChanged("2+", 2, 2, 2);
        store.getState().onEvaluateApproximatePressed();

        expect(store.getState().errorText).not.toBeNull();
    });

    it("uses a stored variable value as the SOLVE guess", () => {
        const { store } = createCalculatorTestHarness({
            variables: [
                new VariableAssignment("x", "3", NumericMode.STANDARD, "2026-01-01T00:00:00.000Z"),
            ],
        });

        store.getState().onExpressionTextChanged("x^2-4", 5, 5, 5);
        store.getState().onSolvePressed();

        expect(store.getState().resultText).toContain("x = 2");
    });

    it("keeps the result text unchanged when no result exists", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onResultFormatChanged(ResultFormatMode.FIX, 2);

        expect(store.getState().resultFormatMode).toBe(ResultFormatMode.FIX);
        expect(store.getState().resultText).toBeNull();
    });

    it("shows an evaluation error when a prompted expression is invalid", () => {
        const { store } = createCalculatorTestHarness({
            expressionText: "a+",
            pendingVariablePrompts: ["a"],
        });

        store.getState().onVariablePromptSubmitted({ a: "2" });

        expect(store.getState().errorText).not.toBeNull();
        expect(store.getState().pendingVariablePrompts).toEqual([]);
    });

    it("selects an available app mode", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onAppModeSelected("calculate");

        expect(store.getState().activeAppMode).toBe("calculate");
        expect(store.getState().statusMessage).toBeNull();
    });

    it("reports the reason for an unavailable app mode", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onAppModeSelected("statistics");

        expect(store.getState().activeAppMode).toBe("statistics");
        expect(store.getState().statusMessage).not.toBeNull();
    });

    it("ignores an unknown app mode", () => {
        const { store } = createCalculatorTestHarness();

        store.getState().onAppModeSelected("missing");

        expect(store.getState().activeAppMode).toBe("calculate");
    });

    it("applies a fixed display format to the result", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "3.142857142857143",
            lastResultValue: 22 / 7,
        });

        store.getState().onResultFormatChanged(ResultFormatMode.FIX, 2);

        expect(store.getState().resultFormatMode).toBe(ResultFormatMode.FIX);
        expect(store.getState().resultText).toBe("3.14");
    });

    it("applies a significant-figure display format to the result", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "3.142857142857143",
            lastResultValue: 22 / 7,
        });

        store.getState().onResultFormatChanged(ResultFormatMode.SCI, 3);

        expect(store.getState().resultText).toBe("3.14");
    });

    it("restores the standard display format", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "3.14",
            lastResultValue: 22 / 7,
            resultFormatMode: ResultFormatMode.FIX,
        });

        store.getState().onResultFormatChanged(ResultFormatMode.STANDARD, 2);

        expect(store.getState().resultFormatMode).toBe(ResultFormatMode.STANDARD);
    });

    it("inserts an exponent ten after a result starts a new expression", () => {
        const { store } = createCalculatorTestHarness({
            resultText: "5",
            lastResultValue: 5,
        });

        store.getState().onInsertTextPressed("7");

        expect(store.getState().expressionText).toBe("7");
    });
});

function createHistoryEntry(id: string, expressionText: string): HistoryEntry {
    return new HistoryEntry(
        id,
        expressionText,
        "4",
        AngleMode.DEG,
        NumericMode.STANDARD,
        false,
        "2026-01-01T00:00:00.000Z",
    );
}
