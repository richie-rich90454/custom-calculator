import { AngleMode } from "../../domain/model/AngleMode";
import type { CalculusExpressionEvaluator } from "./CalculusExpressionEvaluator";
import type { NumericDifferentiationService } from "./NumericDifferentiationService";

export class DefaultNumericDifferentiationService implements NumericDifferentiationService {
    private static readonly INITIAL_STEP_SIZE = 1e-3;
    private static readonly MINIMUM_STEP_SIZE = 1e-8;
    private static readonly CONVERGENCE_TOLERANCE = 1e-5;

    public constructor(private readonly expressionEvaluator: CalculusExpressionEvaluator) {}

    public estimateDerivative(
        expressionText: string,
        variableName: string,
        point: number,
        angleMode: AngleMode,
    ): number {
        const centralDifference = (stepSize: number): number => {
            const forwardValue = this.expressionEvaluator.evaluate(
                expressionText,
                variableName,
                point + stepSize,
                angleMode,
            );
            const backwardValue = this.expressionEvaluator.evaluate(
                expressionText,
                variableName,
                point - stepSize,
                angleMode,
            );

            return (forwardValue - backwardValue) / (2 * stepSize);
        };

        let stepSize = DefaultNumericDifferentiationService.INITIAL_STEP_SIZE;
        let previousEstimate = centralDifference(stepSize);

        while (stepSize > DefaultNumericDifferentiationService.MINIMUM_STEP_SIZE) {
            stepSize /= 10;
            const nextEstimate = centralDifference(stepSize);
            const extrapolatedEstimate = (16 * nextEstimate - previousEstimate) / 15;

            if (
                Math.abs(nextEstimate - previousEstimate) <=
                DefaultNumericDifferentiationService.CONVERGENCE_TOLERANCE
            ) {
                return extrapolatedEstimate;
            }

            previousEstimate = nextEstimate;
        }

        return previousEstimate;
    }
}
