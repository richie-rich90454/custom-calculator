import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { TableAppComponent } from "./TableAppComponent";

describe("TableAppComponent", () => {
    it("generates a table for f(x)", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <TableAppComponent />);

        await user.type(screen.getByLabelText("f(x)"), "x^2");

        await user.click(screen.getByRole("button", { name: "Generate the table" }));

        expect(screen.getByRole("grid", { name: "Function table" })).toBeInTheDocument();
        expect(screen.getByText("9")).toBeInTheDocument();
    });

    it("generates a table with both f(x) and g(x)", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <TableAppComponent />);

        await user.type(screen.getByLabelText("f(x)"), "x");
        await user.type(screen.getByLabelText("g(x)"), "x*2");

        await user.click(screen.getByRole("button", { name: "Generate the table" }));

        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getAllByRole("row").length).toBe(4);
    });

    it("surfaces an error for an invalid range", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <TableAppComponent />);

        await user.type(screen.getByLabelText("f(x)"), "x^2");
        await user.clear(screen.getByLabelText("End"));
        await user.type(screen.getByLabelText("End"), "0");

        await user.click(screen.getByRole("button", { name: "Generate the table" }));

        expect(screen.getByRole("status")).toHaveTextContent("end value must not be below");
    });

    it("clears a generated table", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <TableAppComponent />);

        await user.type(screen.getByLabelText("f(x)"), "x^2");
        await user.click(screen.getByRole("button", { name: "Generate the table" }));
        await user.click(screen.getByRole("button", { name: "Clear the table" }));

        expect(screen.queryByRole("grid", { name: "Function table" })).not.toBeInTheDocument();
    });

    it("renders a dash for non-finite values", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <TableAppComponent />);

        await user.clear(screen.getByLabelText("Start"));
        await user.type(screen.getByLabelText("Start"), "-1");
        await user.type(screen.getByLabelText("f(x)"), "sqrt(x)");
        await user.type(screen.getByLabelText("g(x)"), "sqrt(x)");

        await user.click(screen.getByRole("button", { name: "Generate the table" }));

        expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    });
});
