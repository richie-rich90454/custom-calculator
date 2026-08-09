import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type { EquationSolvingGateway } from "../../domain/services/EquationSolvingGateway";

const DERIVATIVE_STEP_RELATIVE = 1e-6;

/**
 * Equation solving gateway backed by math.js.
 *
 * The expression is parsed and compiled once per evaluation; the solver then
 * evaluates the compiled node at many points through a numeric derivative.
 */
export class NewtonRaphsonEquationSolvingGateway implements EquationSolvingGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public evaluate(expression: string, variableName: string, value: number): number {
        const math = this.instanceProvider.getInstance();
        const scope = this.buildScope(variableName, value);

        let node;
        try {
            node = math.parse(expression);
        } catch {
            return Number.NaN;
        }

        try {
            return Number(node.compile().evaluate(scope));
        } catch {
            return Number.NaN;
        }
    }

    public numericDerivative(expression: string, variableName: string, value: number): number {
        const step = Math.max(Math.abs(value), 1) * DERIVATIVE_STEP_RELATIVE;
        const forward = this.evaluate(expression, variableName, value + step);
        const backward = this.evaluate(expression, variableName, value - step);

        if (!Number.isFinite(forward) || !Number.isFinite(backward)) {
            return Number.NaN;
        }

        return (forward - backward) / (2 * step);
    }

    private buildScope(variableName: string, value: number): Record<string, unknown> {
        return { [variableName]: value };
    }
}
