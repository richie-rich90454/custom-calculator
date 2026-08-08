import { describe, expect, it, vi } from "vitest";
import type { CalculatorUiActions } from "../../state/CalculatorUiActions";
import { CalculatorKeyCommandDispatcherService } from "./CalculatorKeyCommandDispatcherService";
import { CalculatorKeyKind, type CalculatorKeyDefinition } from "./CalculatorKeyDefinition";

function buildActions(): CalculatorUiActions {
    return {
        onDigitPressed: vi.fn(),
        onOperatorPressed: vi.fn(),
        onFunctionPressed: vi.fn(),
        onConstantPressed: vi.fn(),
        onVariablePressed: vi.fn(),
        onParenthesisPressed: vi.fn(),
        onDeleteBackwardPressed: vi.fn(),
        onDeleteForwardPressed: vi.fn(),
        onDeleteWordBackwardPressed: vi.fn(),
        onClearPressed: vi.fn(),
        onEvaluatePressed: vi.fn(),
        onAngleModeTogglePressed: vi.fn(),
        onAngleModeChanged: vi.fn(),
        onNumericModeChanged: vi.fn(),
        onComplexNumbersTogglePressed: vi.fn(),
        onCasTogglePressed: vi.fn(),
        onThemeChanged: vi.fn(),
        onExpressionTextChanged: vi.fn(),
        onPanelOpened: vi.fn(),
        onHistoryEntrySelected: vi.fn(),
        onHistoryEntryDeleted: vi.fn(),
        onHistoryCleared: vi.fn(),
        onSaveVariablePressed: vi.fn(),
        onVariableDeleted: vi.fn(),
        onMemoryAddPressed: vi.fn(),
        onMemorySubtractPressed: vi.fn(),
        onMemoryRecallPressed: vi.fn(),
        onMemoryClearPressed: vi.fn(),
        onSimplifyPressed: vi.fn(),
        onExpandPressed: vi.fn(),
        onDifferentiatePressed: vi.fn(),
    };
}

function buildKey(overrides: Partial<CalculatorKeyDefinition> = {}): CalculatorKeyDefinition {
    return {
        id: "test",
        label: "T",
        ariaLabel: "Test key",
        kind: CalculatorKeyKind.DIGIT,
        value: "1",
        ...overrides,
    };
}

describe("CalculatorKeyCommandDispatcherService", () => {
    const dispatcher = new CalculatorKeyCommandDispatcherService();

    it("dispatches a digit press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(buildKey(), actions);

        expect(actions.onDigitPressed).toHaveBeenCalledWith("1");
    });

    it("dispatches an operator press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.OPERATOR, value: "+" }),
            actions,
        );

        expect(actions.onOperatorPressed).toHaveBeenCalledWith("+");
    });

    it("dispatches a function press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.FUNCTION, value: "sin" }),
            actions,
        );

        expect(actions.onFunctionPressed).toHaveBeenCalledWith("sin");
    });

    it("dispatches a CAS operation press as a function insertion", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.CAS_OPERATION, value: "cas" }),
            actions,
        );

        expect(actions.onFunctionPressed).toHaveBeenCalledWith("cas");
    });

    it("dispatches a constant press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.CONSTANT, value: "pi" }),
            actions,
        );

        expect(actions.onConstantPressed).toHaveBeenCalledWith("pi");
    });

    it("dispatches a parenthesis press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.PARENTHESIS, value: "(" }),
            actions,
        );

        expect(actions.onParenthesisPressed).toHaveBeenCalledWith("(");
    });

    it("dispatches a clear press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(buildKey({ kind: CalculatorKeyKind.CLEAR }), actions);

        expect(actions.onClearPressed).toHaveBeenCalledOnce();
    });

    it("dispatches a delete backward press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.DELETE_BACKWARD }),
            actions,
        );

        expect(actions.onDeleteBackwardPressed).toHaveBeenCalledOnce();
    });

    it("dispatches a delete forward press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.DELETE_FORWARD }),
            actions,
        );

        expect(actions.onDeleteForwardPressed).toHaveBeenCalledOnce();
    });

    it("dispatches an evaluate press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(buildKey({ kind: CalculatorKeyKind.EVALUATE }), actions);

        expect(actions.onEvaluatePressed).toHaveBeenCalledOnce();
    });

    it("dispatches an answer variable press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(
            buildKey({ kind: CalculatorKeyKind.ANS, value: "ans" }),
            actions,
        );

        expect(actions.onVariablePressed).toHaveBeenCalledWith("ans");
    });

    it("dispatches a memory recall press", () => {
        const actions = buildActions();

        dispatcher.dispatchKeyPressed(buildKey({ kind: CalculatorKeyKind.MEMORY_RECALL }), actions);

        expect(actions.onMemoryRecallPressed).toHaveBeenCalledOnce();
    });
});
