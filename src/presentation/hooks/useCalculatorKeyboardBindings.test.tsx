import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { useCalculatorKeyboardBindings } from "./useCalculatorKeyboardBindings";
import { CalculatorDisplayComponent } from "../components/CalculatorDisplayComponent";

function KeyboardBindingProbe() {
    useCalculatorKeyboardBindings();

    return <CalculatorDisplayComponent />;
}

describe("useCalculatorKeyboardBindings", () => {
    it("evaluates with Enter outside a typing context", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        harness.store.getState().onExpressionTextChanged("2+3", 3, 3, 3);

        await user.keyboard("{Enter}");

        expect(harness.store.getState().resultText).toBe("5");
    });

    it("opens the history panel with Control+H", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        await user.keyboard("{Control>}{h}{/Control}");

        expect(harness.store.getState().activePanel).toBe("HISTORY");
    });

    it("toggles the angle mode with Control+D", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        await user.keyboard("{Control>}{d}{/Control}");

        expect(harness.store.getState().angleMode).not.toBe("DEG");
    });

    it("closes an open panel with Escape", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            activePanel: CalculatorPanelName.MEMORY,
        });

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        await user.keyboard("{Escape}");

        expect(harness.store.getState().activePanel).toBe("NONE");
    });

    it("clears the expression with Escape when no panel is open", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        harness.store.getState().onExpressionTextChanged("42", 2, 2, 2);

        await user.click(screen.getByLabelText("Calculator expression input"));
        await user.tab();
        await user.keyboard("{Escape}");

        expect(harness.store.getState().expressionText).toBe("");
    });

    it("opens the variable prompt with F5 and submits from the keyboard", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        harness.store.getState().onExpressionTextChanged("a+1", 3, 3, 3);

        await user.tab();
        await user.keyboard("{F5}");

        expect(harness.store.getState().activePanel).toBe("VARIABLE_PROMPT");
        expect(harness.store.getState().pendingVariablePrompts).toEqual(["a"]);

        harness.store.getState().onVariablePromptSubmitted({ a: "2" });

        expect(harness.store.getState().resultText).toBe("3");
        expect(harness.store.getState().pendingVariablePrompts).toEqual([]);
    });

    it("solves an equation with F6", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeyboardBindingProbe />);

        harness.store.getState().onExpressionTextChanged("x^2-4", 5, 5, 5);

        await user.tab();
        await user.keyboard("{F6}");

        expect(harness.store.getState().resultText).toContain("x = 2");
    });
});
