import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { EquationAppComponent } from "./EquationAppComponent";

describe("EquationAppComponent", () => {
    it("solves a quadratic with real roots", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.type(screen.getByLabelText("Coefficient of x^2"), "1");
        await user.type(screen.getByLabelText("Coefficient of x^1"), "-3");
        await user.type(screen.getByLabelText("Coefficient of x^0"), "2");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("x1 = 1");
        expect(status).toHaveTextContent("x2 = 2");
    });

    it("solves a cubic", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Polynomial degree/ }));
        await user.click(screen.getByRole("option", { name: "Degree 3" }));

        await user.type(screen.getByLabelText("Coefficient of x^3"), "1");
        await user.type(screen.getByLabelText("Coefficient of x^2"), "-6");
        await user.type(screen.getByLabelText("Coefficient of x^1"), "11");
        await user.type(screen.getByLabelText("Coefficient of x^0"), "-6");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("x1 = 1");
        expect(status).toHaveTextContent("x2 = 2");
        expect(status).toHaveTextContent("x3 = 3");
    });

    it("solves a quadratic with complex roots", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.type(screen.getByLabelText("Coefficient of x^2"), "1");
        await user.type(screen.getByLabelText("Coefficient of x^1"), "0");
        await user.type(screen.getByLabelText("Coefficient of x^0"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("x1 = 0 - 1i");
        expect(status).toHaveTextContent("x2 = 0 + 1i");
    });

    it("reports an error for a zero leading coefficient", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.type(screen.getByLabelText("Coefficient of x^2"), "0");
        await user.type(screen.getByLabelText("Coefficient of x^1"), "3");
        await user.type(screen.getByLabelText("Coefficient of x^0"), "2");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("leading coefficient");
    });

    it("solves a two-unknown simultaneous system", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Equation mode/ }));
        await user.click(screen.getByRole("option", { name: "Simultaneous" }));

        await user.type(screen.getByLabelText("Equation 1 coefficient 1"), "2");
        await user.type(screen.getByLabelText("Equation 1 coefficient 2"), "3");
        await user.type(screen.getByLabelText("Equation 1 constant"), "8");
        await user.type(screen.getByLabelText("Equation 2 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 2 coefficient 2"), "-1");
        await user.type(screen.getByLabelText("Equation 2 constant"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("x1 = 2.2");
        expect(status).toHaveTextContent("x2 = 1.2");
    });

    it("reports a singular simultaneous system clearly", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Equation mode/ }));
        await user.click(screen.getByRole("option", { name: "Simultaneous" }));

        await user.type(screen.getByLabelText("Equation 1 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 1 coefficient 2"), "1");
        await user.type(screen.getByLabelText("Equation 1 constant"), "1");
        await user.type(screen.getByLabelText("Equation 2 coefficient 1"), "2");
        await user.type(screen.getByLabelText("Equation 2 coefficient 2"), "2");
        await user.type(screen.getByLabelText("Equation 2 constant"), "2");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("singular or under-determined");
    });

    it("solves a three-unknown simultaneous system", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Equation mode/ }));
        await user.click(screen.getByRole("option", { name: "Simultaneous" }));
        await user.click(screen.getByRole("button", { name: /Unknown count/ }));
        await user.click(screen.getByRole("option", { name: "3 unknowns" }));

        await user.type(screen.getByLabelText("Equation 1 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 1 coefficient 2"), "1");
        await user.type(screen.getByLabelText("Equation 1 coefficient 3"), "1");
        await user.type(screen.getByLabelText("Equation 1 constant"), "6");
        await user.type(screen.getByLabelText("Equation 2 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 2 coefficient 2"), "-1");
        await user.type(screen.getByLabelText("Equation 2 coefficient 3"), "1");
        await user.type(screen.getByLabelText("Equation 2 constant"), "0");
        await user.type(screen.getByLabelText("Equation 3 coefficient 1"), "2");
        await user.type(screen.getByLabelText("Equation 3 coefficient 2"), "1");
        await user.type(screen.getByLabelText("Equation 3 coefficient 3"), "-1");
        await user.type(screen.getByLabelText("Equation 3 constant"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("x1 = 0.333333333");
        expect(status).toHaveTextContent("x2 = 3");
        expect(status).toHaveTextContent("x3 = 2.666666667");
    });

    it("reports an error for a non-numeric polynomial coefficient", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.type(screen.getByLabelText("Coefficient of x^2"), "a");
        await user.type(screen.getByLabelText("Coefficient of x^1"), "1");
        await user.type(screen.getByLabelText("Coefficient of x^0"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("every coefficient field");
    });

    it("reports an error for a non-numeric simultaneous constant", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Equation mode/ }));
        await user.click(screen.getByRole("option", { name: "Simultaneous" }));

        await user.type(screen.getByLabelText("Equation 1 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 1 coefficient 2"), "1");
        await user.type(screen.getByLabelText("Equation 1 constant"), "a");
        await user.type(screen.getByLabelText("Equation 2 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 2 coefficient 2"), "-1");
        await user.type(screen.getByLabelText("Equation 2 constant"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("every equation field");
    });

    it("reports an error when a coefficient field is empty", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("every coefficient field");
    });

    it("reports an error for a blank simultaneous field", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <EquationAppComponent />);

        await user.click(screen.getByRole("button", { name: /Equation mode/ }));
        await user.click(screen.getByRole("option", { name: "Simultaneous" }));

        await user.type(screen.getByLabelText("Equation 1 coefficient 1"), "1");
        await user.type(screen.getByLabelText("Equation 1 coefficient 2"), "1");
        await user.type(screen.getByLabelText("Equation 1 constant"), "1");

        await user.click(screen.getByRole("button", { name: "Solve the equation" }));

        expect(screen.getByRole("status")).toHaveTextContent("every equation field");
    });
});
