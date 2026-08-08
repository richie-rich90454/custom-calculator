import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import type { ExpressionTextEdit } from "../../domain/services/ExpressionEditingService";

export interface CalculatorApplicationController {
  applyInsertion(
    currentState: CalculatorSessionState,
    edit: ExpressionTextEdit
  ): CalculatorSessionState;

  insertDigit(
    currentState: CalculatorSessionState,
    digit: string
  ): CalculatorSessionState;

  insertOperator(
    currentState: CalculatorSessionState,
    operator: string
  ): CalculatorSessionState;

  insertFunction(
    currentState: CalculatorSessionState,
    functionName: string
  ): CalculatorSessionState;

  insertConstant(
    currentState: CalculatorSessionState,
    constantId: string
  ): CalculatorSessionState;

  insertVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState;

  insertParenthesis(
    currentState: CalculatorSessionState,
    parenthesis: string
  ): CalculatorSessionState;

  deleteBackward(currentState: CalculatorSessionState): CalculatorSessionState;

  deleteForward(currentState: CalculatorSessionState): CalculatorSessionState;

  deleteWordBackward(
    currentState: CalculatorSessionState
  ): CalculatorSessionState;

  clearSession(currentState: CalculatorSessionState): CalculatorSessionState;

  setExpressionText(
    currentState: CalculatorSessionState,
    expressionText: string
  ): CalculatorSessionState;

  evaluateExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState;

  cycleAngleMode(currentState: CalculatorSessionState): CalculatorSessionState;

  changeNumericMode(
    currentState: CalculatorSessionState,
    numericMode: NumericMode
  ): CalculatorSessionState;

  toggleComplexNumbers(
    currentState: CalculatorSessionState
  ): CalculatorSessionState;

  toggleCasMode(currentState: CalculatorSessionState): CalculatorSessionState;

  saveVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState;

  deleteVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState;

  memoryAdd(currentState: CalculatorSessionState): CalculatorSessionState;

  memorySubtract(currentState: CalculatorSessionState): CalculatorSessionState;

  memoryRecall(currentState: CalculatorSessionState): CalculatorSessionState;

  memoryClear(currentState: CalculatorSessionState): CalculatorSessionState;

  simplifyExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState;

  expandExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState;

  differentiateExpression(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState;
}
