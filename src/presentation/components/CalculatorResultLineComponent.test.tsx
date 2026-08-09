import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { createCalculatorTestHarness } from "../../test/calculatorTestHarness";
import { CalculatorResultLineComponent } from "./CalculatorResultLineComponent";

describe("CalculatorResultLineComponent", () => {
    it("renders an exact result without an approximate prefix", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorResultLineComponent resultText="1/2" isApproximateResult={false} />,
        );

        expect(screen.getByText("= 1/2")).toBeInTheDocument();
    });

    it("renders a leading approximate symbol when the result is approximate", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorResultLineComponent
                resultText="1.4142135623731"
                isApproximateResult={true}
            />,
        );

        expect(screen.getByText("≈ 1.4142135623731")).toBeInTheDocument();
    });

    it("renders nothing when there is no result", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorResultLineComponent resultText={null} isApproximateResult={false} />,
        );

        expect(screen.queryByText("=")).not.toBeInTheDocument();
    });
});
