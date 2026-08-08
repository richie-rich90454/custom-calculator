import { describe, expect, it } from "vitest";
import { createCalculatorTestHarness } from "../test/calculatorTestHarness";

describe("Calculator post-evaluation behavior", () => {
  it("starts a new expression when a digit is pressed after a result", () => {
    const harness = createCalculatorTestHarness();
    const { onDigitPressed, onEvaluatePressed } = harness.store.getState();

    onDigitPressed("5");
    onEvaluatePressed();

    expect(harness.store.getState().resultText).toBe("5");

    onDigitPressed("7");

    expect(harness.store.getState().expressionText).toBe("7");
    expect(harness.store.getState().cursorPosition).toBe(1);
  });

  it("starts a new expression with a function when pressed after a result", () => {
    const harness = createCalculatorTestHarness();
    const { onDigitPressed, onEvaluatePressed, onFunctionPressed } =
      harness.store.getState();

    onDigitPressed("5");
    onEvaluatePressed();
    onFunctionPressed("sin");

    expect(harness.store.getState().expressionText).toBe("sin(");
    expect(harness.store.getState().cursorPosition).toBe(4);
  });

  it("continues with the previous result when an operator is pressed after a result", () => {
    const harness = createCalculatorTestHarness();
    const { onDigitPressed, onEvaluatePressed, onOperatorPressed } =
      harness.store.getState();

    onDigitPressed("5");
    onEvaluatePressed();
    onOperatorPressed("+");

    expect(harness.store.getState().expressionText).toBe("5+");
    expect(harness.store.getState().cursorPosition).toBe(2);
  });

  it("continues with ans when an operator is pressed after the expression is cleared", () => {
    const harness = createCalculatorTestHarness();
    const {
      onDigitPressed,
      onEvaluatePressed,
      onClearPressed,
      onOperatorPressed,
    } = harness.store.getState();

    onDigitPressed("5");
    onEvaluatePressed();
    onClearPressed();
    onOperatorPressed("+");

    expect(harness.store.getState().expressionText).toBe("ans+");
    expect(harness.store.getState().cursorPosition).toBe(4);
  });

  it("does not start a new expression when editing an existing expression", () => {
    const harness = createCalculatorTestHarness();
    const { onDigitPressed } = harness.store.getState();

    onDigitPressed("5");
    onDigitPressed("6");

    expect(harness.store.getState().expressionText).toBe("56");
  });

  it("ignores an unknown constant identifier", () => {
    const harness = createCalculatorTestHarness();
    const { onConstantPressed } = harness.store.getState();

    onConstantPressed("notARealConstant");

    expect(harness.store.getState().expressionText).toBe("");
  });
});
