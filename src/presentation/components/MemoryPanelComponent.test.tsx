import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { MemoryPanelComponent } from "./MemoryPanelComponent";

describe("MemoryPanelComponent", () => {
  it("shows an empty state when memory is empty", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <MemoryPanelComponent />
    );

    expect(screen.getByText("Memory is empty.")).toBeInTheDocument();
  });

  it("adds the current result to memory", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    harness.store.getState().onDigitPressed("5");
    harness.store.getState().onEvaluatePressed();

    renderWithCalculatorContext(
      harness,
      <MemoryPanelComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Add current result to memory" })
    );

    expect(harness.store.getState().memoryValueText).toBe("5");
  });

  it("recalls the memory value into the expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ memoryValueText: "42" });

    renderWithCalculatorContext(
      harness,
      <MemoryPanelComponent />
    );

    await user.click(screen.getByRole("button", { name: "Recall memory value" }));

    expect(harness.store.getState().expressionText).toBe("42");
  });

  it("clears the memory value", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ memoryValueText: "42" });

    renderWithCalculatorContext(
      harness,
      <MemoryPanelComponent />
    );

    await user.click(screen.getByRole("button", { name: "Clear memory" }));

    expect(harness.store.getState().memoryValueText).toBeNull();
  });

  it("disables memory actions without a current result", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <MemoryPanelComponent />
    );

    expect(
      screen.getByRole("button", { name: "Add current result to memory" })
    ).toBeDisabled();
  });
});
