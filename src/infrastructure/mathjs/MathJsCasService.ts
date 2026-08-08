import type { MathJsInstance } from "mathjs";
import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import type { CasService } from "../../domain/services/CasService";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";

export class MathJsCasService implements CasService {
  public constructor(
    private readonly instanceProvider: MathJsInstanceProvider,
    private readonly resultFormattingService: ResultFormattingService
  ) {}

  public simplifyExpression(expressionText: string): string {
    return this.performSymbolicOperation(expressionText, (math, node) => {
      return math.simplify(node as never);
    });
  }

  public expandExpression(expressionText: string): string {
    return this.performSymbolicOperation(expressionText, (math, node) => {
      // math.js removed the standalone expand function; rationalize
      // rewrites polynomial expressions into canonical expanded form.
      return math.rationalize(node as never, {});
    });
  }

  public differentiateExpression(
    expressionText: string,
    variableName: string
  ): string {
    return this.performSymbolicOperation(expressionText, (math, node) => {
      return math.derivative(node as never, variableName);
    });
  }

  private performSymbolicOperation(
    expressionText: string,
    operation: (math: MathJsInstance, node: unknown) => unknown
  ): string {
    const math = this.instanceProvider.getInstance();

    let parsedNode: unknown;

    try {
      parsedNode = math.parse(expressionText);
    } catch (error) {
      throw this.mapError(error);
    }

    try {
      const resultNode = operation(math, parsedNode);
      const formattedText = math.format(resultNode);

      return this.resultFormattingService.normalizeResultText(formattedText);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  public mapError(error: unknown): CalculationError {
    if (error instanceof CalculationError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);

    return new CalculationError(
      CalculationErrorCode.EVALUATION_FAILED,
      `Symbolic operation failed: ${message}`
    );
  }
}
