import type { MathJsInstance } from "mathjs";
import { AngleMode } from "../../domain/model/AngleMode";
import type { CalculusExpressionEvaluator } from "../../application/calculus/CalculusExpressionEvaluator";
import type { MathJsInstanceProvider } from "../mathjs/MathJsInstanceProvider";

type UnaryMathFunction = (value: unknown) => unknown;

export class MathJsCalculusExpressionEvaluator implements CalculusExpressionEvaluator {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public evaluate(
        expressionText: string,
        variableName: string,
        value: number,
        angleMode: AngleMode,
    ): number {
        const math = this.instanceProvider.getInstance();
        const scope = this.buildScope(math, variableName, value, angleMode);

        try {
            const result = math.evaluate(expressionText, scope);
            return this.convertToFiniteNumber(math, result);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Expression evaluation failed: ${message}`);
        }
    }

    private buildScope(
        math: MathJsInstance,
        variableName: string,
        value: number,
        angleMode: AngleMode,
    ): Record<string, unknown> {
        const radiansPerUnit =
            angleMode === AngleMode.DEG
                ? math.divide(math.pi, 180)
                : angleMode === AngleMode.GON
                  ? math.divide(math.pi, 200)
                  : math.number(1);

        const toRadians = (input: unknown): unknown =>
            math.multiply(input as never, radiansPerUnit as never);
        const fromRadians = (input: unknown): unknown =>
            math.divide(input as never, radiansPerUnit as never);

        const wrapForwardTrig =
            (fn: UnaryMathFunction) =>
            (input: unknown): unknown =>
                fn(toRadians(input));
        const wrapInverseTrig =
            (fn: UnaryMathFunction) =>
            (input: unknown): unknown =>
                fromRadians(fn(input));

        return {
            [variableName]: math.number(value),
            sin: wrapForwardTrig((v) => math.sin(v as never)),
            cos: wrapForwardTrig((v) => math.cos(v as never)),
            tan: wrapForwardTrig((v) => math.tan(v as never)),
            asin: wrapInverseTrig((v) => math.asin(v as never)),
            acos: wrapInverseTrig((v) => math.acos(v as never)),
            atan: wrapInverseTrig((v) => math.atan(v as never)),
        };
    }

    private convertToFiniteNumber(math: MathJsInstance, result: unknown): number {
        const numericResult = math.number(result as never);

        if (!Number.isFinite(numericResult)) {
            throw new Error("Expression evaluation produced a non finite value.");
        }

        return numericResult;
    }
}
