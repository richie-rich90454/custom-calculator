export interface LinearRegressionResult {
    readonly slope: number;
    readonly intercept: number;
    readonly r: number;
    readonly r2: number;
}

export interface QuadraticRegressionResult {
    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly r2: number;
}

export interface RegressionAnalysisResult {
    readonly linear: LinearRegressionResult | null;
    readonly quadratic: QuadraticRegressionResult | null;
    readonly errorMessage: string | null;
}

export interface RegressionAnalysisService {
    linear(xs: readonly number[], ys: readonly number[]): RegressionAnalysisResult;
    quadratic(xs: readonly number[], ys: readonly number[]): RegressionAnalysisResult;
}
