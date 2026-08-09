import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorHyperbolicMenuComponent } from "./CalculatorHyperbolicMenuComponent";

describe("CalculatorHyperbolicMenuComponent", () => {
    it("lists the hyperbolic functions", () => {
        const harness = createCalculatorTestHarness({ hyperbolicMenuInverse: false });

        renderWithCalculatorContext(harness, <CalculatorHyperbolicMenuComponent />);

        expect(screen.getByRole("button", { name: "Insert sinh" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Insert tanh" })).toBeInTheDocument();
    });

    it("lists the inverse hyperbolic functions", () => {
        const harness = createCalculatorTestHarness({ hyperbolicMenuInverse: true });

        renderWithCalculatorContext(harness, <CalculatorHyperbolicMenuComponent />);

        expect(screen.getByRole("button", { name: "Insert asinh" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Insert acosh" })).toBeInTheDocument();
    });

    it("inserts the selected function", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorHyperbolicMenuComponent />);

        await user.click(screen.getByRole("button", { name: "Insert sinh" }));

        expect(harness.store.getState().expressionText).toBe("sinh(");
    });
});
