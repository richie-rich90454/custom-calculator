import type { Matrix, MathJsInstance } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type {
    DeterminantResult,
    MatrixOperationResult,
    MatrixOperationsGateway,
} from "../../domain/services/MatrixOperationsGateway";
import type { MatrixValue } from "../../domain/model/MatrixValue";

/**
 * Matrix arithmetic gateway backed by the math.js instance.
 *
 * Dimension and shape checks run before delegation so mismatches surface as
 * clear error messages rather than a thrown exception.
 */
export class MathJsMatrixOperationsGateway implements MatrixOperationsGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public add(a: MatrixValue, b: MatrixValue): MatrixOperationResult {
        return this.runBinary(a, b, (math, mathA, mathB) => math.add(mathA, mathB));
    }

    public subtract(a: MatrixValue, b: MatrixValue): MatrixOperationResult {
        return this.runBinary(a, b, (math, mathA, mathB) => math.subtract(mathA, mathB));
    }

    public multiply(a: MatrixValue, b: MatrixValue): MatrixOperationResult {
        const aColumns = a[0]?.length ?? 0;
        const bRows = b.length;

        if (aColumns !== bRows) {
            return {
                value: null,
                errorMessage: "Matrix dimensions do not match for multiplication.",
            };
        }

        return this.runBinary(a, b, (math, mathA, mathB) => math.multiply(mathA, mathB));
    }

    public transpose(matrix: MatrixValue): MatrixValue {
        return this.toDomain(this.math().transpose(this.toMath(matrix)));
    }

    public determinant(matrix: MatrixValue): DeterminantResult {
        if (!isSquare(matrix)) {
            return { value: null, errorMessage: "Determinant requires a square matrix." };
        }

        return { value: Number(this.math().det(this.toMath(matrix))), errorMessage: null };
    }

    public inverse(matrix: MatrixValue): MatrixOperationResult {
        if (!isSquare(matrix)) {
            return { value: null, errorMessage: "Inverse requires a square matrix." };
        }

        const math = this.math();

        try {
            return { value: this.toDomain(math.inv(this.toMath(matrix))), errorMessage: null };
        } catch {
            return { value: null, errorMessage: "This matrix is singular and has no inverse." };
        }
    }

    public identity(size: number): MatrixValue {
        return this.toDomain(this.math().identity(size));
    }

    private runBinary(
        a: MatrixValue,
        b: MatrixValue,
        operation: (math: MathJsInstance, mathA: Matrix, mathB: Matrix) => unknown,
    ): MatrixOperationResult {
        if (a.length === 0 || b.length === 0) {
            return { value: null, errorMessage: "Both matrices must have at least one row." };
        }

        if (!sameShape(a, b)) {
            return {
                value: null,
                errorMessage: "Matrix dimensions do not match for this operation.",
            };
        }

        const math = this.math();

        return {
            value: this.toDomain(operation(math, this.toMath(a), this.toMath(b))),
            errorMessage: null,
        };
    }

    private math(): MathJsInstance {
        return this.instanceProvider.getInstance();
    }

    private toMath(matrix: MatrixValue): Matrix {
        return this.math().matrix(matrix.map((row) => [...row]));
    }

    private toDomain(value: unknown): MatrixValue {
        const raw = (value as { toArray(): unknown }).toArray() as MatrixValue;

        return raw.map((row) => row.map((cell) => Number(cell)));
    }
}

function sameShape(a: MatrixValue, b: MatrixValue): boolean {
    return (
        a.length === b.length &&
        a.every((row, index) => row.length === (b[index] as number[]).length)
    );
}

function isSquare(matrix: MatrixValue): boolean {
    return matrix.length > 0 && matrix.every((row) => row.length === matrix.length);
}
