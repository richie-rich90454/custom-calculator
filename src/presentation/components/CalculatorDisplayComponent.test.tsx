import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CalculatorDisplayComponent } from "./CalculatorDisplayComponent";

describe("CalculatorDisplayComponent", () => {
  it("exposes an accessible label for the expression input", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    expect(
      screen.getByLabelText("Calculator expression input")
    ).toBeInTheDocument();
  });

  it("updates the expression when digits are typed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "42");

    expect(harness.store.getState().expressionText).toBe("42");
  });

  it("evaluates the expression when Enter is pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "2+3{Enter}");

    expect(harness.store.getState().resultText).toBe("5");
    expect(screen.getByText("= 5")).toBeInTheDocument();
  });

  it("deletes the previous character when Backspace is pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "52");
    await user.keyboard("{Backspace}");

    expect(harness.store.getState().expressionText).toBe("5");
  });

  it("clears the expression when Escape is pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "123");
    await user.keyboard("{Escape}");

    expect(harness.store.getState().expressionText).toBe("");
  });

  it("renders an inline error when evaluation fails", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "1/0{Enter}");

    expect(harness.store.getState().errorText).not.toBeNull();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("announces the result through an aria live region", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "2*3{Enter}");

    const resultOutput = screen.getByText("= 6");

    expect(resultOutput).toHaveAttribute("aria-live", "polite");
  });
});
