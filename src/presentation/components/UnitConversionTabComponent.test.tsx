import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { UnitConversionTabComponent } from "./UnitConversionTabComponent";

describe("UnitConversionTabComponent", () => {
    it("converts meters to centimeters", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <UnitConversionTabComponent />);

        await user.clear(screen.getByLabelText("Value to convert"));
        await user.type(screen.getByLabelText("Value to convert"), "1");

        await user.click(screen.getByRole("button", { name: "Convert the value" }));

        expect(screen.getByRole("status")).toHaveTextContent("100 cm");
    });

    it("converts kilometers per hour pressure through the gateway", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <UnitConversionTabComponent />);

        await user.click(screen.getByRole("button", { name: /Unit category/ }));
        await user.click(screen.getByRole("option", { name: "Pressure" }));

        await user.click(screen.getByRole("button", { name: /From unit/ }));
        await user.click(screen.getByRole("option", { name: "kPa" }));
        await user.click(screen.getByRole("button", { name: /To unit/ }));
        await user.click(screen.getByRole("option", { name: "bar" }));

        await user.clear(screen.getByLabelText("Value to convert"));
        await user.type(screen.getByLabelText("Value to convert"), "100");

        await user.click(screen.getByRole("button", { name: "Convert the value" }));

        expect(screen.getByRole("status")).toHaveTextContent("1 bar");
    });

    it("routes temperature through the affine policy", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <UnitConversionTabComponent />);

        await user.click(screen.getByRole("button", { name: /Unit category/ }));
        await user.click(screen.getByRole("option", { name: "Temperature" }));

        await user.clear(screen.getByLabelText("Value to convert"));
        await user.type(screen.getByLabelText("Value to convert"), "0");

        await user.click(screen.getByRole("button", { name: "Convert the value" }));

        expect(screen.getByRole("status")).toHaveTextContent("32 F");
    });

    it("reports an error for an invalid value", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <UnitConversionTabComponent />);

        await user.clear(screen.getByLabelText("Value to convert"));
        await user.type(screen.getByLabelText("Value to convert"), "abc");

        await user.click(screen.getByRole("button", { name: "Convert the value" }));

        expect(screen.getByRole("status")).toHaveTextContent("numeric value");
    });

    it("reports an error for an empty value", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <UnitConversionTabComponent />);

        await user.clear(screen.getByLabelText("Value to convert"));

        await user.click(screen.getByRole("button", { name: "Convert the value" }));

        expect(screen.getByRole("status")).toHaveTextContent("numeric value");
    });
});
