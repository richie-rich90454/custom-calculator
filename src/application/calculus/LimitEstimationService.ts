import { AngleMode } from "../../domain/model/AngleMode";
import { LimitDirection } from "./CalculusBlockDescriptor";

export type LimitEstimate =
    | { readonly kind: "FINITE"; readonly value: number }
    | { readonly kind: "INFINITY"; readonly sign: 1 | -1 };

export interface LimitEstimationService {
    estimateLimit(
        expressionText: string,
        variableName: string,
        target: number,
        direction: LimitDirection,
        angleMode: AngleMode,
    ): LimitEstimate;
}
