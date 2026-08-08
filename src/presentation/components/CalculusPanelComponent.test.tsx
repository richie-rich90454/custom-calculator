import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CalculusPanelComponent } from "./CalculusPanelComponent";

describe("CalculusPanelComponent", () => {
  it("lists every calculus operation", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculusPanelComponent />
    );

    expect(screen.getByText(/derivative\(x\^2, x\)/)).toBeInTheDocument();
  });

  it("inserts the derivative invocation into the expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculusPanelComponent />
    );

    const insertButtons = screen.getAllByRole("button");

    await user.click(insertButtons[0]!);

    expect(harness.store.getState().expressionText).toBe("derivative(, x)");
  });

  it("inserts the integral invocation into the expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculusPanelComponent />
    );

    const insertButtons = screen.getAllByRole("button");

    await user.click(insertButtons[2]!);

    expect(harness.store.getState().expressionText).toBe("integral(, x, a, b)");
  });
});
