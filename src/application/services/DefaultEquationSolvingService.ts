import type { EquationSolvingGateway } from "../../domain/services/EquationSolvingGateway";
import type { EquationSolveResult, EquationSolvingService } from "./EquationSolvingService";

const FUNCTION_TOLERANCE = 1e-10;
const STEP_TOLERANCE = 1e-12;
const MAX_ITERATIONS = 100;

export class DefaultEquationSolvingService implements EquationSolvingService {
    public constructor(private readonly gateway: EquationSolvingGateway) {}

    public solve(
        expression: string,
        variableName: string,
        initialGuess: number,
    ): EquationSolveResult {
        const functionExpression = this.splitOnEquals(expression);

        if (functionExpression.trim().length === 0) {
            return this.failed("The equation is empty and cannot be solved.");
        }

        let current = initialGuess;
        let iterationCount = 0;

        while (iterationCount < MAX_ITERATIONS) {
            const functionValue = this.gateway.evaluate(functionExpression, variableName, current);
            const derivativeValue = this.gateway.numericDerivative(
                functionExpression,
                variableName,
                current,
            );

            if (!Number.isFinite(functionValue) || !Number.isFinite(derivativeValue)) {
                return this.failed(
                    "The function is not defined near the current guess. Choose a different starting value.",
                );
            }

            if (Math.abs(derivativeValue) < Number.EPSILON) {
                return this.failed(
                    "The slope is flat at the current guess, so Newton-Raphson cannot make progress.",
                );
            }

            const next = current - functionValue / derivativeValue;

            if (Math.abs(functionValue) <= FUNCTION_TOLERANCE) {
                return {
                    converged: true,
                    root: current,
                    iterationCount: iterationCount,
                    errorMessage: null,
                };
            }

            if (Math.abs(next - current) <= STEP_TOLERANCE) {
                return {
                    converged: true,
                    root: next,
                    iterationCount: iterationCount + 1,
                    errorMessage: null,
                };
            }

            current = next;
            iterationCount += 1;
        }

        return this.failed(
            "The solver did not converge within the iteration limit. Try a different starting value.",
        );
    }

    private splitOnEquals(expression: string): string {
        const equalsIndex = expression.indexOf("=");

        if (equalsIndex === -1) {
            return expression;
        }

        const leftSide = expression.slice(0, equalsIndex);
        const rightSide = expression.slice(equalsIndex + 1);

        return `(${leftSide})-(${rightSide})`;
    }

    private failed(errorMessage: string): EquationSolveResult {
        return { converged: false, root: null, iterationCount: 0, errorMessage: errorMessage };
    }
}
