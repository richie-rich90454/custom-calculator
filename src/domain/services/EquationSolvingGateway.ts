/**
 * Gateway that evaluates a single-variable expression and its numeric
 * derivative at a point. The Newton-Raphson solver depends on this interface
 * so the math.js dependency stays inside the infrastructure layer.
 */
export interface EquationSolvingGateway {
    evaluate(expression: string, variableName: string, value: number): number;
    numericDerivative(expression: string, variableName: string, value: number): number;
}
