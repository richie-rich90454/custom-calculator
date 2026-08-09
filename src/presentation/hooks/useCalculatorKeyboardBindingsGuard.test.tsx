import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AngleMode } from "../../domain/model/AngleMode";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { NumericMode } from "../../domain/model/NumericMode";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { useCalculatorKeyboardBindings } from "./useCalculatorKeyboardBindings";
import { CalculatorDisplayComponent } from "../components/CalculatorDisplayComponent";
import { CalculatorKeypadComponent } from "../components/CalculatorKeypadComponent";

function KeypadBindingProbe() {
    useCalculatorKeyboardBindings();

    return (
        <>
            <CalculatorDisplayComponent />
            <CalculatorKeypadComponent />
        </>
    );
}

function DialogBindingProbe() {
    useCalculatorKeyboardBindings();

    return (
        <>
            <CalculatorDisplayComponent />
            <div role="dialog">
                <button>Inside dialog</button>
            </div>
        </>
    );
}

function PlainButtonBindingProbe() {
    useCalculatorKeyboardBindings();

    return (
        <>
            <CalculatorDisplayComponent />
            <button>Plain button</button>
            <select aria-label="Sample select">
                <option>one</option>
            </select>
            <a href="https://example.com/">Sample link</a>
        </>
    );
}

describe("useCalculatorKeyboardBindings guard behavior", () => {
    it("lets a focused button handle Enter without evaluating", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <KeypadBindingProbe />);

        const sevenButton = screen.getByRole("button", { name: "Digit seven" });

        sevenButton.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().expressionText).toBe("7");
        expect(harness.store.getState().resultText).toBeNull();
    });

    it("leaves Escape to a focused dialog control", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({ activePanel: CalculatorPanelName.MEMORY });

        renderWithCalculatorContext(harness, <DialogBindingProbe />);

        const dialogButton = screen.getByRole("button", { name: "Inside dialog" });

        dialogButton.focus();
        await user.keyboard("{Escape}");

        expect(harness.store.getState().activePanel).toBe(CalculatorPanelName.MEMORY);
    });

    it("closes an open panel with Escape from a plain target", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness({ activePanel: CalculatorPanelName.MEMORY });

        renderWithCalculatorContext(harness, <KeypadBindingProbe />);

        await user.keyboard("{Escape}");

        expect(harness.store.getState().activePanel).toBe(CalculatorPanelName.NONE);
    });

    it("returns early when Enter reaches a button target", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <PlainButtonBindingProbe />);

        const plainButton = screen.getByRole("button", { name: "Plain button" });

        plainButton.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().resultText).toBeNull();
    });

    it("returns early when Enter reaches a select target", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <PlainButtonBindingProbe />);

        const select = screen.getByLabelText("Sample select");

        select.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().resultText).toBeNull();
    });

    it("returns early when Enter reaches a link target", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <PlainButtonBindingProbe />);

        const link = screen.getByRole("link", { name: "Sample link" });

        link.focus();
        await user.keyboard("{Enter}");

        expect(harness.store.getState().resultText).toBeNull();
    });

    it("recalls the previous history entry with PageUp", () => {
        const harness = createCalculatorTestHarness({
            historyEntries: [
                new HistoryEntry(
                    "1",
                    "1+1",
                    "2",
                    AngleMode.DEG,
                    NumericMode.STANDARD,
                    false,
                    "2026-01-01T00:00:00.000Z",
                ),
                new HistoryEntry(
                    "2",
                    "2+2",
                    "4",
                    AngleMode.DEG,
                    NumericMode.STANDARD,
                    false,
                    "2026-01-01T00:00:00.000Z",
                ),
            ],
        });

        renderWithCalculatorContext(harness, <KeypadBindingProbe />);

        window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "PageUp", bubbles: true, cancelable: true }),
        );

        expect(harness.store.getState().expressionText).toBe("1+1");
    });
});
