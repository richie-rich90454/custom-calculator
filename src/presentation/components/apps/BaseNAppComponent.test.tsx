import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { BaseNAppComponent } from "./BaseNAppComponent";

describe("BaseNAppComponent", () => {
    it("shows an unavailable message when BigInt is not supported", () => {
        const harness = createCalculatorTestHarness({
            bigIntSupported: false,
        });

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        expect(screen.getByText(/BigInt is not supported in this browser/)).toBeInTheDocument();
    });

    it("negates a value and renders it in all four bases", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.clear(screen.getByLabelText("Value"));
        await user.type(screen.getByLabelText("Value"), "1");

        await user.click(screen.getByRole("button", { name: "Negate the value" }));

        expect(screen.getByText(/HEX: FFFFFFFF/)).toBeInTheDocument();
        expect(screen.getByText(/BIN: 11111111 11111111 11111111 11111111/)).toBeInTheDocument();
    });

    it("computes a bitwise and and shows the result in hex", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.click(screen.getByRole("button", { name: /Number base/ }));
        await user.click(screen.getByRole("option", { name: "HEX" }));

        await user.clear(screen.getByLabelText("Value"));
        await user.type(screen.getByLabelText("Value"), "FF");
        await user.clear(screen.getByLabelText("Second operand"));
        await user.type(screen.getByLabelText("Second operand"), "0F");

        await user.click(screen.getByRole("button", { name: "Bitwise and base-n values" }));

        expect(screen.getByText(/HEX: F$/)).toBeInTheDocument();
    });

    it("computes a bitwise not and shows it at the selected word size", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.clear(screen.getByLabelText("Value"));
        await user.type(screen.getByLabelText("Value"), "0");

        await user.click(screen.getByRole("button", { name: "Bitwise not of the value" }));

        expect(screen.getByText(/HEX: FFFFFFFF/)).toBeInTheDocument();
    });

    it("wraps an addition at the selected word size", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.click(screen.getByRole("button", { name: /Number base/ }));
        await user.click(screen.getByRole("option", { name: "HEX" }));

        await user.clear(screen.getByLabelText("Value"));
        await user.type(screen.getByLabelText("Value"), "7FFFFFFF");
        await user.clear(screen.getByLabelText("Second operand"));
        await user.type(screen.getByLabelText("Second operand"), "1");

        await user.click(screen.getByRole("button", { name: "Add base-n values" }));

        expect(screen.getByText(/HEX: 80000000/)).toBeInTheDocument();
    });

    it("switches the display base selector", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.click(screen.getByRole("button", { name: /Number base/ }));
        await user.click(screen.getByRole("option", { name: "HEX" }));

        expect(screen.getByRole("button", { name: /Number base/ })).toHaveTextContent("HEX");
    });

    it("computes a bitwise or and exclusive or", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.click(screen.getByRole("button", { name: /Number base/ }));
        await user.click(screen.getByRole("option", { name: "HEX" }));

        await user.clear(screen.getByLabelText("Value"));
        await user.type(screen.getByLabelText("Value"), "F0");
        await user.clear(screen.getByLabelText("Second operand"));
        await user.type(screen.getByLabelText("Second operand"), "0F");

        await user.click(screen.getByRole("button", { name: "Bitwise or base-n values" }));
        expect(screen.getByText(/HEX: FF$/)).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Bitwise exclusive or base-n values" }),
        );
        expect(screen.getByText(/HEX: FF$/)).toBeInTheDocument();
    });

    it("switches the word size selector", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <BaseNAppComponent />);

        await user.click(screen.getByRole("button", { name: /Word size/ }));
        await user.click(screen.getByRole("option", { name: "16 bits" }));

        expect(screen.getByRole("button", { name: /Word size/ })).toHaveTextContent("16 bits");
    });
});
