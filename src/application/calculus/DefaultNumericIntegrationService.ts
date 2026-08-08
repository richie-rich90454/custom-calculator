import { AngleMode } from "../../domain/model/AngleMode";
import type { CalculusExpressionEvaluator } from "./CalculusExpressionEvaluator";
import type { NumericIntegrationService } from "./NumericIntegrationService";

export class DefaultNumericIntegrationService implements NumericIntegrationService {
    private static readonly INITIAL_TOLERANCE = 1e-8;
    private static readonly MAXIMUM_RECURSION_DEPTH = 20;

    public constructor(private readonly expressionEvaluator: CalculusExpressionEvaluator) {}

    public integrate(
        expressionText: string,
        variableName: string,
        lowerBound: number,
        upperBound: number,
        angleMode: AngleMode,
    ): number {
        if (lowerBound === upperBound) {
            return 0;
        }

        const integrand = (value: number): number =>
            this.expressionEvaluator.evaluate(expressionText, variableName, value, angleMode);

        try {
            const wholeInterval = this.computeSimpsonInterval(integrand, lowerBound, upperBound);

            return this.adaptivelyRefine(
                integrand,
                lowerBound,
                upperBound,
                wholeInterval,
                DefaultNumericIntegrationService.INITIAL_TOLERANCE,
                0,
            );
        } catch (error) {
            if (this.isNonFiniteEvaluationError(error)) {
                throw new Error(
                    "The integral does not converge. The integrand may have a singularity in the interval.",
                );
            }

            throw error;
        }
    }

    private adaptivelyRefine(
        integrand: (value: number) => number,
        lowerBound: number,
        upperBound: number,
        wholeIntervalEstimate: number,
        tolerance: number,
        depth: number,
    ): number {
        const midpoint = (lowerBound + upperBound) / 2;
        const leftInterval = this.computeSimpsonInterval(integrand, lowerBound, midpoint);
        const rightInterval = this.computeSimpsonInterval(integrand, midpoint, upperBound);
        const refinedEstimate = leftInterval + rightInterval;
        const errorEstimate = refinedEstimate - wholeIntervalEstimate;

        if (
            Math.abs(errorEstimate) <= 15 * tolerance ||
            depth >= DefaultNumericIntegrationService.MAXIMUM_RECURSION_DEPTH
        ) {
            return refinedEstimate + errorEstimate / 15;
        }

        const halfTolerance = tolerance / 2;

        return (
            this.adaptivelyRefine(
                integrand,
                lowerBound,
                midpoint,
                leftInterval,
                halfTolerance,
                depth + 1,
            ) +
            this.adaptivelyRefine(
                integrand,
                midpoint,
                upperBound,
                rightInterval,
                halfTolerance,
                depth + 1,
            )
        );
    }

    private computeSimpsonInterval(
        integrand: (value: number) => number,
        lowerBound: number,
        upperBound: number,
    ): number {
        const midpoint = (lowerBound + upperBound) / 2;

        return (
            ((upperBound - lowerBound) / 6) *
            (integrand(lowerBound) + 4 * integrand(midpoint) + integrand(upperBound))
        );
    }

    private isNonFiniteEvaluationError(error: unknown): boolean {
        return error instanceof Error && error.message.includes("non finite value");
    }
}
