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

    expect(
      screen.getByLabelText("Calculator expression input")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cycle angle mode" })
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

  it("renders the constants panel with search when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open constants panel" })
    );

    expect(
      screen.getByRole("heading", { name: "Constants" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Search constants")).toBeInTheDocument();
  });

  it("renders the settings panel when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open settings panel" })
    );

    expect(
      screen.getByRole("heading", { name: "Settings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Enable CAS-style symbolic operations" })
    ).toBeInTheDocument();
  });

  it("renders the CAS panel when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(screen.getByRole("button", { name: "Open CAS panel" }));

    expect(
      screen.getByRole("heading", { name: "CAS" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simplify" })).toBeInTheDocument();
  });

  it("renders the calculus panel when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open calculus panel" })
    );

    expect(
      screen.getByRole("heading", { name: "Calculus" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "∫" })
    ).toBeInTheDocument();
  });

  it("renders the variables panel when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open variables panel" })
    );

    expect(
      screen.getByRole("heading", { name: "Variables" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Variable name")).toBeInTheDocument();
  });

  it("renders the memory panel when opened", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorShellComponent />
    );

    await user.click(
      screen.getByRole("button", { name: "Open memory panel" })
    );

    expect(
      screen.getByRole("heading", { name: "Memory" })
    ).toBeInTheDocument();
    expect(screen.getByText("Memory is empty.")).toBeInTheDocument();
  });

  it("closes the active panel through the dialog close button", async () => {
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

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(harness.store.getState().activePanel).toBe("NONE");
  });
});
