import type {
    SimultaneousEquationResult,
    SimultaneousEquationService,
} from "./SimultaneousEquationService";

const PIVOT_EPSILON = 1e-12;

/**
 * Simultaneous linear equations solved by Gaussian elimination with partial
 * pivoting for two and three unknowns.
 */
export class GaussianEliminationSimultaneousEquationService implements SimultaneousEquationService {
    public solve(
        matrix: readonly (readonly number[])[],
        constants: readonly number[],
    ): SimultaneousEquationResult {
        const size = matrix.length;

        if (size < 2 || size > 3) {
            return {
                solution: null,
                errorMessage: "Simultaneous equations need two or three unknowns.",
            };
        }

        if (constants.length !== size) {
            return {
                solution: null,
                errorMessage: "The number of constants must match the number of equations.",
            };
        }

        for (const row of matrix) {
            if (row.length !== size) {
                return {
                    solution: null,
                    errorMessage: "Every equation must have the same number of coefficients.",
                };
            }
        }

        const augmented = matrix.map((row, index) => [...row, constants[index]!]);

        for (let column = 0; column < size; column += 1) {
            let pivotRow = column;

            for (let row = column + 1; row < size; row += 1) {
                if (Math.abs(augmented[row]![column]!) > Math.abs(augmented[pivotRow]![column]!)) {
                    pivotRow = row;
                }
            }

            if (Math.abs(augmented[pivotRow]![column]!) < PIVOT_EPSILON) {
                return {
                    solution: null,
                    errorMessage:
                        "The system is singular or under-determined and has no unique solution.",
                };
            }

            if (pivotRow !== column) {
                [augmented[column], augmented[pivotRow]] = [
                    augmented[pivotRow]!,
                    augmented[column]!,
                ];
            }

            for (let row = 0; row < size; row += 1) {
                if (row === column) {
                    continue;
                }

                const factor = augmented[row]![column]! / augmented[column]![column]!;

                for (let col = column; col <= size; col += 1) {
                    augmented[row]![col] =
                        augmented[row]![col]! - factor * augmented[column]![col]!;
                }
            }
        }

        const solution: number[] = [];

        for (let row = 0; row < size; row += 1) {
            solution.push(augmented[row]![size]! / augmented[row]![row]!);
        }

        return { solution, errorMessage: null };
    }
}
