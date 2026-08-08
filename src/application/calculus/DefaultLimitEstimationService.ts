import { AngleMode } from "../../domain/model/AngleMode";
import { LimitDirection } from "./CalculusBlockDescriptor";
import type { CalculusExpressionEvaluator } from "./CalculusExpressionEvaluator";
import type { LimitEstimate, LimitEstimationService } from "./LimitEstimationService";

export class DefaultLimitEstimationService implements LimitEstimationService {
  private static readonly SAMPLE_STEPS: readonly number[] = [
    1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8,
  ];
  private static readonly INFINITY_THRESHOLD = 1e8;
  private static readonly CONVERGENCE_TOLERANCE = 1e-6;

  public constructor(
    private readonly expressionEvaluator: CalculusExpressionEvaluator
  ) {}

  public estimateLimit(
    expressionText: string,
    variableName: string,
    target: number,
    direction: LimitDirection,
    angleMode: AngleMode
  ): LimitEstimate {
    if (direction === LimitDirection.LEFT || direction === LimitDirection.RIGHT) {
      const samples = this.sampleSide(
        expressionText,
        variableName,
        target,
        direction,
        angleMode
      );

      return this.analyzeSamples(samples);
    }

    const leftSamples = this.sampleSide(
      expressionText,
      variableName,
      target,
      LimitDirection.LEFT,
      angleMode
    );
    const rightSamples = this.sampleSide(
      expressionText,
      variableName,
      target,
      LimitDirection.RIGHT,
      angleMode
    );
    const leftEstimate = this.analyzeSamples(leftSamples);
    const rightEstimate = this.analyzeSamples(rightSamples);

    return this.reconcileTwoSidedLimits(leftEstimate, rightEstimate);
  }

  private sampleSide(
    expressionText: string,
    variableName: string,
    target: number,
    direction: LimitDirection,
    angleMode: AngleMode
  ): readonly number[] {
    const offset =
      direction === LimitDirection.LEFT
        ? (step: number): number => -step
        : (step: number): number => step;

    return DefaultLimitEstimationService.SAMPLE_STEPS.map((step) =>
      this.expressionEvaluator.evaluate(
        expressionText,
        variableName,
        target + offset(step),
        angleMode
      )
    );
  }

  private analyzeSamples(samples: readonly number[]): LimitEstimate {
    const lastSamples = samples.slice(-3);
    const closestValue = lastSamples[lastSamples.length - 1]!;
    const previousValue = lastSamples[lastSamples.length - 2]!;

    if (
      Math.abs(closestValue) >= DefaultLimitEstimationService.INFINITY_THRESHOLD &&
      Math.abs(closestValue) > Math.abs(previousValue)
    ) {
      return {
        kind: "INFINITY",
        sign: Math.sign(closestValue) as 1 | -1,
      };
    }

    for (let index = 0; index < lastSamples.length - 1; index += 1) {
      const current = lastSamples[index]!;
      const next = lastSamples[index + 1]!;

      if (
        Math.abs(current - next) >
        DefaultLimitEstimationService.CONVERGENCE_TOLERANCE *
          Math.max(1, Math.abs(next))
      ) {
        throw new Error(
          "The limit does not exist or is not finite for the given expression."
        );
      }
    }

    return { kind: "FINITE", value: closestValue };
  }

  private reconcileTwoSidedLimits(
    leftEstimate: LimitEstimate,
    rightEstimate: LimitEstimate
  ): LimitEstimate {
    if (leftEstimate.kind === "INFINITY" && rightEstimate.kind === "INFINITY") {
      if (leftEstimate.sign === rightEstimate.sign) {
        return leftEstimate;
      }

      throw new Error(
        "The limit does not exist: the left and right limits diverge to opposite infinities."
      );
    }

    if (leftEstimate.kind !== "FINITE" || rightEstimate.kind !== "FINITE") {
      throw new Error(
        "The limit does not exist: the left and right limits do not agree."
      );
    }

    const difference = Math.abs(leftEstimate.value - rightEstimate.value);
    const tolerance =
      DefaultLimitEstimationService.CONVERGENCE_TOLERANCE *
      Math.max(1, Math.abs(rightEstimate.value));

    if (difference > tolerance) {
      throw new Error(
        "The limit does not exist: the left and right limits do not agree."
      );
    }

    return {
      kind: "FINITE",
      value: (leftEstimate.value + rightEstimate.value) / 2,
    };
  }
}
