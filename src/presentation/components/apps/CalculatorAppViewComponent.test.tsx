import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { CalculatorAppViewComponent } from "./CalculatorAppViewComponent";

describe("CalculatorAppViewComponent", () => {
    it("renders the classic display and keypad for the calculate app", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "calculate",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByLabelText("Calculator expression input")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Digit one" })).toBeInTheDocument();
    });

    it("renders the complex app", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "complex",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByLabelText("A real part")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Multiply complex numbers" }),
        ).toBeInTheDocument();
    });

    it("renders the base-n app", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "base-n",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByLabelText("Value")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Bitwise not of the value" }),
        ).toBeInTheDocument();
    });

    it("renders the matrix app", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "matrix",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByText("MatA")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Run the selected matrix operation" }),
        ).toBeInTheDocument();
    });

    it("renders the vector app", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "vector",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByText("VecA")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Run the selected vector operation" }),
        ).toBeInTheDocument();
    });

    it("shows a message for an unknown app id", () => {
        const harness = createCalculatorTestHarness({
            activeAppMode: "missing",
        });

        renderWithCalculatorContext(harness, <CalculatorAppViewComponent />);

        expect(screen.getByText("App not available.")).toBeInTheDocument();
    });
});
