import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CalculatorShellComponent } from "./CalculatorShellComponent";

describe("CalculatorShellComponent", () => {
  it("renders the full calculator shell without errors", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    expect(screen.getByText("Scientific Calculator")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Calculator expression input")
    ).toBeInTheDocument();
  });

  it("supports a complete digit, operator, and equals flow", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(screen.getByRole("button", { name: "Digit one" }));
    await user.click(screen.getByRole("button", { name: "Digit two" }));
    await user.click(screen.getByRole("button", { name: "Addition" }));
    await user.click(screen.getByRole("button", { name: "Digit three" }));
    await user.click(screen.getByRole("button", { name: "Evaluate" }));

    expect(harness.store.getState().resultText).toBe("15");
    expect(screen.getByText("= 15")).toBeInTheDocument();
  });

  it("opens the history panel through the status bar", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open history panel" })
    );

    expect(harness.store.getState().activePanel).toBe("HISTORY");
    expect(
      screen.getByRole("heading", { name: "History" })
    ).toBeInTheDocument();
  });
});
