import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AngleMode } from "../../domain/model/AngleMode";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorOptnPanelComponent } from "./CalculatorOptnPanelComponent";

describe("CalculatorOptnPanelComponent", () => {
    it("shows the three options tabs", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorOptnPanelComponent />);

        expect(screen.getByRole("tab", { name: "Constants" })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: "Angle Mode" })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: "Display Format" })).toBeInTheDocument();
    });

    it("changes the angle mode from the angle tab", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorOptnPanelComponent />);

        await user.click(screen.getByRole("tab", { name: "Angle Mode" }));
        await user.click(screen.getByRole("button", { name: "Use radians" }));

        expect(harness.store.getState().angleMode).toBe(AngleMode.RAD);
    });

    it("changes the numeric mode from the format tab", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorOptnPanelComponent />);

        await user.click(screen.getByRole("tab", { name: "Display Format" }));
        await user.click(screen.getByRole("button", { name: "Use EXACT_DECIMAL number format" }));

        expect(harness.store.getState().numericMode).toBe("EXACT_DECIMAL");
    });
});
