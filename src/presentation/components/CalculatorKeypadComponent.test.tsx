import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

        await user.click(screen.getByRole("button", { name: "Sine function" }));

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
        await user.click(screen.getByRole("button", { name: "Clear expression" }));

        expect(harness.store.getState().expressionText).toBe("");
    });

    it("deletes the last character with the backspace key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit four" }));
        await user.click(screen.getByRole("button", { name: "Digit two" }));
        await user.click(screen.getByRole("button", { name: "Backspace" }));

        expect(harness.store.getState().expressionText).toBe("4");
    });

    it("exposes accessible names for every key", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        expect(screen.getByRole("button", { name: "Digit zero" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sine function" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Pi constant" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous answer" })).toBeInTheDocument();
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

    it("moves focus up a row with the up arrow", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });
        const fourButton = screen.getByRole("button", { name: "Digit four" });

        fourButton.focus();
        await user.keyboard("{ArrowUp}");

        expect(sevenButton).toHaveFocus();
    });

    it("keeps focus on the grid edge when moving left of the first column", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const clearButton = screen.getByRole("button", {
            name: "Clear expression",
        });

        clearButton.focus();
        await user.keyboard("{ArrowLeft}");

        expect(clearButton).toHaveFocus();
    });

    it("keeps focus on the grid edge when moving above the first row", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const clearButton = screen.getByRole("button", {
            name: "Clear expression",
        });

        clearButton.focus();
        await user.keyboard("{ArrowUp}");

        expect(clearButton).toHaveFocus();
    });

    it("keeps focus on the grid edge when moving below the last row", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const equalsButton = screen.getByRole("button", { name: "Evaluate" });

        equalsButton.focus();
        await user.keyboard("{ArrowDown}");

        expect(equalsButton).toHaveFocus();
    });

    it("exposes exactly one tab stop per keypad grid", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        const grid = screen.getByRole("grid", { name: "Calculator keypad" });
        const buttonsInCoreGrid = Array.from(
            grid.querySelectorAll("button"),
        ) as HTMLButtonElement[];

        const tabStops = buttonsInCoreGrid.filter((button) => button.tabIndex === 0);

        expect(tabStops).toHaveLength(1);
    });

    it("renders CAS operation keys when CAS is enabled", () => {
        const harness = createCalculatorTestHarness({ casEnabled: true });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        expect(screen.getByRole("button", { name: "Insert CAS block" })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Insert CAS derivative block" }),
        ).toBeInTheDocument();
    });

    it("hides CAS operation keys when CAS is disabled", () => {
        const harness = createCalculatorTestHarness({ casEnabled: false });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        expect(screen.queryByRole("button", { name: "Insert CAS block" })).not.toBeInTheDocument();
    });

    it("inserts a CAS block when the CAS key is pressed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({ casEnabled: true });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Insert CAS block" }));

        expect(harness.store.getState().expressionText).toBe("cas(");
    });

    it("renders calculus operation keys regardless of CAS mode", () => {
        const harness = createCalculatorTestHarness({ casEnabled: false });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        expect(
            screen.getByRole("button", { name: "Insert symbolic derivative block" }),
        ).toBeInTheDocument();
    });

    it("inserts a derivative block with a template when the calculus key is pressed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Insert symbolic derivative block" }));

        expect(harness.store.getState().expressionText).toBe("derivative(, x)");
        expect(harness.store.getState().cursorPosition).toBe(11);
    });
});
