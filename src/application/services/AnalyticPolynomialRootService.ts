import type {
    PolynomialRoot,
    PolynomialRootResult,
    PolynomialRootService,
} from "./PolynomialRootService";

const MAX_ITERATIONS = 200;
const CONVERGENCE_EPSILON = 1e-10;
const VERIFICATION_EPSILON = 1e-6;

/**
 * Polynomial root finder with exact quadratic roots and a robust numeric
 * method for degrees three and four.
 *
 * Degrees three and four use Durand-Kerner / Weierstrass iteration from a
 * spread of complex seeds, then polish each root with Newton's method using
 * complex arithmetic. Every root is verified by re-substitution; a root that
 * fails verification produces a clear error instead of a fake value.
 */
export class AnalyticPolynomialRootService implements PolynomialRootService {
    public solve(coefficients: readonly number[]): PolynomialRootResult {
        if (coefficients.length === 0) {
            return { roots: [], errorMessage: "Enter the polynomial coefficients." };
        }

        const leadingCoefficient = coefficients[0];

        if (leadingCoefficient === 0 || leadingCoefficient === undefined) {
            return { roots: [], errorMessage: "The leading coefficient must not be zero." };
        }

        const degree = coefficients.length - 1;

        if (degree < 2) {
            return {
                roots: [],
                errorMessage: "Polynomial solving needs a degree of at least two.",
            };
        }

        if (degree === 2) {
            return this.solveQuadratic(coefficients);
        }

        if (degree > 4) {
            return {
                roots: [],
                errorMessage: "Polynomial solving supports degrees two through four.",
            };
        }

        return this.solveNumeric(coefficients);
    }

    private solveQuadratic(coefficients: readonly number[]): PolynomialRootResult {
        const [a, b, c] = [coefficients[0]!, coefficients[1]!, coefficients[2]!];
        const discriminant = b * b - 4 * a * c;

        if (discriminant >= 0) {
            const root = Math.sqrt(discriminant);
            const rootA = (-b + root) / (2 * a);
            const rootB = (-b - root) / (2 * a);

            return {
                roots: [
                    { re: rootA, im: 0 },
                    { re: rootB, im: 0 },
                ],
                errorMessage: null,
            };
        }

        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);

        return {
            roots: [
                { re: realPart, im: imaginaryPart },
                { re: realPart, im: -imaginaryPart },
            ],
            errorMessage: null,
        };
    }

    private solveNumeric(coefficients: readonly number[]): PolynomialRootResult {
        const roots = runDurandKerner(coefficients);

        const polished = roots.map((root) => polishRoot(coefficients, root));
        const verified = polished.every((root) => verifyRoot(coefficients, root));

        if (!verified) {
            return {
                roots: [],
                errorMessage: "The solver could not verify the polynomial roots.",
            };
        }

        return { roots: polished, errorMessage: null };
    }
}

function runDurandKerner(coefficients: readonly number[]): PolynomialRoot[] {
    const degree = coefficients.length - 1;
    const roots: PolynomialRoot[] = [];

    for (let index = 0; index < degree; index += 1) {
        const angle = (2 * Math.PI * (index + 0.25)) / degree;
        roots.push({ re: 0.4 * Math.cos(angle), im: 0.4 * Math.sin(angle) });
    }

    let previous = roots.map((root) => ({ ...root }));

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
        let converged = true;

        for (let index = 0; index < roots.length; index += 1) {
            const current = previous[index]!;
            const others = previous.filter((_, otherIndex) => otherIndex !== index);

            const denominator = others.reduce(
                (product, other) => complexMultiply(product, complexSubtract(current, other)),
                { re: 1, im: 0 },
            );

            const correction = complexDivide(
                evaluatePolynomial(coefficients, current),
                denominator,
            );
            roots[index] = complexSubtract(current, correction);

            if (complexMagnitude(correction) > CONVERGENCE_EPSILON) {
                converged = false;
            }
        }

        previous = roots.map((root) => ({ ...root }));

        if (converged) {
            break;
        }
    }

    return roots;
}

function polishRoot(coefficients: readonly number[], initial: PolynomialRoot): PolynomialRoot {
    let root = { ...initial };

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
        const value = evaluatePolynomial(coefficients, root);
        const derivative = evaluateDerivative(coefficients, root);

        if (complexMagnitude(derivative) < CONVERGENCE_EPSILON) {
            break;
        }

        const correction = complexDivide(value, derivative);
        root = complexSubtract(root, correction);

        if (complexMagnitude(correction) < CONVERGENCE_EPSILON) {
            break;
        }
    }

    return root;
}

function verifyRoot(coefficients: readonly number[], root: PolynomialRoot): boolean {
    return complexMagnitude(evaluatePolynomial(coefficients, root)) < VERIFICATION_EPSILON;
}

function evaluatePolynomial(coefficients: readonly number[], x: PolynomialRoot): PolynomialRoot {
    let result = { re: 0, im: 0 };

    for (const coefficient of coefficients) {
        result = complexAdd(complexMultiply(result, x), { re: coefficient, im: 0 });
    }

    return result;
}

function evaluateDerivative(coefficients: readonly number[], x: PolynomialRoot): PolynomialRoot {
    const degree = coefficients.length - 1;
    let result = { re: 0, im: 0 };

    for (let index = 0; index < degree; index += 1) {
        const coefficient = coefficients[index]! * (degree - index);
        result = complexAdd(complexMultiply(result, x), { re: coefficient, im: 0 });
    }

    return result;
}

function complexAdd(a: PolynomialRoot, b: PolynomialRoot): PolynomialRoot {
    return { re: a.re + b.re, im: a.im + b.im };
}

function complexSubtract(a: PolynomialRoot, b: PolynomialRoot): PolynomialRoot {
    return { re: a.re - b.re, im: a.im - b.im };
}

function complexMultiply(a: PolynomialRoot, b: PolynomialRoot): PolynomialRoot {
    return {
        re: a.re * b.re - a.im * b.im,
        im: a.re * b.im + a.im * b.re,
    };
}

function complexDivide(a: PolynomialRoot, b: PolynomialRoot): PolynomialRoot {
    const denominator = b.re * b.re + b.im * b.im;

    return {
        re: (a.re * b.re + a.im * b.im) / denominator,
        im: (a.im * b.re - a.re * b.im) / denominator,
    };
}

function complexMagnitude(z: PolynomialRoot): number {
    return Math.hypot(z.re, z.im);
}
