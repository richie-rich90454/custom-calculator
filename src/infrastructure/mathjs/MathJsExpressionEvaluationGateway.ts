import type { MathJsInstance } from "mathjs";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { EvaluationResult } from "../../domain/model/EvaluationResult";
import { NumericMode } from "../../domain/model/NumericMode";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type { MathJsEvaluationScopeBuilder } from "./MathJsEvaluationScopeBuilder";
import type { MathJsFunctionWhitelist } from "./MathJsFunctionWhitelist";
import type { MathJsCalculationErrorMapper } from "./MathJsCalculationErrorMapper";

export class MathJsExpressionEvaluationGateway
  implements ExpressionEvaluationGateway
{
  private static readonly LOGARITHM_FUNCTION_PATTERN =
    /(?:^|[^a-zA-Z])(?:log|log10|log2|ln)\s*\(/;
  private static readonly DIVISION_OPERATOR_PATTERN = /\//;
  private static readonly DISPLAY_PRECISION = 15;

  public constructor(
    private readonly instanceProvider: MathJsInstanceProvider,
    private readonly scopeBuilder: MathJsEvaluationScopeBuilder,
    private readonly functionWhitelist: MathJsFunctionWhitelist,
    private readonly resultFormattingService: ResultFormattingService,
    private readonly calculationErrorMapper: MathJsCalculationErrorMapper
  ) {}

  public evaluateExpression(
    sessionState: CalculatorSessionState
  ): EvaluationResult {
    const math = this.instanceProvider.getInstance();

    this.configureMathInstance(math, sessionState);

    const scope = this.scopeBuilder.buildScope(math, sessionState);

    let node;
    try {
      node = math.parse(sessionState.expressionText);
    } catch (error) {
      throw this.calculationErrorMapper.mapParseError(error);
    }

    this.validateExpressionNode(node, scope);

    let result: unknown;
    try {
      result = node.compile().evaluate(scope);
    } catch (error) {
      throw this.calculationErrorMapper.mapEvaluationError(error);
    }

    this.validateResultType(result, sessionState.numericMode);
    this.rejectNonFiniteResults(result, math, sessionState);

    const resultText = this.formatResult(result, math, sessionState.numericMode);

    return new EvaluationResult(
      sessionState.expressionText,
      this.resultFormattingService.normalizeResultText(resultText),
      result
    );
  }

  private configureMathInstance(
    math: MathJsInstance,
    sessionState: CalculatorSessionState
  ): void {
    const predictable = !sessionState.complexNumbersEnabled;

    if (sessionState.numericMode === NumericMode.EXACT_DECIMAL) {
      math.config({
        number: "BigNumber",
        precision: 30,
        predictable: predictable,
      });
      return;
    }

    if (sessionState.numericMode === NumericMode.FRACTION) {
      math.config({
        number: "Fraction",
        predictable: predictable,
      });
      return;
    }

    if (sessionState.numericMode === NumericMode.BIGINT) {
      math.config({
        number: "bigint",
        predictable: predictable,
      });
      return;
    }

    math.config({
      number: "number",
      predictable: predictable,
    });
  }

  private validateExpressionNode(
    node: unknown,
    scope: Record<string, unknown>
  ): void {
    const mathNode = node as {
      traverse(callback: (child: { type: string }) => void): void;
    };

    mathNode.traverse((child) => {
      if (child.type === "FunctionNode") {
        const functionNode = child as unknown as { fn: { name: string } };
        const functionName = functionNode.fn.name;

        if (!this.functionWhitelist.isFunctionAllowed(functionName)) {
          throw new CalculationError(
            CalculationErrorCode.UNKNOWN_FUNCTION,
            `Unknown function: ${functionName}.`
          );
        }
      } else if (child.type === "SymbolNode") {
        const symbolNode = child as unknown as { name: string };
        const symbolName = symbolNode.name;

        if (this.functionWhitelist.isFunctionAllowed(symbolName)) {
          return;
        }

        if (!(symbolName in scope)) {
          throw new CalculationError(
            CalculationErrorCode.UNKNOWN_VARIABLE,
            `Unknown variable or constant: ${symbolName}.`
          );
        }
      }
    });
  }

  private validateResultType(
    result: unknown,
    numericMode: NumericMode
  ): void {
    if (numericMode !== NumericMode.BIGINT) {
      return;
    }

    if (typeof result !== "bigint") {
      throw new CalculationError(
        CalculationErrorCode.UNSUPPORTED_NUMERIC_MODE,
        "This operation does not produce an integer result and is not supported in BigInt mode."
      );
    }
  }

  private rejectNonFiniteResults(
    result: unknown,
    math: MathJsInstance,
    sessionState: CalculatorSessionState
  ): void {
    if (math.isNaN(result as never)) {
      throw this.createDomainErrorForResult(sessionState.expressionText);
    }

    const formattedResult = math.format(result);

    if (
      formattedResult.includes("Infinity") ||
      formattedResult.includes("NaN")
    ) {
      throw this.createInfinityErrorForResult(sessionState.expressionText);
    }
  }

  private createDomainErrorForResult(expressionText: string): CalculationError {
    if (
      MathJsExpressionEvaluationGateway.LOGARITHM_FUNCTION_PATTERN.test(
        expressionText
      )
    ) {
      return new CalculationError(
        CalculationErrorCode.DOMAIN_ERROR,
        "Domain error: the logarithm is undefined for zero or negative values."
      );
    }

    return new CalculationError(
      CalculationErrorCode.DOMAIN_ERROR,
      "Domain error: the result is undefined for the given input."
    );
  }

  private createInfinityErrorForResult(
    expressionText: string
  ): CalculationError {
    if (
      MathJsExpressionEvaluationGateway.LOGARITHM_FUNCTION_PATTERN.test(
        expressionText
      )
    ) {
      return new CalculationError(
        CalculationErrorCode.DOMAIN_ERROR,
        "Domain error: the logarithm is undefined for zero or negative values."
      );
    }

    if (
      MathJsExpressionEvaluationGateway.DIVISION_OPERATOR_PATTERN.test(
        expressionText
      )
    ) {
      return new CalculationError(
        CalculationErrorCode.DIVISION_BY_ZERO,
        "Division by zero produced a non-finite result."
      );
    }

    return new CalculationError(
      CalculationErrorCode.OVERFLOW,
      "Result is too large to represent."
    );
  }

  private formatResult(
    result: unknown,
    math: MathJsInstance,
    numericMode: NumericMode
  ): string {
    if (numericMode === NumericMode.FRACTION) {
      return math.format(result, {
        fraction: "ratio",
        precision: MathJsExpressionEvaluationGateway.DISPLAY_PRECISION,
      });
    }

    if (numericMode === NumericMode.BIGINT) {
      return String(result);
    }

    return math.format(result, {
      precision: MathJsExpressionEvaluationGateway.DISPLAY_PRECISION,
    });
  }
}
