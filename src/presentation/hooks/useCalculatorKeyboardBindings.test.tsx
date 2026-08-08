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
});
