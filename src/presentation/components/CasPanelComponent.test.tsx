import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CasPanelComponent } from "./CasPanelComponent";

describe("CasPanelComponent", () => {
  it("warns when CAS is disabled", () => {
    const harness = createCalculatorTestHarness({ casEnabled: false });

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    expect(
      screen.getByText(/CAS mode is disabled/)
    ).toBeInTheDocument();
  });

  it("disables operations when CAS is disabled", () => {
    const harness = createCalculatorTestHarness({ casEnabled: false });

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    expect(screen.getByRole("button", { name: "Simplify" })).toBeDisabled();
  });

  it("simplifies the current expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ casEnabled: true });

    harness.store.getState().onExpressionTextChanged("x+x", 3, 3, 3);

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    await user.click(screen.getByRole("button", { name: "Simplify" }));

    expect(harness.store.getState().resultText).toBe("2*x");
  });

  it("expands the current expression", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ casEnabled: true });

    harness.store.getState().onExpressionTextChanged("(x+1)^2", 8, 8, 8);

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    await user.click(screen.getByRole("button", { name: "Expand" }));

    expect(harness.store.getState().resultText).toBe("x^2+2*x+1");
  });

  it("differentiates the current expression with the chosen variable", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ casEnabled: true });

    harness.store.getState().onExpressionTextChanged("x^2+x", 5, 5, 5);

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Differentiate" })
    );

    expect(harness.store.getState().resultText).toBe("2*x+1");
  });

  it("operates the derivative controls with the keyboard", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness({ casEnabled: true });

    harness.store.getState().onExpressionTextChanged("x^3", 3, 3, 3);

    renderWithCalculatorContext(
      harness,
      <CasPanelComponent />
    );

    const variableField = screen.getByLabelText("Derivative variable");

    await user.clear(variableField);
    await user.type(variableField, "x");
    await user.tab();
    await user.keyboard("{Enter}");

    expect(harness.store.getState().resultText).toBe("3*x^2");
  });
});
