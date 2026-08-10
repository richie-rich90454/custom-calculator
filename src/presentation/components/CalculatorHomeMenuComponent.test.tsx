import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorHomeMenuComponent } from "./CalculatorHomeMenuComponent";

describe("CalculatorHomeMenuComponent", () => {
    it("renders all ten apps with badges", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorHomeMenuComponent />);

        for (const name of [
            "Calculate app, number 1",
            "Complex app, number 2",
            "Base-N app, number 3",
            "Matrix app, number 4",
            "Vector app, number 5",
            "Statistics app, number 6",
            "Table app, number 7",
            "Equation app, number 8",
            "Calculus app, number 9",
            "Ratio app, number 0",
        ]) {
            expect(screen.getByRole("button", { name: name })).toBeInTheDocument();
        }
    });

    it("selects an app when pressed", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorHomeMenuComponent />);

        await user.click(screen.getByRole("button", { name: "Matrix app, number 4" }));

        expect(harness.store.getState().activeAppMode).toBe("matrix");
    });

    it("marks the active app as pressed", () => {
        const harness = createCalculatorTestHarness({ activeAppMode: "statistics" });

        renderWithCalculatorContext(harness, <CalculatorHomeMenuComponent />);

        expect(screen.getByRole("button", { name: "Statistics app, number 6" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });

    it("activates an app with the keyboard", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorHomeMenuComponent />);

        const ratioButton = screen.getByRole("button", { name: "Ratio app, number 0" });

        ratioButton.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().activeAppMode).toBe("ratio");
        expect(harness.store.getState().activePanel).toBe("NONE");
    });

    it("closes the menu and shows the availability reason for an unavailable app", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({ activePanel: CalculatorPanelName.HOME_MENU });

        renderWithCalculatorContext(harness, <CalculatorHomeMenuComponent />);

        const calculusButton = screen.getByRole("button", { name: "Calculus app, number 9" });

        calculusButton.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().activeAppMode).toBe("calculus");
        expect(harness.store.getState().statusMessage).not.toBeNull();
    });
});
