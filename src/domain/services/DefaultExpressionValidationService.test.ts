import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculationErrorCode } from "../model/CalculationErrorCode";
import { CalculatorSessionState } from "../model/CalculatorSessionState";
import { VariableAssignment } from "../model/VariableAssignment";
import { NumericMode } from "../model/NumericMode";
import { DefaultExpressionValidationService } from "./DefaultExpressionValidationService";
import { DefaultScientificFunctionCatalogService } from "./DefaultScientificFunctionCatalogService";

describe("DefaultExpressionValidationService", () => {
  const compositionRoot = new CalculatorCompositionRoot();
  const service = new DefaultExpressionValidationService(
    new DefaultScientificFunctionCatalogService(),
    compositionRoot.constantCatalogService
  );

  function validate(expressionText: string) {
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      expressionText: expressionText,
    });

    return service.validateExpression(sessionState);
  }

  it("accepts a valid expression", () => {
    expect(validate("2+3*4")).toBeNull();
  });

  it("accepts an empty expression", () => {
    expect(validate("")).toBeNull();
  });

  it("accepts known functions and constants", () => {
    expect(validate("sin(30)+speedOfLight")).toBeNull();
    expect(validate("pi+e")).toBeNull();
  });

  it("rejects an expression with missing parentheses", () => {
    const error = validate("(2+3");

    expect(error).not.toBeNull();
    expect(error?.code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
  });

  it("rejects an expression with an extra closing parenthesis", () => {
    const error = validate("2+3)");

    expect(error).not.toBeNull();
    expect(error?.code).toBe(CalculationErrorCode.MISSING_PARENTHESES);
  });

  it("rejects an expression ending with an operator", () => {
    const error = validate("2+");

    expect(error?.code).toBe(CalculationErrorCode.SYNTAX_ERROR);
  });

  it("rejects an expression beginning with a multiplication operator", () => {
    const error = validate("*2");

    expect(error?.code).toBe(CalculationErrorCode.SYNTAX_ERROR);
  });

  it("rejects consecutive operators", () => {
    const error = validate("2++3");

    expect(error?.code).toBe(CalculationErrorCode.SYNTAX_ERROR);
  });

  it("rejects an unknown function invocation", () => {
    const error = validate("notAFunction(2)");

    expect(error?.code).toBe(CalculationErrorCode.UNKNOWN_FUNCTION);
  });

  it("rejects an unknown identifier when CAS is disabled", () => {
    const error = validate("2+unknownSymbol");

    expect(error?.code).toBe(CalculationErrorCode.UNKNOWN_VARIABLE);
  });

  it("accepts an unknown identifier when CAS is enabled", () => {
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      expressionText: "2+unknownSymbol",
      casEnabled: true,
    });

    expect(service.validateExpression(sessionState)).toBeNull();
  });

  it("accepts a CAS function invocation when CAS is enabled", () => {
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      expressionText: "cas(x+x)",
      casEnabled: true,
    });

    expect(service.validateExpression(sessionState)).toBeNull();
  });

  it("rejects a CAS function invocation when CAS is disabled", () => {
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      expressionText: "cas(x+x)",
      casEnabled: false,
    });

    const error = service.validateExpression(sessionState);

    expect(error?.code).toBe(CalculationErrorCode.UNKNOWN_FUNCTION);
  });

  it("accepts a user-defined variable", () => {
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      expressionText: "x+1",
      variables: [
        new VariableAssignment(
          "x",
          "4",
          NumericMode.STANDARD,
          new Date().toISOString()
        ),
      ],
    });

    expect(service.validateExpression(sessionState)).toBeNull();
  });
});
