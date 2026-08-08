import { CalculationError } from "../model/CalculationError";
import { CalculationErrorCode } from "../model/CalculationErrorCode";
import { CalculatorSessionState } from "../model/CalculatorSessionState";
import type { ConstantCatalogService } from "./ConstantCatalogService";
import type { ExpressionValidationService } from "./ExpressionValidationService";
import type { ScientificFunctionCatalogService } from "./ScientificFunctionCatalogService";

export class DefaultExpressionValidationService
  implements ExpressionValidationService
{
  private static readonly IDENTIFIER_PATTERN = /[a-zA-Z][a-zA-Z0-9_]*/g;
  private static readonly TRAILING_OPERATOR_PATTERN = /[+\-*/^%]$/;
  private static readonly CAS_FUNCTION_NAMES: readonly string[] = [
    "cas",
    "casSimplify",
    "casExpand",
    "casDerivative",
  ];

  public constructor(
    private readonly functionCatalogService: ScientificFunctionCatalogService,
    private readonly constantCatalogService: ConstantCatalogService
  ) {}

  public validateExpression(
    sessionState: CalculatorSessionState
  ): CalculationError | null {
    const expressionText = sessionState.expressionText.trim();

    if (expressionText.length === 0) {
      return null;
    }

    const parenthesisError = this.validateParentheses(expressionText);

    if (parenthesisError !== null) {
      return parenthesisError;
    }

    const operatorError = this.validateOperatorPlacement(expressionText);

    if (operatorError !== null) {
      return operatorError;
    }

    return this.validateIdentifiers(sessionState);
  }

  private validateParentheses(expressionText: string): CalculationError | null {
    let balance = 0;

    for (const character of expressionText) {
      if (character === "(") {
        balance += 1;
      } else if (character === ")") {
        balance -= 1;
      }

      if (balance < 0) {
        return new CalculationError(
          CalculationErrorCode.MISSING_PARENTHESES,
          "Mismatched parentheses: an opening parenthesis is missing."
        );
      }
    }

    if (balance > 0) {
      return new CalculationError(
        CalculationErrorCode.MISSING_PARENTHESES,
        "Mismatched parentheses: a closing parenthesis is missing."
      );
    }

    return null;
  }

  private validateOperatorPlacement(
    expressionText: string
  ): CalculationError | null {
    if (DefaultExpressionValidationService.TRAILING_OPERATOR_PATTERN.test(
      expressionText
    )) {
      return new CalculationError(
        CalculationErrorCode.SYNTAX_ERROR,
        "Syntax error: the expression ends with an operator."
      );
    }

    if (/^[*/%^]/.test(expressionText)) {
      return new CalculationError(
        CalculationErrorCode.SYNTAX_ERROR,
        "Syntax error: the expression cannot begin with this operator."
      );
    }

    if (/[+\-*/^%]{2,}/.test(expressionText)) {
      return new CalculationError(
        CalculationErrorCode.SYNTAX_ERROR,
        "Syntax error: consecutive operators are not allowed."
      );
    }

    return null;
  }

  private validateIdentifiers(
    sessionState: CalculatorSessionState
  ): CalculationError | null {
    const expressionText = sessionState.expressionText;
    const matches = expressionText.matchAll(
      DefaultExpressionValidationService.IDENTIFIER_PATTERN
    );

    for (const match of matches) {
      const identifier = match[0];

      if (identifier === "ans") {
        continue;
      }

      const nextCharacter = expressionText.charAt(
        match.index + match[0].length
      );

      const isFunctionInvocation = nextCharacter === "(";

      if (isFunctionInvocation) {
        if (
          !this.functionCatalogService.hasFunction(identifier) &&
          !this.isUserVariable(identifier, sessionState) &&
          !this.isCasFunctionInvocation(identifier, sessionState)
        ) {
          return new CalculationError(
            CalculationErrorCode.UNKNOWN_FUNCTION,
            `Unknown function: ${identifier}.`
          );
        }
      } else {
        if (
          !this.functionCatalogService.hasFunction(identifier) &&
          !this.constantCatalogService.hasIdentifier(identifier) &&
          !this.isUserVariable(identifier, sessionState) &&
          !sessionState.casEnabled
        ) {
          return new CalculationError(
            CalculationErrorCode.UNKNOWN_VARIABLE,
            `Unknown variable or constant: ${identifier}.`
          );
        }
      }
    }

    return null;
  }

  private isUserVariable(
    identifier: string,
    sessionState: CalculatorSessionState
  ): boolean {
    return sessionState.variables.some(
      (variable) => variable.name === identifier
    );
  }

  private isCasFunctionInvocation(
    identifier: string,
    sessionState: CalculatorSessionState
  ): boolean {
    return (
      sessionState.casEnabled &&
      DefaultExpressionValidationService.CAS_FUNCTION_NAMES.includes(identifier)
    );
  }
}
