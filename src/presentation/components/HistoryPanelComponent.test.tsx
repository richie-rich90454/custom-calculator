import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { HistoryPanelComponent } from "./HistoryPanelComponent";

describe("HistoryPanelComponent", () => {
  async function recordEntry(harness: { store: { getState: () => { onDigitPressed: (d: string) => void; onEvaluatePressed: () => void } } }): Promise<void> {
    harness.store.getState().onDigitPressed("6");
    harness.store.getState().onEvaluatePressed();

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  it("shows an empty state when no history exists", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    expect(
      screen.getByText("No calculations yet. Press equals to record history.")
    ).toBeInTheDocument();
  });

  it("renders recorded history entries", async () => {
    const harness = createCalculatorTestHarness();

    await recordEntry(harness);

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("= 6")).toBeInTheDocument();
  });

  it("inserts a history expression into the editor", async () => {
    const harness = createCalculatorTestHarness();

    await recordEntry(harness);

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "Insert expression 6" })
    );

    expect(harness.store.getState().expressionText).toBe("6");
  });

  it("inserts a history result into the editor", async () => {
    const harness = createCalculatorTestHarness();

    await recordEntry(harness);

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "Insert result 6" })
    );

    expect(harness.store.getState().expressionText).toBe("6");
  });

  it("deletes a history entry", async () => {
    const harness = createCalculatorTestHarness();

    await recordEntry(harness);

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "Delete history entry 6" })
    );

    expect(harness.store.getState().historyEntries).toHaveLength(0);
  });

  it("clears all history entries", async () => {
    const harness = createCalculatorTestHarness();

    await recordEntry(harness);

    renderWithCalculatorContext(
      harness,
      <HistoryPanelComponent />
    );

    await userEvent.setup().click(
      screen.getByRole("button", { name: "Clear history" })
    );

    expect(harness.store.getState().historyEntries).toHaveLength(0);
  });
});
