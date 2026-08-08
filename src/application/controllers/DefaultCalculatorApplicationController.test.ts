import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";

describe("DefaultCalculatorApplicationController", () => {
  const compositionRoot = new CalculatorCompositionRoot();
  const controller = compositionRoot.calculatorApplicationController;

  function createState(
    overrides: Partial<CalculatorSessionState> = {}
  ): CalculatorSessionState {
    return CalculatorSessionState.createInitial().copyWith(overrides);
  }

  it("inserts a digit", () => {
    const nextState = controller.insertDigit(createState(), "5");

    expect(nextState.expressionText).toBe("5");
  });

  it("applies a text edit with its cursor position", () => {
    const nextState = controller.applyInsertion(
      createState({ resultText: "42" }),
      {
        text: "sin(",
        cursorPosition: 4,
        selectionStart: 4,
        selectionEnd: 4,
      }
    );

    expect(nextState.expressionText).toBe("sin(");
    expect(nextState.cursorPosition).toBe(4);
    expect(nextState.resultText).toBeNull();
  });

  it("inserts an operator", () => {
    const nextState = controller.insertOperator(
      createState({ expressionText: "5", selectionStart: 1, selectionEnd: 1 }),
      "+"
    );

    expect(nextState.expressionText).toBe("5+");
  });

  it("inserts a function", () => {
    const nextState = controller.insertFunction(createState(), "sin");

    expect(nextState.expressionText).toBe("sin(");
  });

  it("inserts a constant", () => {
    const nextState = controller.insertConstant(createState(), "pi");

    expect(nextState.expressionText).toBe("pi");
  });

  it("inserts a variable", () => {
    const nextState = controller.insertVariable(createState(), "x");

    expect(nextState.expressionText).toBe("x");
  });

  it("inserts a parenthesis", () => {
    const nextState = controller.insertParenthesis(createState(), "(");

    expect(nextState.expressionText).toBe("(");
  });

  it("deletes backward", () => {
    const nextState = controller.deleteBackward(
      createState({ expressionText: "12", selectionStart: 2, selectionEnd: 2 })
    );

    expect(nextState.expressionText).toBe("1");
  });

  it("deletes forward", () => {
    const nextState = controller.deleteForward(
      createState({ expressionText: "12", selectionStart: 1, selectionEnd: 1 })
    );

    expect(nextState.expressionText).toBe("1");
  });

  it("deletes a word backward", () => {
    const nextState = controller.deleteWordBackward(
      createState({
        expressionText: "x+abc",
        selectionStart: 5,
        selectionEnd: 5,
      })
    );

    expect(nextState.expressionText).toBe("x+");
  });

  it("clears the session", () => {
    const nextState = controller.clearSession(
      createState({ expressionText: "2+2", resultText: "4" })
    );

    expect(nextState.expressionText).toBe("");
    expect(nextState.resultText).toBeNull();
  });

  it("sets the expression text", () => {
    const nextState = controller.setExpressionText(createState(), "42");

    expect(nextState.expressionText).toBe("42");
    expect(nextState.cursorPosition).toBe(2);
  });

  it("evaluates an expression", () => {
    const nextState = controller.evaluateExpression(
      createState({ expressionText: "2+3" })
    );

    expect(nextState.resultText).toBe("5");
  });

  it("reports a validation error inline", () => {
    const nextState = controller.evaluateExpression(
      createState({ expressionText: "2+*3" })
    );

    expect(nextState.resultText).toBeNull();
    expect(nextState.errorText).not.toBeNull();
  });

  it("cycles the angle mode", () => {
    const nextState = controller.cycleAngleMode(
      createState({ angleMode: AngleMode.DEG })
    );

    expect(nextState.angleMode).not.toBe(AngleMode.DEG);
  });

  it("changes the numeric mode", () => {
    const nextState = controller.changeNumericMode(
      createState(),
      NumericMode.EXACT_DECIMAL
    );

    expect(nextState.numericMode).toBe(NumericMode.EXACT_DECIMAL);
  });

  it("toggles complex numbers", () => {
    const nextState = controller.toggleComplexNumbers(createState());

    expect(nextState.complexNumbersEnabled).toBe(true);
  });

  it("toggles CAS mode", () => {
    const nextState = controller.toggleCasMode(createState());

    expect(nextState.casEnabled).toBe(true);
  });

  it("saves the current result as a variable", () => {
    const nextState = controller.saveVariable(
      createState({ resultText: "42", lastResultText: "42" }),
      "answer"
    );

    expect(nextState.variables).toHaveLength(1);
    expect(nextState.variables[0]?.name).toBe("answer");
  });

  it("deletes a saved variable", () => {
    const withVariable = controller.saveVariable(
      createState({ resultText: "42", lastResultText: "42" }),
      "answer"
    );

    const nextState = controller.deleteVariable(withVariable, "answer");

    expect(nextState.variables).toHaveLength(0);
  });

  it("adds the current result to memory", () => {
    const nextState = controller.memoryAdd(
      createState({ expressionText: "2+3", resultText: "5" })
    );

    expect(nextState.memoryValueText).toBe("5");
  });

  it("subtracts the current result from memory", () => {
    const withMemory = controller.memoryAdd(
      createState({ expressionText: "10", resultText: "10" })
    );

    const nextState = controller.memorySubtract(
      withMemory.copyWith({ resultText: "3" })
    );

    expect(nextState.memoryValueText).toBe("7");
  });

  it("recalls memory into the expression", () => {
    const withMemory = createState({
      memoryValueText: "42",
    });

    const nextState = controller.memoryRecall(withMemory);

    expect(nextState.expressionText).toBe("42");
  });

  it("clears memory", () => {
    const nextState = controller.memoryClear(
      createState({ memoryValueText: "42" })
    );

    expect(nextState.memoryValueText).toBeNull();
  });

  it("simplifies the expression symbolically", () => {
    const nextState = controller.simplifyExpression(
      createState({ expressionText: "x+x", casEnabled: true })
    );

    expect(nextState.resultText).toBe("2*x");
  });

  it("expands the expression symbolically", () => {
    const nextState = controller.expandExpression(
      createState({ expressionText: "(x+1)^2", casEnabled: true })
    );

    expect(nextState.resultText).toBe("x^2+2*x+1");
  });

  it("differentiates the expression symbolically", () => {
    const nextState = controller.differentiateExpression(
      createState({ expressionText: "x^2+x", casEnabled: true }),
      "x"
    );

    expect(nextState.resultText).toBe("2*x+1");
  });
});
