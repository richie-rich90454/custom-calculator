import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultFormatMode } from "../../domain/model/ResultFormatMode";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorFixSciMenuComponent } from "./CalculatorFixSciMenuComponent";

describe("CalculatorFixSciMenuComponent", () => {
    it("applies the standard format", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            resultText: "3.14",
            lastResultValue: 22 / 7,
            resultFormatMode: ResultFormatMode.FIX,
        });

        renderWithCalculatorContext(harness, <CalculatorFixSciMenuComponent />);

        await user.click(screen.getByRole("button", { name: "Standard" }));

        expect(harness.store.getState().resultFormatMode).toBe(ResultFormatMode.STANDARD);
        expect(harness.store.getState().resultText).toBe("3.14285714285714");
    });

    it("applies a fixed decimal format", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            resultText: "3.142857142857143",
            lastResultValue: 22 / 7,
        });

        renderWithCalculatorContext(harness, <CalculatorFixSciMenuComponent />);

        await user.click(screen.getByRole("button", { name: "Fix decimal places" }));

        expect(harness.store.getState().resultFormatMode).toBe(ResultFormatMode.FIX);
        expect(harness.store.getState().resultText).toBe("3.14");
    });

    it("applies a significant-figure format", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            resultText: "3.142857142857143",
            lastResultValue: 22 / 7,
        });

        renderWithCalculatorContext(harness, <CalculatorFixSciMenuComponent />);

        await user.click(screen.getByRole("button", { name: "Significant figures" }));

        expect(harness.store.getState().resultFormatMode).toBe(ResultFormatMode.SCI);
    });

    it("reapplies the active format when the digit count changes", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            resultText: "3.14",
            lastResultValue: 22 / 7,
            resultFormatMode: ResultFormatMode.FIX,
        });

        renderWithCalculatorContext(harness, <CalculatorFixSciMenuComponent />);

        await user.click(screen.getByRole("button", { name: /Result format digits/ }));
        await user.click(await screen.findByRole("option", { name: "4" }));

        expect(harness.store.getState().resultFormatDigits).toBe(4);
        expect(harness.store.getState().resultText).toBe("3.1429");
    });

    it("keeps the standard result when changing digits", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({
            resultText: "3.14",
            lastResultValue: 22 / 7,
            resultFormatMode: ResultFormatMode.STANDARD,
        });

        renderWithCalculatorContext(harness, <CalculatorFixSciMenuComponent />);

        await user.click(screen.getByRole("button", { name: /Result format digits/ }));
        await user.click(await screen.findByRole("option", { name: "4" }));

        expect(harness.store.getState().resultFormatDigits).toBe(2);
        expect(harness.store.getState().resultText).toBe("3.14");
    });
});
