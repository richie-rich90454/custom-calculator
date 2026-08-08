import { CasOperationKind } from "./CasOperationKind";
import type { CasBlockDescriptor } from "./CasBlockDescriptor";
import type { CasBlockParser } from "./CasBlockParser";

/**
 * Parses top-level cas(...) blocks from expression text.
 *
 * Supported forms are cas(...), casSimplify(...), casExpand(...), and
 * casDerivative(expression[, variable]). The parser works on raw text so the
 * application layer never depends on a specific symbolic engine.
 */
export class DefaultCasBlockParser implements CasBlockParser {
  private static readonly CAS_FUNCTION_PATTERN =
    /^(cas|casSimplify|casExpand|casDerivative)\s*\((.*)\)$/s;

  private static readonly DEFAULT_DERIVATIVE_VARIABLE = "x";

  public parseBlock(expressionText: string): CasBlockDescriptor | null {
    const match = DefaultCasBlockParser.CAS_FUNCTION_PATTERN.exec(
      expressionText.trim()
    );

    if (match === null) {
      return null;
    }

    const functionName = match[1]!;
    const argumentsText = (match[2]!).trim();

    if (argumentsText.length === 0) {
      return null;
    }

    const operationKind = this.resolveOperationKind(functionName);

    if (operationKind === CasOperationKind.DERIVATIVE) {
      return this.parseDerivativeBlock(argumentsText);
    }

    return {
      operationKind: operationKind,
      innerExpressionText: argumentsText,
      derivativeVariableName: null,
    };
  }

  public resolveOperationKind(functionName: string): CasOperationKind {
    switch (functionName) {
      case "cas":
      case "casSimplify":
        return CasOperationKind.SIMPLIFY;
      case "casExpand":
        return CasOperationKind.EXPAND;
      case "casDerivative":
        return CasOperationKind.DERIVATIVE;
      default:
        return CasOperationKind.SIMPLIFY;
    }
  }

  private parseDerivativeBlock(
    argumentsText: string
  ): CasBlockDescriptor {
    const argumentsList = this.splitTopLevelArguments(argumentsText);
    const expressionText = (argumentsList[0]!).trim();
    const variableName = (argumentsList[1] ?? "").trim();
    return {
      operationKind: CasOperationKind.DERIVATIVE,
      innerExpressionText: expressionText,
      derivativeVariableName:
        variableName.length > 0
          ? variableName
          : DefaultCasBlockParser.DEFAULT_DERIVATIVE_VARIABLE,
    };
  }

  /**
   * Splits a comma separated argument list, ignoring commas that appear
   * inside nested parentheses such as sin(x, y).
   */
  private splitTopLevelArguments(argumentsText: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let currentPart = "";

    for (const character of argumentsText) {
      if (character === "(") {
        depth += 1;
      } else if (character === ")") {
        depth -= 1;
      }

      if (character === "," && depth === 0) {
        parts.push(currentPart);
        currentPart = "";
        continue;
      }

      currentPart += character;
    }

    parts.push(currentPart);

    return parts;
  }
}
