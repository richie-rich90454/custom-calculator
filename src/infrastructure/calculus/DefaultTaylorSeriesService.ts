import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { AngleMode } from "../../domain/model/AngleMode";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import { CalculusAngleModePolicy } from "../../application/calculus/CalculusAngleModePolicy";
import type { CalculusExpressionEvaluator } from "../../application/calculus/CalculusExpressionEvaluator";
import type { SymbolicDifferentiationService } from "../../application/calculus/SymbolicDifferentiationService";
import type { TaylorSeriesService } from "../../application/calculus/TaylorSeriesService";
import type { MathJsInstanceProvider } from "../mathjs/MathJsInstanceProvider";

export class DefaultTaylorSeriesService implements TaylorSeriesService {
  private static readonly MAXIMUM_ORDER = 15;

  public constructor(
    private readonly instanceProvider: MathJsInstanceProvider,
    private readonly differentiationService: SymbolicDifferentiationService,
    private readonly expressionEvaluator: CalculusExpressionEvaluator,
    private readonly resultFormattingService: ResultFormattingService
  ) {}

  public expand(
    expressionText: string,
    variableName: string,
    center: number,
    order: number,
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): string {
    if (order > DefaultTaylorSeriesService.MAXIMUM_ORDER) {
      throw new Error(
        `Taylor series order is too large. The maximum supported order is ${DefaultTaylorSeriesService.MAXIMUM_ORDER}.`
      );
    }

    const math = this.instanceProvider.getInstance();
    const originalNumberType = math.config({}).number!;

    math.config({ number: "Fraction" });

    try {
      let currentDerivativeText = expressionText;
      let sumNode = math.parse("0");

      for (let index = 0; index <= order; index += 1) {
        const coefficient = this.evaluateCoefficient(
          currentDerivativeText,
          variableName,
          center
        );
        const factorial = this.computeFactorial(index);
        const termCoefficient = coefficient / factorial;
        const termText =
          index === 0
            ? this.formatCoefficient(math, termCoefficient)
            : `${this.formatCoefficient(math, termCoefficient)} * (${variableName} - (${center}))^${index}`;

        sumNode = new math.OperatorNode("+", "add", [
          sumNode,
          math.parse(termText),
        ]);

        if (index < order) {
          currentDerivativeText =
            this.differentiationService.differentiateSymbolically(
              currentDerivativeText,
              variableName,
              angleMode,
              policy
            );
        }
      }

      const simplifiedNode = math.simplify(sumNode);

      return this.resultFormattingService.normalizeResultText(
        math.format(simplifiedNode)
      );
    } finally {
      math.config({ number: originalNumberType });
    }
  }

  private evaluateCoefficient(
    derivativeText: string,
    variableName: string,
    center: number
  ): number {
    try {
      return this.expressionEvaluator.evaluate(
        derivativeText,
        variableName,
        center,
        AngleMode.RAD
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new CalculationError(
        CalculationErrorCode.EVALUATION_FAILED,
        `Taylor series could not be computed: the expression is not analytic at the given center (${message}).`
      );
    }
  }

  private formatCoefficient(math: unknown, value: number): string {
    const mathInstance = math as {
      fraction(value: number): { s: number; n: string; d: string };
      format(value: number, options: { precision: number }): string;
    };
    const fraction = mathInstance.fraction(value);
    const numerator = Number(fraction.n);
    const denominator = Number(fraction.d);

    if (denominator <= 10000 && numerator <= 100000) {
      const magnitude = `${numerator}/${denominator}`;

      return fraction.s < 0 ? `-(${magnitude})` : `(${magnitude})`;
    }

    return `(${mathInstance.format(value, { precision: 10 })})`;
  }

  private computeFactorial(value: number): number {
    let result = 1;

    for (let index = 2; index <= value; index += 1) {
      result *= index;
    }

    return result;
  }
}
