import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { AngleMode } from "../../domain/model/AngleMode";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import type { CalculusAngleModePolicyService } from "../../application/calculus/CalculusAngleModePolicyService";
import { CalculusAngleModePolicy } from "../../application/calculus/CalculusAngleModePolicy";
import type { SymbolicDifferentiationService } from "../../application/calculus/SymbolicDifferentiationService";
import type { MathJsInstanceProvider } from "../mathjs/MathJsInstanceProvider";

export class DefaultSymbolicDifferentiationService
  implements SymbolicDifferentiationService
{
  private static readonly ANGLE_AWARE_TRIG_FUNCTIONS = new Set([
    "sin",
    "cos",
    "tan",
  ]);

  public constructor(
    private readonly instanceProvider: MathJsInstanceProvider,
    private readonly angleModePolicyService: CalculusAngleModePolicyService,
    private readonly resultFormattingService: ResultFormattingService
  ) {}

  public differentiateSymbolically(
    expressionText: string,
    variableName: string,
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): string {
    const math = this.instanceProvider.getInstance();

    let parsedNode: unknown;

    try {
      parsedNode = math.parse(expressionText);
    } catch (error) {
      throw this.mapSymbolicError(error);
    }

    const conversionFactor =
      this.angleModePolicyService.getSymbolicTrigConversionFactor(
        angleMode,
        policy
      );

    const preparedNode =
      conversionFactor === 1
        ? parsedNode
        : this.applyAngleConversion(parsedNode, conversionFactor);

    try {
      const derivativeNode = math.derivative(preparedNode as never, variableName);
      const simplifiedNode = this.trySimplify(derivativeNode);
      const formattedText = math.format(simplifiedNode);

      return this.resultFormattingService.normalizeResultText(formattedText);
    } catch (error) {
      throw this.mapSymbolicError(error);
    }
  }

  private applyAngleConversion(node: unknown, factor: number): unknown {
    const math = this.instanceProvider.getInstance();
    const mathJsNode = node as {
      transform(callback: (child: unknown) => unknown): unknown;
    };

    return mathJsNode.transform((child) => {
      const childNode = child as {
        readonly type: string;
        readonly fn?: { readonly name: string };
        readonly args?: readonly unknown[];
      };

      if (
        childNode.type !== "FunctionNode" ||
        childNode.fn === undefined ||
        childNode.args === undefined
      ) {
        return child;
      }

      if (
        !DefaultSymbolicDifferentiationService.ANGLE_AWARE_TRIG_FUNCTIONS.has(
          childNode.fn.name
        )
      ) {
        return child;
      }

      const argument = childNode.args[0]!;
      const scaledArgument = new math.OperatorNode(
        "*",
        "multiply",
        [argument as never, new math.ConstantNode(factor)]
      );

      return new math.FunctionNode(childNode.fn, [scaledArgument]) as never;
    });
  }

  private trySimplify(node: unknown): unknown {
    try {
      return this.instanceProvider.getInstance().simplify(node as never);
    } catch {
      return node;
    }
  }

  private mapSymbolicError(error: unknown): CalculationError {
    if (error instanceof CalculationError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);

    return new CalculationError(
      CalculationErrorCode.EVALUATION_FAILED,
      `Symbolic differentiation failed: ${message}`
    );
  }
}
