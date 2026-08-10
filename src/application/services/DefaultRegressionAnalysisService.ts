import type {
    LinearRegressionResult,
    QuadraticRegressionResult,
    RegressionAnalysisResult,
    RegressionAnalysisService,
} from "./RegressionAnalysisService";

/**
 * Least-squares regression over paired data.
 *
 * Linear fit solves y = m*x + b; quadratic fit solves the 3x3 normal
 * equations for y = b0 + b1*x + b2*x^2. r2 is the squared correlation
 * between observed and predicted y.
 */
export class DefaultRegressionAnalysisService implements RegressionAnalysisService {
    public linear(xs: readonly number[], ys: readonly number[]): RegressionAnalysisResult {
        const validationError = this.validate(xs, ys);

        if (validationError !== null) {
            return { linear: null, quadratic: null, errorMessage: validationError };
        }

        const n = xs.length;
        const sumX = xs.reduce((total, value) => total + value, 0);
        const sumY = ys.reduce((total, value) => total + value, 0);
        const sumXY = xs.reduce((total, value, index) => total + value * (ys[index] as number), 0);
        const sumX2 = xs.reduce((total, value) => total + value * value, 0);
        const sumY2 = ys.reduce((total, value) => total + value * value, 0);

        const denominator = n * sumX2 - sumX * sumX;

        if (Math.abs(denominator) < Number.EPSILON) {
            return {
                linear: null,
                quadratic: null,
                errorMessage: "The x values have no variance, so a regression is not defined.",
            };
        }

        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;

        const correlationDenominator = Math.sqrt(denominator * (n * sumY2 - sumY * sumY));

        let r = 1;
        let r2 = 1;

        if (Math.abs(correlationDenominator) > Number.EPSILON) {
            r = (n * sumXY - sumX * sumY) / correlationDenominator;
            r2 = r * r;
        }

        const linear: LinearRegressionResult = { slope, intercept, r, r2 };

        return { linear, quadratic: null, errorMessage: null };
    }

    public quadratic(xs: readonly number[], ys: readonly number[]): RegressionAnalysisResult {
        const validationError = this.validate(xs, ys);

        if (validationError !== null) {
            return { linear: null, quadratic: null, errorMessage: validationError };
        }

        const n = xs.length;
        const sumX = xs.reduce((total, value) => total + value, 0);
        const sumX2 = xs.reduce((total, value) => total + value * value, 0);
        const sumX3 = xs.reduce((total, value) => total + value ** 3, 0);
        const sumX4 = xs.reduce((total, value) => total + value ** 4, 0);
        const sumY = ys.reduce((total, value) => total + value, 0);
        const sumXY = xs.reduce((total, value, index) => total + value * (ys[index] as number), 0);
        const sumX2Y = xs.reduce(
            (total, value, index) => total + value * value * (ys[index] as number),
            0,
        );

        const matrix = [
            [n, sumX, sumX2],
            [sumX, sumX2, sumX3],
            [sumX2, sumX3, sumX4],
        ];
        const constants = [sumY, sumXY, sumX2Y];

        const coefficients = solveLinearSystem3x3(matrix, constants);

        if (coefficients === null) {
            return {
                linear: null,
                quadratic: null,
                errorMessage: "The quadratic fit is singular and cannot be computed.",
            };
        }

        const b0 = coefficients[0]!;
        const b1 = coefficients[1]!;
        const b2 = coefficients[2]!;
        const predicted = xs.map((value) => b0 + b1 * value + b2 * value * value);
        const r2 = squaredCorrelation(ys, predicted);

        const quadratic: QuadraticRegressionResult = { a: b2, b: b1, c: b0, r2 };

        return { linear: null, quadratic, errorMessage: null };
    }

    private validate(xs: readonly number[], ys: readonly number[]): string | null {
        if (xs.length < 3 || ys.length < 3) {
            return "Regression needs at least three paired data points.";
        }

        if (xs.length !== ys.length) {
            return "The x and y data must have the same length.";
        }

        return null;
    }
}

function solveLinearSystem3x3(
    matrix: readonly (readonly number[])[],
    constants: readonly number[],
): readonly number[] | null {
    const augmented = matrix.map((row, index) => [...row, constants[index] as number]);

    for (let column = 0; column < 3; column += 1) {
        let pivotRow = column;

        for (let row = column + 1; row < 3; row += 1) {
            if (
                Math.abs((augmented[row] as number[])[column] as number) >
                Math.abs((augmented[pivotRow] as number[])[column] as number)
            ) {
                pivotRow = row;
            }
        }

        const pivot = (augmented[pivotRow] as number[])[column] as number;

        if (Math.abs(pivot) < Number.EPSILON) {
            return null;
        }

        [augmented[column], augmented[pivotRow]] = [
            augmented[pivotRow] as number[],
            augmented[column] as number[],
        ];

        for (let row = 0; row < 3; row += 1) {
            if (row === column) {
                continue;
            }

            const factor = ((augmented[row] as number[])[column] as number) / pivot;

            for (let col = column; col < 4; col += 1) {
                (augmented[row] as number[])[col] =
                    (augmented[row] as number[])[col]! -
                    factor * (augmented[column] as number[])[col]!;
            }
        }

        for (let col = column; col < 4; col += 1) {
            (augmented[column] as number[])[col] = (augmented[column] as number[])[col]! / pivot;
        }
    }

    return [augmented[0]?.[3] as number, augmented[1]?.[3] as number, augmented[2]?.[3] as number];
}

function squaredCorrelation(observed: readonly number[], predicted: readonly number[]): number {
    const n = observed.length;
    const meanObserved = observed.reduce((total, value) => total + value, 0) / n;
    const meanPredicted = predicted.reduce((total, value) => total + value, 0) / n;

    let covariance = 0;
    let varianceObserved = 0;
    let variancePredicted = 0;

    for (let index = 0; index < n; index += 1) {
        const observedDeviation = (observed[index] as number) - meanObserved;
        const predictedDeviation = (predicted[index] as number) - meanPredicted;
        covariance += observedDeviation * predictedDeviation;
        varianceObserved += observedDeviation * observedDeviation;
        variancePredicted += predictedDeviation * predictedDeviation;
    }

    const denominator = Math.sqrt(varianceObserved * variancePredicted);

    if (denominator < Number.EPSILON) {
        return 0;
    }

    const correlation = covariance / denominator;

    return correlation * correlation;
}
