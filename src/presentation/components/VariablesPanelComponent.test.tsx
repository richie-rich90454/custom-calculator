import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumericMode } from "../../domain/model/NumericMode";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { VariablesPanelComponent } from "./VariablesPanelComponent";



describe("VariablesPanelComponent", () => {
  it("shows an empty state when no variables are saved", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <VariablesPanelComponent />
    );

    expect(screen.getByText("No variables saved yet.")).toBeInTheDocument();
  });

  it("saves the current result under a variable name", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    harness.store.getState().onDigitPressed("9");
    harness.store.getState().onEvaluatePressed();

    renderWithCalculatorContext(
      harness,
      <VariablesPanelComponent />
    );

    await user.type(screen.getByLabelText("Variable name"), "a");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(harness.store.getState().variables[0]?.name).toBe("a");
    expect(harness.store.getState().variables[0]?.valueText).toBe("9");
  });

  it("inserts a saved variable into the expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({
      variables: [
        {
          name: "x",
          valueText: "4",
          numericMode: NumericMode.STANDARD,
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    renderWithCalculatorContext(
      harness,
      <VariablesPanelComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Insert variable x" })
    );

    expect(harness.store.getState().expressionText).toBe("x");
  });

  it("deletes a saved variable", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({
      variables: [
        {
          name: "x",
          valueText: "4",
          numericMode: NumericMode.STANDARD,
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    renderWithCalculatorContext(
      harness,
      <VariablesPanelComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Delete variable x" })
    );

    expect(harness.store.getState().variables).toHaveLength(0);
  });
});
