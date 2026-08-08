import { CalculusOperationKind } from "./CalculusOperationKind";
import { CalculusBlockDescriptor, LimitDirection } from "./CalculusBlockDescriptor";
import type { CalculusBlockParser } from "./CalculusBlockParser";

export class DefaultCalculusBlockParser implements CalculusBlockParser {
    private static readonly DEFAULT_VARIABLE = "x";

    private static readonly CALCULUS_FUNCTION_PATTERN =
        /^(derivative|diff|numericDerivative|nderivative|integral|integrate|limit|taylor|sum|product)\s*\((.*)\)$/s;

    public parseBlock(expressionText: string): CalculusBlockDescriptor | null {
        const match = DefaultCalculusBlockParser.CALCULUS_FUNCTION_PATTERN.exec(
            expressionText.trim(),
        );

        if (match === null) {
            return null;
        }

        const functionName = match[1]!;
        const argumentsText = match[2]!.trim();

        if (argumentsText.length === 0) {
            return null;
        }

        const operationKind = this.resolveOperationKind(functionName);

        const argumentsList = this.splitTopLevelArguments(argumentsText);

        switch (operationKind) {
            case CalculusOperationKind.DERIVATIVE:
                return this.parseUnaryBlock(CalculusOperationKind.DERIVATIVE, argumentsList);
            case CalculusOperationKind.NUMERIC_DERIVATIVE:
                return this.parseNumericDerivativeBlock(argumentsList);
            case CalculusOperationKind.INTEGRAL:
                return this.parseBoundedBlock(CalculusOperationKind.INTEGRAL, argumentsList);
            case CalculusOperationKind.INTEGRATE:
                return this.parseUnaryBlock(CalculusOperationKind.INTEGRATE, argumentsList);
            case CalculusOperationKind.LIMIT:
                return this.parseLimitBlock(argumentsList);
            case CalculusOperationKind.TAYLOR:
                return this.parseTaylorBlock(argumentsList);
            case CalculusOperationKind.SUM:
                return this.parseBoundedBlock(CalculusOperationKind.SUM, argumentsList);
            case CalculusOperationKind.PRODUCT:
                return this.parseBoundedBlock(CalculusOperationKind.PRODUCT, argumentsList);
        }
    }

    public resolveOperationKind(functionName: string): CalculusOperationKind {
        switch (functionName) {
            case "derivative":
            case "diff":
                return CalculusOperationKind.DERIVATIVE;
            case "numericDerivative":
            case "nderivative":
                return CalculusOperationKind.NUMERIC_DERIVATIVE;
            case "integral":
                return CalculusOperationKind.INTEGRAL;
            case "integrate":
                return CalculusOperationKind.INTEGRATE;
            case "limit":
                return CalculusOperationKind.LIMIT;
            case "taylor":
                return CalculusOperationKind.TAYLOR;
            case "sum":
                return CalculusOperationKind.SUM;
            case "product":
                return CalculusOperationKind.PRODUCT;
            default:
                throw new Error(`Unknown calculus function: ${functionName}.`);
        }
    }

    private parseUnaryBlock(
        operationKind: CalculusOperationKind,
        argumentsList: readonly string[],
    ): CalculusBlockDescriptor {
        const expressionText = argumentsList[0]!.trim();
        const variableName = (argumentsList[1] ?? "").trim();

        return CalculusBlockDescriptor.createUnary(
            operationKind,
            expressionText,
            variableName.length > 0 ? variableName : DefaultCalculusBlockParser.DEFAULT_VARIABLE,
        );
    }

    private parseNumericDerivativeBlock(argumentsList: readonly string[]): CalculusBlockDescriptor {
        const expressionText = argumentsList[0]!.trim();
        const variableName = (argumentsList[1] ?? "").trim();
        const pointText = (argumentsList[2] ?? "").trim();
        const point = this.parseNumberArgument(pointText, "point");

        if (point === null) {
            throw new Error("Invalid numeric derivative: the point must be a number.");
        }

        return CalculusBlockDescriptor.createLimit(
            CalculusOperationKind.NUMERIC_DERIVATIVE,
            expressionText,
            variableName.length > 0 ? variableName : DefaultCalculusBlockParser.DEFAULT_VARIABLE,
            point,
            LimitDirection.BOTH,
        );
    }

    private parseBoundedBlock(
        operationKind: CalculusOperationKind,
        argumentsList: readonly string[],
    ): CalculusBlockDescriptor {
        const expressionText = argumentsList[0]!.trim();
        const variableName = (argumentsList[1] ?? "").trim();
        const lowerBoundText = (argumentsList[2] ?? "").trim();
        const upperBoundText = (argumentsList[3] ?? "").trim();
        const lowerBound = this.parseNumberArgument(lowerBoundText, "lower bound");
        const upperBound = this.parseNumberArgument(upperBoundText, "upper bound");

        if (lowerBound === null || upperBound === null) {
            throw new Error("Invalid bounds: the lower and upper bounds must be numbers.");
        }

        return CalculusBlockDescriptor.createBounded(
            operationKind,
            expressionText,
            variableName.length > 0 ? variableName : DefaultCalculusBlockParser.DEFAULT_VARIABLE,
            lowerBound,
            upperBound,
        );
    }

    private parseLimitBlock(argumentsList: readonly string[]): CalculusBlockDescriptor {
        const expressionText = argumentsList[0]!.trim();
        const variableName = (argumentsList[1] ?? "").trim();
        const targetText = (argumentsList[2] ?? "").trim();
        const directionText = (argumentsList[3] ?? "").trim().toLowerCase();
        const target = this.parseNumberArgument(targetText, "limit target");

        if (target === null) {
            throw new Error("Invalid limit: the target must be a number.");
        }

        const direction = this.resolveLimitDirection(directionText);

        return CalculusBlockDescriptor.createLimit(
            CalculusOperationKind.LIMIT,
            expressionText,
            variableName.length > 0 ? variableName : DefaultCalculusBlockParser.DEFAULT_VARIABLE,
            target,
            direction,
        );
    }

    private parseTaylorBlock(argumentsList: readonly string[]): CalculusBlockDescriptor {
        const expressionText = argumentsList[0]!.trim();
        const variableName = (argumentsList[1] ?? "").trim();
        const centerText = (argumentsList[2] ?? "").trim();
        const orderText = (argumentsList[3] ?? "").trim();
        const center = this.parseNumberArgument(centerText, "center");
        const order = this.parseNumberArgument(orderText, "order");

        if (center === null) {
            throw new Error("Invalid Taylor series: the center must be a number.");
        }

        if (order === null || !Number.isInteger(order)) {
            throw new Error("Invalid Taylor series: the order must be an integer.");
        }

        return CalculusBlockDescriptor.createTaylor(
            expressionText,
            variableName.length > 0 ? variableName : DefaultCalculusBlockParser.DEFAULT_VARIABLE,
            center,
            order,
        );
    }

    private parseNumberArgument(argumentText: string, argumentName: string): number | null {
        if (argumentText.length === 0) {
            return null;
        }

        const parsedValue = Number(argumentText);

        if (!Number.isFinite(parsedValue)) {
            throw new Error(`Invalid ${argumentName}: '${argumentText}' is not a finite number.`);
        }

        return parsedValue;
    }

    private resolveLimitDirection(directionText: string): LimitDirection {
        if (directionText.length === 0) {
            return LimitDirection.BOTH;
        }

        if (directionText === "left") {
            return LimitDirection.LEFT;
        }

        if (directionText === "right") {
            return LimitDirection.RIGHT;
        }

        throw new Error("Invalid limit: direction must be left or right.");
    }

    private splitTopLevelArguments(argumentsText: string): string[] {
        const parts: string[] = [];
        let depth = 0;
        let currentPart = "";

        for (const character of argumentsText) {
            if (character === "(") {
                depth += 1;
            } else if (character === ")") {
                depth -= 1;
            }

            if (character === "," && depth === 0) {
                parts.push(currentPart);
                currentPart = "";
                continue;
            }

            currentPart += character;
        }

        parts.push(currentPart);

        return parts;
    }
}
