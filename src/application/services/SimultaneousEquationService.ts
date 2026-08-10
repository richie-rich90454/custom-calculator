export interface SimultaneousEquationResult {
    readonly solution: readonly number[] | null;
    readonly errorMessage: string | null;
}

export interface SimultaneousEquationService {
    solve(
        matrix: readonly (readonly number[])[],
        constants: readonly number[],
    ): SimultaneousEquationResult;
}
