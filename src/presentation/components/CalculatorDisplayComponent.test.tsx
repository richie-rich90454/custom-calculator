import { describe, expect, it } from "vitest";
import { act, screen } from "@testing-library/react";
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

describe("CalculatorDisplayComponent caret behavior", () => {
  it("does not render a synthetic caret while the editor is focused", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    input.focus();

    expect(
      document.querySelectorAll('[data-testid="caret-indicator"]')
    ).toHaveLength(0);
  });

  it("renders a single synthetic caret after the editor loses focus", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.click(input);
    await user.tab();

    expect(
      document.querySelectorAll('[data-testid="caret-indicator"]')
    ).toHaveLength(1);
  });

  it("renders the synthetic caret after a function insertion while the editor is blurred", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.click(input);
    await user.tab();

    act(() => {
      harness.store.getState().onFunctionPressed("sin");
    });

    expect(
      document.querySelectorAll('[data-testid="caret-indicator"]')
    ).toHaveLength(1);
    expect(harness.store.getState().cursorPosition).toBe(4);
    expect(harness.store.getState().expressionText).toBe("sin(");
  });
});

describe("CalculatorDisplayComponent keyboard input", () => {
  it("accepts digits, letters, and symbols", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "2+3sin(30)*x");

    expect(harness.store.getState().expressionText).toBe("2+3sin(30)*x");
  });

  it("accepts spaces and percent signs", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "5 % 2");

    expect(harness.store.getState().expressionText).toBe("5 % 2");
  });

  it("moves the caret with arrow keys and types at the start", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "42{ArrowLeft}{ArrowLeft}9");

    expect(harness.store.getState().expressionText).toBe("942");
  });

  it("moves the caret with arrow keys and deletes forward with Delete", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "123{ArrowLeft}{ArrowLeft}{Delete}");

    expect(harness.store.getState().expressionText).toBe("13");
  });

  it("deletes a selected range with the Delete key", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorDisplayComponent />
    );

    const input = screen.getByLabelText("Calculator expression input");

    await user.type(input, "1234");
    await user.keyboard("{Control>}{a}{/Control}");
    await user.keyboard("{Delete}");

    expect(harness.store.getState().expressionText).toBe("");
  });
});
