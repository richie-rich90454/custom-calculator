import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import type { SymbolicIntegrationService } from "../../application/calculus/SymbolicIntegrationService";
import type { MathJsInstanceProvider } from "../mathjs/MathJsInstanceProvider";

type MathJsNode = {
    readonly type: string;
    readonly name?: string;
    readonly value?: unknown;
    readonly op?: string;
    readonly fn?: { readonly name: string };
    readonly args?: readonly MathJsNode[];
};

export class DefaultSymbolicIntegrationService implements SymbolicIntegrationService {
    private static readonly UNSUPPORTED_INTEGRATION_MESSAGE =
        "Symbolic integration is not supported for this expression.";

    public constructor(
        private readonly instanceProvider: MathJsInstanceProvider,
        private readonly resultFormattingService: ResultFormattingService,
    ) {}

    public integrateSymbolically(expressionText: string, variableName: string): string {
        const math = this.instanceProvider.getInstance();

        let parsedNode: MathJsNode;

        try {
            parsedNode = math.parse(expressionText) as MathJsNode;
        } catch (error) {
            throw this.mapSymbolicError(error);
        }

        try {
            const integralNode = this.integrateNode(parsedNode, variableName);
            const simplifiedNode = this.trySimplify(integralNode);
            const formattedText = math.format(simplifiedNode);

            return this.resultFormattingService.normalizeResultText(formattedText);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === DefaultSymbolicIntegrationService.UNSUPPORTED_INTEGRATION_MESSAGE
            ) {
                throw new CalculationError(
                    CalculationErrorCode.UNKNOWN_FUNCTION,
                    DefaultSymbolicIntegrationService.UNSUPPORTED_INTEGRATION_MESSAGE,
                );
            }

            throw this.mapSymbolicError(error);
        }
    }

    private integrateNode(node: MathJsNode, variableName: string): MathJsNode {
        const unwrappedNode = this.unwrapParenthesis(node);

        switch (unwrappedNode.type) {
            case "ConstantNode":
                return this.buildMultiply(unwrappedNode, this.buildSymbol(variableName));
            case "SymbolNode":
                if (unwrappedNode.name === variableName) {
                    return this.buildPowerResult(unwrappedNode, 1);
                }
                return this.buildMultiply(unwrappedNode, this.buildSymbol(variableName));
            case "OperatorNode":
                return this.integrateOperatorNode(unwrappedNode, variableName);
            case "FunctionNode":
                return this.integrateFunctionNode(unwrappedNode, variableName);
            default:
                throw this.createUnsupportedError();
        }
    }

    private integrateOperatorNode(node: MathJsNode, variableName: string): MathJsNode {
        const args = node.args!;

        if (node.op === "+") {
            return args.reduce(
                (accumulator, argument) =>
                    this.buildAdd(accumulator, this.integrateNode(argument, variableName)),
                this.buildZero(),
            );
        }

        if (node.op === "-" && args.length === 2) {
            return this.buildSubtract(
                this.integrateNode(args[0]!, variableName),
                this.integrateNode(args[1]!, variableName),
            );
        }

        if (node.op === "-" && args.length === 1) {
            return this.buildUnaryMinus(this.integrateNode(args[0]!, variableName));
        }

        if (node.op === "*") {
            return this.integrateProductNode(node, variableName);
        }

        if (node.op === "/") {
            return this.integrateQuotientNode(node, variableName);
        }

        if (node.op === "^") {
            return this.integratePowerNode(node, variableName);
        }

        throw this.createUnsupportedError();
    }

    private integrateProductNode(node: MathJsNode, variableName: string): MathJsNode {
        const args = node.args!;

        if (!this.containsSymbol(args[0]!, variableName)) {
            return this.buildMultiply(args[0]!, this.integrateNode(args[1]!, variableName));
        }

        if (!this.containsSymbol(args[1]!, variableName)) {
            return this.buildMultiply(this.integrateNode(args[0]!, variableName), args[1]!);
        }

        throw this.createUnsupportedError();
    }

    private integrateQuotientNode(node: MathJsNode, variableName: string): MathJsNode {
        const numerator = node.args![0]!;
        const denominator = node.args![1]!;

        if (!this.containsSymbol(numerator, variableName)) {
            if (!this.containsSymbol(denominator, variableName)) {
                return this.buildMultiply(
                    this.buildDivide(numerator, denominator),
                    this.buildSymbol(variableName),
                );
            }

            if (this.isSymbol(denominator, variableName)) {
                return this.buildMultiply(
                    numerator,
                    this.buildLogarithm(this.buildSymbol(variableName)),
                );
            }

            const denominatorPower = this.asPowerOfVariable(denominator, variableName);

            if (denominatorPower !== null) {
                return this.buildMultiply(
                    numerator,
                    this.buildPowerResult(denominatorPower.base, denominatorPower.exponent),
                );
            }
        }

        throw this.createUnsupportedError();
    }

    private integratePowerNode(node: MathJsNode, variableName: string): MathJsNode {
        const base = node.args![0]!;
        const exponent = node.args![1]!;

        if (this.isSymbol(base, variableName) && exponent.type === "ConstantNode") {
            return this.buildPowerResult(base, Number(exponent.value));
        }

        throw this.createUnsupportedError();
    }

    private integrateFunctionNode(node: MathJsNode, variableName: string): MathJsNode {
        const functionName = node.fn!.name;
        const args = node.args!;

        if (!args.some((argument) => this.containsSymbol(argument, variableName))) {
            return this.buildMultiply(node, this.buildSymbol(variableName));
        }

        const variableArgument = this.findVariableArgument(args, variableName);

        if (variableArgument === null) {
            throw this.createUnsupportedError();
        }

        switch (functionName) {
            case "sin":
                return this.buildUnaryMinus(this.buildFunction("cos", variableArgument));
            case "cos":
                return this.buildFunction("sin", variableArgument);
            case "exp":
                return this.buildFunction("exp", variableArgument);
            case "log":
            case "ln":
                return this.buildSubtract(
                    this.buildMultiply(
                        variableArgument,
                        this.buildFunction("log", variableArgument),
                    ),
                    variableArgument,
                );
            case "sqrt":
                return this.buildPowerResult(node, 0.5);
            default:
                throw this.createUnsupportedError();
        }
    }

    private findVariableArgument(
        args: readonly MathJsNode[],
        variableName: string,
    ): MathJsNode | null {
        if (args.length !== 1) {
            return null;
        }

        return this.isSymbol(args[0]!, variableName) ? args[0]! : null;
    }

    private asPowerOfVariable(
        node: MathJsNode,
        variableName: string,
    ): { readonly base: MathJsNode; readonly exponent: number } | null {
        if (
            node.type === "OperatorNode" &&
            node.op === "^" &&
            this.isSymbol(node.args![0]!, variableName) &&
            node.args![1]!.type === "ConstantNode"
        ) {
            return {
                base: node.args![0]!,
                exponent: Number(node.args![1]!.value),
            };
        }

        return null;
    }

    private buildPowerResult(base: MathJsNode, exponent: number): MathJsNode {
        const math = this.instanceProvider.getInstance();

        return new math.OperatorNode("/", "divide", [
            new math.OperatorNode("^", "pow", [base as never, new math.ConstantNode(exponent + 1)]),
            new math.ConstantNode(exponent + 1),
        ]) as unknown as MathJsNode;
    }

    private buildAdd(left: MathJsNode, right: MathJsNode): MathJsNode {
        return this.buildOperator("+", "add", [left, right]);
    }

    private buildSubtract(left: MathJsNode, right: MathJsNode): MathJsNode {
        return this.buildOperator("-", "subtract", [left, right]);
    }

    private buildMultiply(left: MathJsNode, right: MathJsNode): MathJsNode {
        return this.buildOperator("*", "multiply", [left, right]);
    }

    private buildDivide(left: MathJsNode, right: MathJsNode): MathJsNode {
        return this.buildOperator("/", "divide", [left, right]);
    }

    private buildUnaryMinus(argument: MathJsNode): MathJsNode {
        return this.buildOperator("-", "unaryMinus", [argument]);
    }

    private buildFunction(name: string, argument: MathJsNode): MathJsNode {
        const math = this.instanceProvider.getInstance();

        return new math.FunctionNode(new math.SymbolNode(name), [
            argument as never,
        ]) as unknown as MathJsNode;
    }

    private buildLogarithm(argument: MathJsNode): MathJsNode {
        return this.buildFunction("log", argument);
    }

    private buildSymbol(name: string): MathJsNode {
        const math = this.instanceProvider.getInstance();

        return new math.SymbolNode(name) as MathJsNode;
    }

    private buildZero(): MathJsNode {
        const math = this.instanceProvider.getInstance();

        return new math.ConstantNode(0) as MathJsNode;
    }

    private buildOperator(op: string, fn: string, args: readonly MathJsNode[]): MathJsNode {
        const math = this.instanceProvider.getInstance();

        return new math.OperatorNode(
            op as never,
            fn as never,
            args as never,
        ) as unknown as MathJsNode;
    }

    private unwrapParenthesis(node: MathJsNode): MathJsNode {
        let current = node;

        while (current.type === "ParenthesisNode") {
            current = (current as unknown as { content: MathJsNode }).content;
        }

        return current;
    }

    private containsSymbol(node: MathJsNode, variableName: string): boolean {
        const descendants = (
            node as unknown as {
                filter(callback: (child: unknown) => boolean): unknown[];
            }
        ).filter(
            (child) =>
                (child as MathJsNode).type === "SymbolNode" &&
                (child as MathJsNode).name === variableName,
        );

        return descendants.length > 0;
    }

    private isSymbol(node: MathJsNode, name: string): boolean {
        return node.type === "SymbolNode" && node.name === name;
    }

    private trySimplify(node: MathJsNode): MathJsNode {
        try {
            return this.instanceProvider
                .getInstance()
                .simplify(node as never) as unknown as MathJsNode;
        } catch {
            return node;
        }
    }

    private createUnsupportedError(): Error {
        return new Error(DefaultSymbolicIntegrationService.UNSUPPORTED_INTEGRATION_MESSAGE);
    }

    private mapSymbolicError(error: unknown): CalculationError {
        const message = error instanceof Error ? error.message : String(error);

        return new CalculationError(
            CalculationErrorCode.EVALUATION_FAILED,
            `Symbolic integration failed: ${message}`,
        );
    }
}
