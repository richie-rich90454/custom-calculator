import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";

/**
 * Maps math.js parse and evaluation failures into domain calculation errors.
 *
 * The mapper is a pure service so every error classification branch can be
 * unit tested with crafted messages instead of relying on the math.js engine
 * to reproduce each failure path.
 */
export class MathJsCalculationErrorMapper {
  public mapParseError(error: unknown): CalculationError {
    const message = this.extractErrorMessage(error);

    if (message.includes("Unexpected end of expression")) {
      return new CalculationError(
        CalculationErrorCode.MISSING_PARENTHESES,
        "Missing parentheses: the expression is incomplete."
      );
    }

    if (message.includes("Parenthesis")) {
      return new CalculationError(
        CalculationErrorCode.MISSING_PARENTHESES,
        "Missing parentheses: the expression has unbalanced parentheses."
      );
    }

    return new CalculationError(
      CalculationErrorCode.SYNTAX_ERROR,
      `Syntax error: ${message}`
    );
  }

  public mapEvaluationError(error: unknown): CalculationError {
    const message = this.extractErrorMessage(error);

    if (message.includes("Division by zero") || message.includes("Division by Zero")) {
      return new CalculationError(
        CalculationErrorCode.DIVISION_BY_ZERO,
        "Division by zero is not defined."
      );
    }

    if (message.includes("Undefined function")) {
      return new CalculationError(
        CalculationErrorCode.UNKNOWN_FUNCTION,
        `Unknown function: ${message.replace("Undefined function ", "")}.`
      );
    }

    if (message.includes("Undefined symbol")) {
      return new CalculationError(
        CalculationErrorCode.UNKNOWN_VARIABLE,
        `Unknown variable or constant: ${message.replace(
          "Undefined symbol ",
          ""
        )}.`
      );
    }

    if (message.includes("Unexpected")) {
      return new CalculationError(
        CalculationErrorCode.SYNTAX_ERROR,
        `Syntax error: ${message}`
      );
    }

    return new CalculationError(
      CalculationErrorCode.EVALUATION_FAILED,
      `Evaluation failed: ${message}`
    );
  }

  public extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
