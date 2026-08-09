import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { NumericMode } from "../../domain/model/NumericMode";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorStatusBarComponent } from "./CalculatorStatusBarComponent";

describe("CalculatorStatusBarComponent indicators", () => {
    it("shows the active app name", () => {
        const harness = createCalculatorTestHarness({ activeAppMode: "calculate" });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Active app")).toHaveTextContent("Calculate");
    });

    it("highlights the shift indicator when shift is armed", () => {
        const harness = createCalculatorTestHarness({ activeModifierLayer: ModifierLayer.SHIFT });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Shift layer armed")).toBeInTheDocument();
    });

    it("highlights the alpha indicator when alpha is armed", () => {
        const harness = createCalculatorTestHarness({ activeModifierLayer: ModifierLayer.ALPHA });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Alpha layer armed")).toBeInTheDocument();
    });

    it("labels the idle modifier indicators", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Shift layer")).toBeInTheDocument();
        expect(screen.getByLabelText("Alpha layer")).toBeInTheDocument();
    });

    it("shows the CAS and complex indicators when enabled", () => {
        const harness = createCalculatorTestHarness({
            casEnabled: true,
            complexNumbersEnabled: true,
        });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("CAS enabled")).toBeInTheDocument();
        expect(screen.getByLabelText("Complex numbers enabled")).toBeInTheDocument();
    });

    it("warns when BigInt is unsupported", () => {
        const harness = createCalculatorTestHarness({ bigIntSupported: false });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByText("BIG-INT UNAVAILABLE")).toBeInTheDocument();
    });

    it("labels the exact decimal format chip", () => {
        const harness = createCalculatorTestHarness({ numericMode: NumericMode.EXACT_DECIMAL });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Numeric format")).toHaveTextContent("EXACT");
    });

    it("labels the fraction format chip", () => {
        const harness = createCalculatorTestHarness({ numericMode: NumericMode.FRACTION });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Numeric format")).toHaveTextContent("FRAC");
    });

    it("labels the BigInt format chip", () => {
        const harness = createCalculatorTestHarness({ numericMode: NumericMode.BIGINT });

        renderWithCalculatorContext(harness, <CalculatorStatusBarComponent />);

        expect(screen.getByLabelText("Numeric format")).toHaveTextContent("BIG");
    });
});
