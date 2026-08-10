export interface PolynomialRoot {
    readonly re: number;
    readonly im: number;
}

export interface PolynomialRootResult {
    readonly roots: readonly PolynomialRoot[];
    readonly errorMessage: string | null;
}

export interface PolynomialRootService {
    solve(coefficients: readonly number[]): PolynomialRootResult;
}
