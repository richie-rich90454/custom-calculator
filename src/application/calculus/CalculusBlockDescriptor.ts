import { CalculusOperationKind } from "./CalculusOperationKind";

export enum LimitDirection {
    BOTH = "BOTH",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export class CalculusBlockDescriptor {
    public constructor(
        public readonly operationKind: CalculusOperationKind,
        public readonly innerExpressionText: string,
        public readonly variableName: string,
        public readonly lowerBound: number | null,
        public readonly upperBound: number | null,
        public readonly limitTarget: number | null,
        public readonly limitDirection: LimitDirection,
        public readonly center: number | null,
        public readonly order: number | null,
    ) {}

    public static createUnary(
        operationKind: CalculusOperationKind,
        innerExpressionText: string,
        variableName: string,
    ): CalculusBlockDescriptor {
        return new CalculusBlockDescriptor(
            operationKind,
            innerExpressionText,
            variableName,
            null,
            null,
            null,
            LimitDirection.BOTH,
            null,
            null,
        );
    }

    public static createBounded(
        operationKind: CalculusOperationKind,
        innerExpressionText: string,
        variableName: string,
        lowerBound: number,
        upperBound: number,
    ): CalculusBlockDescriptor {
        return new CalculusBlockDescriptor(
            operationKind,
            innerExpressionText,
            variableName,
            lowerBound,
            upperBound,
            null,
            LimitDirection.BOTH,
            null,
            null,
        );
    }

    public static createLimit(
        operationKind: CalculusOperationKind,
        innerExpressionText: string,
        variableName: string,
        limitTarget: number,
        limitDirection: LimitDirection,
    ): CalculusBlockDescriptor {
        return new CalculusBlockDescriptor(
            operationKind,
            innerExpressionText,
            variableName,
            null,
            null,
            limitTarget,
            limitDirection,
            null,
            null,
        );
    }

    public static createTaylor(
        innerExpressionText: string,
        variableName: string,
        center: number,
        order: number,
    ): CalculusBlockDescriptor {
        return new CalculusBlockDescriptor(
            CalculusOperationKind.TAYLOR,
            innerExpressionText,
            variableName,
            null,
            null,
            null,
            LimitDirection.BOTH,
            center,
            order,
        );
    }
}
