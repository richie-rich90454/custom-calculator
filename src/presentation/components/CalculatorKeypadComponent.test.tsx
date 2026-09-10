import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorKeypadComponent } from "./CalculatorKeypadComponent";

describe("CalculatorKeypadComponent", () => {
    it("inserts a digit into the expression when pressed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit seven" }));
        await user.click(screen.getByRole("button", { name: "Digit two" }));

        expect(harness.store.getState().expressionText).toBe("72");
    });

    it("inserts an operator when an operator key is pressed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit five" }));
        await user.click(screen.getByRole("button", { name: "Addition" }));
        await user.click(screen.getByRole("button", { name: "Digit three" }));

        expect(harness.store.getState().expressionText).toBe("5+3");
    });

    it("inserts a function with an opening parenthesis", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Insert a sine" }));

        expect(harness.store.getState().expressionText).toBe("sin(");
    });

    it("evaluates the expression with the equals key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit six" }));
        await user.click(screen.getByRole("button", { name: "Multiplication" }));
        await user.click(screen.getByRole("button", { name: "Digit seven" }));
        await user.click(screen.getByRole("button", { name: "Evaluate" }));

        expect(harness.store.getState().resultText).toBe("42");
    });

    it("clears the expression with the clear key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit nine" }));
        await user.click(screen.getByRole("button", { name: "Clear the expression and result" }));

        expect(harness.store.getState().expressionText).toBe("");
    });

    it("deletes the last character with the backspace key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit four" }));
        await user.click(screen.getByRole("button", { name: "Digit two" }));
        await user.click(screen.getByRole("button", { name: "Delete the token before the caret" }));

        expect(harness.store.getState().expressionText).toBe("4");
    });

    it("exposes accessible names for every key", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        expect(screen.getByRole("button", { name: "Digit zero" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Insert a sine" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Insert pi" })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Insert the previous answer" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Open the app menu" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Arm the shift layer" })).toBeInTheDocument();
    });

    it("inserts the previous answer with the ans key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            lastResultText: "42",
        });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const ansButton = screen.getByRole("button", {
            name: "Insert the previous answer",
        });

        ansButton.focus();
        await user.click(ansButton);

        expect(harness.store.getState().expressionText).toBe("ans");
    });

    it("inserts a close parenthesis with the close parenthesis key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Close parenthesis" }));

        expect(harness.store.getState().expressionText).toBe(")");
    });

    it("activates keys with the Enter key via keyboard", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });

        sevenButton.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().expressionText).toBe("7");
    });

    it("focuses the equals key in the side cluster", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const equalsButton = screen.getByRole("button", { name: "Evaluate" });

        equalsButton.focus();

        expect(equalsButton).toHaveFocus();
    });

    it("moves focus to the next key with the right arrow", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });
        const eightButton = screen.getByRole("button", { name: "Digit eight" });

        sevenButton.focus();
        await user.keyboard("{ArrowRight}");

        expect(eightButton).toHaveFocus();
    });

    it("moves focus within the top function key grid with arrow keys", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const integralButton = screen.getByRole("button", {
            name: "Insert a definite integral template",
        });
        const limitButton = screen.getByRole("button", { name: "Insert a limit template" });

        integralButton.focus();
        await user.keyboard("{ArrowRight}");

        expect(limitButton).toHaveFocus();
    });

    it("moves focus between digit grid rows with arrow keys", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });
        const fourButton = screen.getByRole("button", { name: "Digit four" });

        sevenButton.focus();
        await user.keyboard("{ArrowDown}");

        expect(fourButton).toHaveFocus();
    });

    it("moves focus down a row with the down arrow", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });
        const fourButton = screen.getByRole("button", { name: "Digit four" });

        sevenButton.focus();
        await user.keyboard("{ArrowDown}");

        expect(fourButton).toHaveFocus();
    });

    it("moves focus left with the left arrow", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });
        const eightButton = screen.getByRole("button", { name: "Digit eight" });

        eightButton.focus();
        await user.keyboard("{ArrowLeft}");

        expect(sevenButton).toHaveFocus();
    });

    it("keeps focus on the grid edge when moving left of the first column", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });

        sevenButton.focus();
        await user.keyboard("{ArrowLeft}");

        expect(sevenButton).toHaveFocus();
    });

    it("exposes exactly one tab stop per keypad toolbar", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const grid = screen.getByRole("toolbar", { name: "Calculator keypad" });
        const buttonsInGrid = Array.from(grid.querySelectorAll("button")) as HTMLButtonElement[];

        const tabStops = buttonsInGrid.filter((button) => button.tabIndex === 0);

        expect(tabStops).toHaveLength(1);
    });

    it("arms the shift layer with the shift key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Arm the shift layer" }));

        expect(harness.store.getState().activeModifierLayer).toBe(ModifierLayer.SHIFT);
    });

    it("consumes the shift layer after a layered key press", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Arm the shift layer" }));
        await user.click(screen.getByRole("button", { name: "Insert an arcsine, shift layer" }));

        expect(harness.store.getState().activeModifierLayer).toBe(ModifierLayer.NONE);
        expect(harness.store.getState().expressionText).toBe("asin(");
    });

    it("fails fast when the keymap is missing a layout key", () => {
        const harness = createCalculatorTestHarness();

        vi.spyOn(harness.compositionRoot.keymapDefinitionService, "getAllKeys").mockReturnValue([]);

        expect(() => renderWithCalculatorContext(harness, <CalculatorKeypadComponent />)).toThrow(
            "Unknown key id in keypad layout",
        );
    });
});
