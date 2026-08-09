/**
 * The outcome of a Newton-Raphson solve.
 *
 * A solve either converges to a root and reports the iteration count, or
 * fails clearly with a message describing why no root was found.
 */
export interface EquationSolveResult {
    readonly converged: boolean;
    readonly root: number | null;
    readonly iterationCount: number;
    readonly errorMessage: string | null;
}

export interface EquationSolvingService {
    /**
     * Splits the expression on "=" and solves for a single variable.
     *
     * When the expression contains no "=" it is solved as f(x) = 0.
     */
    solve(expression: string, variableName: string, initialGuess: number): EquationSolveResult;
}
