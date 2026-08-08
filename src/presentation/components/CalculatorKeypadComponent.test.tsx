import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CalculatorKeypadComponent } from "./CalculatorKeypadComponent";

describe("CalculatorKeypadComponent", () => {
  it("inserts a digit into the expression when pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit seven" }));
    await user.click(screen.getByRole("button", { name: "Digit two" }));

    expect(harness.store.getState().expressionText).toBe("72");
  });

  it("inserts an operator when an operator key is pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit five" }));
    await user.click(screen.getByRole("button", { name: "Addition" }));
    await user.click(screen.getByRole("button", { name: "Digit three" }));

    expect(harness.store.getState().expressionText).toBe("5+3");
  });

  it("inserts a function with an opening parenthesis", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Sine function" }));

    expect(harness.store.getState().expressionText).toBe("sin(");
  });

  it("evaluates the expression with the equals key", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit six" }));
    await user.click(screen.getByRole("button", { name: "Multiplication" }));
    await user.click(screen.getByRole("button", { name: "Digit seven" }));
    await user.click(screen.getByRole("button", { name: "Evaluate" }));

    expect(harness.store.getState().resultText).toBe("42");
  });

  it("clears the expression with the clear key", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit nine" }));
    await user.click(screen.getByRole("button", { name: "Clear expression" }));

    expect(harness.store.getState().expressionText).toBe("");
  });

  it("deletes the last character with the backspace key", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit four" }));
    await user.click(screen.getByRole("button", { name: "Digit two" }));
    await user.click(screen.getByRole("button", { name: "Backspace" }));

    expect(harness.store.getState().expressionText).toBe("4");
  });

  it("exposes accessible names for every key", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    expect(screen.getByRole("button", { name: "Digit zero" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sine function" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pi constant" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous answer" })).toBeInTheDocument();
  });

  it("activates keys with the Enter key via keyboard", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorKeypadComponent />
    );

    const sevenButton = screen.getByRole("button", { name: "Digit seven" });

    sevenButton.focus();
    await user.keyboard("{Enter}");

    expect(harness.store.getState().expressionText).toBe("7");
  });
});
