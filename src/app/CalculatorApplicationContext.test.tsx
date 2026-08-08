import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../test/calculatorTestHarness";
import { useCalculatorApplicationContext } from "./CalculatorApplicationContext";
import { CalculatorApplicationContextProvider } from "./CalculatorApplicationContext";

function ContextProbe() {
  const { store } = useCalculatorApplicationContext();

  return <div>Context probe {store.getState().expressionText}</div>;
}

describe("CalculatorApplicationContext", () => {
  it("provides the store to consuming components", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(harness, <ContextProbe />);

    expect(screen.getByText("Context probe")).toBeInTheDocument();
  });

  it("throws when the hook is used without a provider", () => {
    const harness = createCalculatorTestHarness();

    expect(() => render(<ContextProbe />)).toThrowError(
      "CalculatorApplicationContext is not available"
    );
  });

  it("passes a custom composition root through the provider", () => {
    const harness = createCalculatorTestHarness();

    render(
      <CalculatorApplicationContextProvider
        compositionRoot={harness.compositionRoot}
        store={harness.store}
      >
        <ContextProbe />
      </CalculatorApplicationContextProvider>
    );

    expect(screen.getByText(/Context probe/)).toBeInTheDocument();
  });
});
