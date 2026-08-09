import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorKaTeXPreviewComponent } from "./CalculatorKaTeXPreviewComponent";

describe("CalculatorKaTeXPreviewComponent", () => {
    it("renders the current expression as rendered math", () => {
        const harness = createCalculatorTestHarness({
            expressionText: "x^2",
        });

        renderWithCalculatorContext(harness, <CalculatorKaTeXPreviewComponent />);

        const preview = screen.getByLabelText("Pretty preview");

        expect(preview).toBeInTheDocument();
        expect(preview.querySelector("span[aria-hidden='true']")).not.toBeNull();
    });

    it("is hidden when the expression is empty", () => {
        const harness = createCalculatorTestHarness({
            expressionText: "",
        });

        renderWithCalculatorContext(harness, <CalculatorKaTeXPreviewComponent />);

        expect(screen.queryByLabelText("Pretty preview")).not.toBeInTheDocument();
    });

    it("is hidden when the preview is disabled", () => {
        const harness = createCalculatorTestHarness({
            expressionText: "x^2",
            isKaTeXPreviewEnabled: false,
        });

        renderWithCalculatorContext(harness, <CalculatorKaTeXPreviewComponent />);

        expect(screen.queryByLabelText("Pretty preview")).not.toBeInTheDocument();
    });

    it("marks the rendered math as aria hidden because it duplicates the input", () => {
        const harness = createCalculatorTestHarness({
            expressionText: "1+2",
        });

        renderWithCalculatorContext(harness, <CalculatorKaTeXPreviewComponent />);

        const preview = screen.getByLabelText("Pretty preview");
        const math = preview.querySelector("span[aria-hidden='true']");

        expect(math).not.toBeNull();
        expect(math?.innerHTML.length).toBeGreaterThan(0);
    });
});
