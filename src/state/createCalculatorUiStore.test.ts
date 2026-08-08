import { describe, expect, it } from "vitest";
import { AngleMode } from "../domain/model/AngleMode";
import { createCalculatorTestHarness } from "../test/calculatorTestHarness";

describe("calculator UI store", () => {
  it("inserts a digit into the expression", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("5");
    store.getState().onDigitPressed("2");

    expect(store.getState().expressionText).toBe("52");
  });

  it("inserts operators between digits", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("5");
    store.getState().onOperatorPressed("+");
    store.getState().onDigitPressed("3");

    expect(store.getState().expressionText).toBe("5+3");
  });

  it("inserts a function with an opening parenthesis", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onFunctionPressed("sin");

    expect(store.getState().expressionText).toBe("sin(");
  });

  it("evaluates the expression and stores the result", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("2");
    store.getState().onOperatorPressed("+");
    store.getState().onDigitPressed("3");
    store.getState().onEvaluatePressed();

    expect(store.getState().resultText).toBe("5");
    expect(store.getState().errorText).toBeNull();
  });

  it("clears the expression with the clear action", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("5");
    store.getState().onClearPressed();

    expect(store.getState().expressionText).toBe("");
    expect(store.getState().resultText).toBeNull();
  });

  it("deletes the previous digit with smart backspace", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("5");
    store.getState().onDigitPressed("2");
    store.getState().onDeleteBackwardPressed();

    expect(store.getState().expressionText).toBe("5");
  });

  it("cycles through angle modes", () => {
    const { store } = createCalculatorTestHarness();

    expect(store.getState().angleMode).toBe(AngleMode.DEG);

    store.getState().onAngleModeTogglePressed();
    expect(store.getState().angleMode).toBe(AngleMode.RAD);

    store.getState().onAngleModeTogglePressed();
    expect(store.getState().angleMode).toBe(AngleMode.GON);

    store.getState().onAngleModeTogglePressed();
    expect(store.getState().angleMode).toBe(AngleMode.DEG);
  });

  it("changes the numeric mode", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onNumericModeChanged("FRACTION");

    expect(store.getState().numericMode).toBe("FRACTION");
  });

  it("toggles complex numbers and CAS flags", () => {
    const { store } = createCalculatorTestHarness();

    expect(store.getState().complexNumbersEnabled).toBe(false);
    store.getState().onComplexNumbersTogglePressed();
    expect(store.getState().complexNumbersEnabled).toBe(true);

    expect(store.getState().casEnabled).toBe(false);
    store.getState().onCasTogglePressed();
    expect(store.getState().casEnabled).toBe(true);
  });

  it("records evaluated results in history", async () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("6");
    store.getState().onOperatorPressed("*");
    store.getState().onDigitPressed("7");
    store.getState().onEvaluatePressed();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.getState().historyEntries.length).toBeGreaterThan(0);
    expect(store.getState().historyEntries[0]?.expressionText).toBe("6*7");
  });

  it("shows an inline error for a failed evaluation", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("1");
    store.getState().onOperatorPressed("/");
    store.getState().onDigitPressed("0");
    store.getState().onEvaluatePressed();

    expect(store.getState().resultText).toBeNull();
    expect(store.getState().errorText).not.toBeNull();
  });

  it("saves the current result as a variable", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("9");
    store.getState().onEvaluatePressed();
    store.getState().onSaveVariablePressed("a");

    expect(store.getState().variables).toHaveLength(1);
    expect(store.getState().variables[0]?.name).toBe("a");
    expect(store.getState().variables[0]?.valueText).toBe("9");
  });

  it("inserts a saved variable into the expression", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onVariablePressed("x");

    expect(store.getState().expressionText).toBe("x");
  });

  it("performs memory add and recall", () => {
    const { store } = createCalculatorTestHarness();

    store.getState().onDigitPressed("5");
    store.getState().onEvaluatePressed();
    store.getState().onMemoryAddPressed();

    expect(store.getState().memoryValueText).toBe("5");

    store.getState().onClearPressed();
    store.getState().onMemoryRecallPressed();

    expect(store.getState().expressionText).toBe("5");
  });

  it("opens and closes panels", () => {
    const { store } = createCalculatorTestHarness();

    expect(store.getState().activePanel).toBe("NONE");

    store.getState().onPanelOpened("HISTORY");
    expect(store.getState().activePanel).toBe("HISTORY");

    store.getState().onPanelOpened("HISTORY");
    expect(store.getState().activePanel).toBe("NONE");
  });
});
