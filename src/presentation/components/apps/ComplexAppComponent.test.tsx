import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { ComplexAppComponent } from "./ComplexAppComponent";

describe("ComplexAppComponent", () => {
    function buildHarness() {
        return createCalculatorTestHarness({ complexNumbersEnabled: true });
    }

    async function setOperand(
        user: ReturnType<typeof userEvent.setup>,
        label: "A" | "B",
        re: string,
        im: string,
    ): Promise<void> {
        await user.clear(screen.getByLabelText(`${label} real part`));
        await user.type(screen.getByLabelText(`${label} real part`), re);
        await user.clear(screen.getByLabelText(`${label} imaginary part`));
        await user.type(screen.getByLabelText(`${label} imaginary part`), im);
    }

    it("multiplies two rectangular complex numbers", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "3", "4");
        await setOperand(user, "B", "1", "-2");
        await user.click(screen.getByRole("button", { name: "Multiply complex numbers" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/11 - 2i/)).toBeInTheDocument();
    });

    it("computes the conjugate of a complex number", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "3", "4");
        await user.click(screen.getByRole("button", { name: "Conjugate of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/3 - 4i/)).toBeInTheDocument();
    });

    it("computes the absolute value of a complex number", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "3", "4");
        await user.click(screen.getByRole("button", { name: "Absolute value of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/\|A\| = 5/)).toBeInTheDocument();
    });

    it("computes the argument of a complex number", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "1");
        await user.click(screen.getByRole("button", { name: "Argument of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/arg\(A\) = 0\.7853/)).toBeInTheDocument();
    });

    it("accepts polar entry and computes an absolute value", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await user.click(screen.getByRole("button", { name: /A form/ }));
        await user.click(screen.getByRole("option", { name: "Polar r ∠ θ" }));

        await user.clear(screen.getByLabelText("A radius"));
        await user.type(screen.getByLabelText("A radius"), "5");
        await user.clear(screen.getByLabelText("A angle"));
        await user.type(screen.getByLabelText("A angle"), String(Math.atan2(4, 3)));

        await user.click(screen.getByRole("button", { name: "Absolute value of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/\|A\| = 5/)).toBeInTheDocument();
    });

    it("reports an error when a binary operation has an invalid operand", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "2");
        await user.click(screen.getByRole("button", { name: "Add complex numbers" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/valid values/)).toBeInTheDocument();
    });

    it("subtracts two complex numbers", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "5", "6");
        await setOperand(user, "B", "2", "3");
        await user.click(screen.getByRole("button", { name: "Subtract complex numbers" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/3 \+ 3i/)).toBeInTheDocument();
    });

    it("divides two complex numbers", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "2");
        await setOperand(user, "B", "3", "4");
        await user.click(screen.getByRole("button", { name: "Divide complex numbers" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/0\.44 \+ 0\.08i/)).toBeInTheDocument();
    });

    it("reports an error when a unary operation has an invalid operand", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await user.click(screen.getByRole("button", { name: "Absolute value of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/valid value for A/)).toBeInTheDocument();
    });

    it("reports an error for an empty polar operand", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await user.click(screen.getByRole("button", { name: /A form/ }));
        await user.click(screen.getByRole("option", { name: "Polar r ∠ θ" }));

        await user.type(screen.getByLabelText("A radius"), "5");

        await user.click(screen.getByRole("button", { name: "Absolute value of A" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/valid value for A/)).toBeInTheDocument();
    });

    it("adds two complex numbers", async () => {
        const user = userEvent.setup();
        const harness = buildHarness();

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "2");
        await setOperand(user, "B", "3", "4");
        await user.click(screen.getByRole("button", { name: "Add complex numbers" }));

        const status = screen.getByRole("status");
        expect(within(status).getByText(/4 \+ 6i/)).toBeInTheDocument();
    });

    it("reports a domain error when complex numbers are disabled", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            complexNumbersEnabled: false,
        });

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "2");
        await setOperand(user, "B", "3", "4");
        await user.click(screen.getByRole("button", { name: "Add complex numbers" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("Complex numbers are disabled. Enable them in settings.");
    });

    it("reports a domain error for a unary operation when complex numbers are disabled", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            complexNumbersEnabled: false,
        });

        renderWithCalculatorContext(harness, <ComplexAppComponent />);

        await setOperand(user, "A", "1", "2");
        await user.click(screen.getByRole("button", { name: "Absolute value of A" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("Complex numbers are disabled. Enable them in settings.");
    });
});
