import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { ConstantsPanelComponent } from "./ConstantsPanelComponent";

describe("ConstantsPanelComponent", () => {
    it("renders the panel with a search field and constant list", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <ConstantsPanelComponent />);

        expect(screen.getByRole("heading", { name: "Constants" })).toBeInTheDocument();
        expect(screen.getByLabelText("Search constants")).toBeInTheDocument();
        expect(screen.getByLabelText("Constants list")).toBeInTheDocument();
    });

    it("inserts a constant into the expression", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <ConstantsPanelComponent />);

        await user.click(screen.getByRole("button", { name: "Insert constant Pi" }));

        expect(harness.store.getState().expressionText).toBe("pi");
    });

    it("filters constants through the search field", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <ConstantsPanelComponent />);

        await user.type(screen.getByLabelText("Search constants"), "planck");

        expect(
            screen.getByRole("button", { name: "Insert constant Planck constant" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Insert constant Pi" }),
        ).not.toBeInTheDocument();
    });

    it("filters constants by category through the selector", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <ConstantsPanelComponent />);

        await user.click(screen.getByRole("button", { name: /constant category/i }));
        await user.click(await screen.findByRole("option", { name: "Chemistry" }));

        expect(
            screen.queryByRole("button", { name: "Insert constant Pi" }),
        ).not.toBeInTheDocument();
    });

    it("shows an empty state when no constants match the search", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <ConstantsPanelComponent />);

        await user.type(screen.getByLabelText("Search constants"), "zzzzz");

        expect(screen.getByText("No constants match your search.")).toBeInTheDocument();
    });
});
