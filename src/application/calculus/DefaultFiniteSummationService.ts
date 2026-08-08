import { AngleMode } from "../../domain/model/AngleMode";
import type { CalculusExpressionEvaluator } from "./CalculusExpressionEvaluator";
import type { FiniteSummationService } from "./FiniteSummationService";

export class DefaultFiniteSummationService implements FiniteSummationService {
  private static readonly MAXIMUM_TERM_COUNT = 100000;

  public constructor(
    private readonly expressionEvaluator: CalculusExpressionEvaluator
  ) {}

  public sum(
    expressionText: string,
    variableName: string,
    lowerBound: number,
    upperBound: number,
    angleMode: AngleMode
  ): number {
    this.validateBounds(lowerBound, upperBound);

    let total = 0;

    for (let index = lowerBound; index <= upperBound; index += 1) {
      total += this.expressionEvaluator.evaluate(
        expressionText,
        variableName,
        index,
        angleMode
      );
    }

    return total;
  }

  private validateBounds(lowerBound: number, upperBound: number): void {
    if (!Number.isInteger(lowerBound) || !Number.isInteger(upperBound)) {
      throw new Error("Summation bounds must be integers.");
    }

    if (lowerBound > upperBound) {
      throw new Error(
        "Invalid summation bounds: the lower bound must not exceed the upper bound."
      );
    }

    const termCount = upperBound - lowerBound + 1;

    if (termCount > DefaultFiniteSummationService.MAXIMUM_TERM_COUNT) {
      throw new Error(
        "Summation is too large. Reduce the bounds to at most 100000 terms."
      );
    }
  }
}
