import type { MatrixValue } from "../model/MatrixValue";

export interface MatrixOperationResult {
    readonly value: MatrixValue | null;
    readonly errorMessage: string | null;
}

export interface DeterminantResult {
    readonly value: number | null;
    readonly errorMessage: string | null;
}

/**
 * Matrix arithmetic through the math.js instance.
 *
 * The matrix app depends on this gateway so math.js stays confined to the
 * infrastructure layer. Errors carry a clear message instead of throwing.
 */
export interface MatrixOperationsGateway {
    add(a: MatrixValue, b: MatrixValue): MatrixOperationResult;
    subtract(a: MatrixValue, b: MatrixValue): MatrixOperationResult;
    multiply(a: MatrixValue, b: MatrixValue): MatrixOperationResult;
    transpose(matrix: MatrixValue): MatrixValue;
    determinant(matrix: MatrixValue): DeterminantResult;
    inverse(matrix: MatrixValue): MatrixOperationResult;
    identity(size: number): MatrixValue;
}
