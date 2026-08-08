import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorKeypadComponent } from "./CalculatorKeypadComponent";

describe("CalculatorKeypadComponent cursor placement", () => {
    it("places the cursor after an inserted digit", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit seven" }));
        await user.click(screen.getByRole("button", { name: "Digit two" }));

        expect(harness.store.getState().expressionText).toBe("72");
        expect(harness.store.getState().cursorPosition).toBe(2);
    });

    it("places the cursor after an inserted operator", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit five" }));
        await user.click(screen.getByRole("button", { name: "Addition" }));

        expect(harness.store.getState().expressionText).toBe("5+");
        expect(harness.store.getState().cursorPosition).toBe(2);
    });

    it("places the cursor after the opening parenthesis when inserting a function", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Sine function" }));

        expect(harness.store.getState().expressionText).toBe("sin(");
        expect(harness.store.getState().cursorPosition).toBe(4);
    });

    it("places the cursor after the opening parenthesis when inserting a square root", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Square root" }));

        expect(harness.store.getState().expressionText).toBe("sqrt(");
        expect(harness.store.getState().cursorPosition).toBe(5);
    });

    it("places the cursor at the first placeholder when inserting a template", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Insert symbolic derivative block" }));

        expect(harness.store.getState().expressionText).toBe("derivative(, x)");
        expect(harness.store.getState().cursorPosition).toBe(11);
    });

    it("does not move the cursor to the start after inserting a digit", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            expressionText: "56",
            cursorPosition: 2,
            selectionStart: 2,
            selectionEnd: 2,
        });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Digit three" }));

        expect(harness.store.getState().expressionText).toBe("563");
        expect(harness.store.getState().cursorPosition).toBe(3);
    });

    it("wraps a selection with a function call", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            expressionText: "x+1",
            cursorPosition: 3,
            selectionStart: 0,
            selectionEnd: 3,
        });

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Sine function" }));

        expect(harness.store.getState().expressionText).toBe("sin(x+1)");
        expect(harness.store.getState().cursorPosition).toBe(7);
    });

    it("places the cursor after an inserted constant", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorKeypadComponent />);

        await user.click(screen.getByRole("button", { name: "Pi constant" }));

        expect(harness.store.getState().expressionText).toBe("pi");
        expect(harness.store.getState().cursorPosition).toBe(2);
    });
});
