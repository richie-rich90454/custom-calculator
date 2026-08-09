import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import { CalculatorShellComponent } from "./CalculatorShellComponent";

describe("CalculatorShellComponent", () => {
    it("renders the full calculator shell without errors", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        expect(screen.getByLabelText("Calculator expression input")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cycle angle mode" })).toBeInTheDocument();
    });

    it("supports a complete digit, operator, and equals flow", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Digit one" }));
        await user.click(screen.getByRole("button", { name: "Digit two" }));
        await user.click(screen.getByRole("button", { name: "Addition" }));
        await user.click(screen.getByRole("button", { name: "Digit three" }));
        await user.click(screen.getByRole("button", { name: "Evaluate" }));

        expect(harness.store.getState().resultText).toBe("15");
        expect(screen.getByText("= 15")).toBeInTheDocument();
    });

    it("opens the history panel through the status bar", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open history panel" }));

        expect(harness.store.getState().activePanel).toBe("HISTORY");
        expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
    });

    it("renders the constants panel with search when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open constants panel" }));

        expect(screen.getByRole("heading", { name: "Constants" })).toBeInTheDocument();
        expect(screen.getByLabelText("Search constants")).toBeInTheDocument();
    });

    it("renders the settings panel when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open settings panel" }));

        expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
        expect(
            screen.getByRole("switch", { name: "Enable CAS-style symbolic operations" }),
        ).toBeInTheDocument();
    });

    it("renders the CAS panel when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open CAS panel" }));

        expect(screen.getByRole("heading", { name: "CAS" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Simplify" })).toBeInTheDocument();
    });

    it("renders the calculus panel when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open calculus panel" }));

        expect(screen.getByRole("heading", { name: "Calculus" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "∫" })).toBeInTheDocument();
    });

    it("renders the variables panel when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open variables panel" }));

        expect(screen.getByRole("heading", { name: "Variables" })).toBeInTheDocument();
        expect(screen.getByLabelText("Variable name")).toBeInTheDocument();
    });

    it("renders the memory panel when opened", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open memory panel" }));

        expect(screen.getByRole("heading", { name: "Memory" })).toBeInTheDocument();
        expect(screen.getByText("Memory is empty.")).toBeInTheDocument();
    });

    it("closes the active panel through the dialog close button", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open history panel" }));

        expect(harness.store.getState().activePanel).toBe("HISTORY");

        await user.click(screen.getByRole("button", { name: "Close" }));

        expect(harness.store.getState().activePanel).toBe("NONE");
    });

    it("opens the home menu through the menu key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open the app menu" }));

        expect(harness.store.getState().activePanel).toBe("HOME_MENU");
        expect(screen.getByRole("button", { name: "Matrix app, number 4" })).toBeInTheDocument();
    });

    it("opens the options catalog through the options key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open the options catalog" }));

        expect(harness.store.getState().activePanel).toBe("OPTN");
        expect(screen.getByRole("tab", { name: "Angle Mode" })).toBeInTheDocument();
    });

    it("opens the variable prompt when CALC finds missing variables", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.type(screen.getByLabelText("Calculator expression input"), "a+1");
        await user.click(screen.getByRole("button", { name: "Evaluate with a variable prompt" }));

        expect(harness.store.getState().activePanel).toBe("VARIABLE_PROMPT");
        expect(screen.getByLabelText("Value for a")).toBeInTheDocument();
    });

    it("opens the hyperbolic menu through the hyp key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Open the hyperbolic menu" }));

        expect(harness.store.getState().activePanel).toBe("HYPERBOLIC");
        expect(screen.getByRole("button", { name: "Insert sinh" })).toBeInTheDocument();
    });

    it("opens the display format menu through the shift S-D key", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Arm the shift layer" }));
        await user.click(
            screen.getByRole("button", { name: "Open the display format menu, shift layer" }),
        );

        expect(harness.store.getState().activePanel).toBe("FIX_SCI");
        expect(screen.getByRole("button", { name: "Fix decimal places" })).toBeInTheDocument();
    });

    it("cancels the variable prompt when the dialog is closed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            activePanel: CalculatorPanelName.VARIABLE_PROMPT,
            pendingVariablePrompts: ["a"],
        });

        renderWithCalculatorContext(harness, <CalculatorShellComponent />);

        await user.click(screen.getByRole("button", { name: "Close" }));

        expect(harness.store.getState().activePanel).toBe("NONE");
        expect(harness.store.getState().pendingVariablePrompts).toEqual([]);
    });
});
