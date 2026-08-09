import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorVariablePromptComponent } from "./CalculatorVariablePromptComponent";

describe("CalculatorVariablePromptComponent", () => {
    it("asks for a single missing variable", () => {
        const harness = createCalculatorTestHarness({ pendingVariablePrompts: ["a"] });

        renderWithCalculatorContext(harness, <CalculatorVariablePromptComponent />);

        expect(screen.getByLabelText("Value for a")).toBeInTheDocument();
    });

    it("asks for multiple missing variables", () => {
        const harness = createCalculatorTestHarness({ pendingVariablePrompts: ["a", "b"] });

        renderWithCalculatorContext(harness, <CalculatorVariablePromptComponent />);

        expect(screen.getByLabelText("Value for a")).toBeInTheDocument();
        expect(screen.getByLabelText("Value for b")).toBeInTheDocument();
    });

    it("submits the entered values", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            pendingVariablePrompts: ["a"],
            expressionText: "a",
        });

        renderWithCalculatorContext(harness, <CalculatorVariablePromptComponent />);

        await user.type(screen.getByLabelText("Value for a"), "2");
        await user.click(screen.getByRole("button", { name: "Evaluate" }));

        expect(harness.store.getState().resultText).toBe("2");
        expect(harness.store.getState().pendingVariablePrompts).toEqual([]);
    });

    it("cancels without evaluating", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            pendingVariablePrompts: ["a"],
            expressionText: "a+1",
        });

        renderWithCalculatorContext(harness, <CalculatorVariablePromptComponent />);

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(harness.store.getState().pendingVariablePrompts).toEqual([]);
        expect(harness.store.getState().resultText).toBeNull();
    });
});
