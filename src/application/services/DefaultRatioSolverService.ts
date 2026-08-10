import type { RatioSolveResult, RatioSolverService } from "./RatioSolverService";

/**
 * Solves a:b = c:d for the single missing term.
 *
 * The missing term is computed by cross multiplication; zero denominators
 * and non-positive ratios are rejected.
 */
export class DefaultRatioSolverService implements RatioSolverService {
    public solve(
        a: number | null,
        b: number | null,
        c: number | null,
        d: number | null,
    ): RatioSolveResult {
        const terms: (number | null)[] = [a, b, c, d];
        const missingCount = terms.filter((term) => term === null).length;

        if (missingCount !== 1) {
            return {
                value: null,
                errorMessage: "Exactly one term of the ratio must be left empty.",
            };
        }

        if (terms.some((term) => term !== null && term <= 0)) {
            return {
                value: null,
                errorMessage: "Ratio terms must be positive numbers.",
            };
        }

        let value: number;

        if (a === null) {
            value = ((c as number) * (b as number)) / (d as number);
        } else if (b === null) {
            value = ((d as number) * (a as number)) / (c as number);
        } else if (c === null) {
            value = ((a as number) * (d as number)) / (b as number);
        } else {
            value = ((b as number) * (c as number)) / (a as number);
        }

        if (!Number.isFinite(value)) {
            return {
                value: null,
                errorMessage: "The missing ratio term could not be computed.",
            };
        }

        return { value, errorMessage: null };
    }
}
