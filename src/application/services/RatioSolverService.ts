export interface RatioSolveResult {
    readonly value: number | null;
    readonly errorMessage: string | null;
}

export interface RatioSolverService {
    solve(a: number | null, b: number | null, c: number | null, d: number | null): RatioSolveResult;
}
