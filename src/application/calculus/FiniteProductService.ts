import { AngleMode } from "../../domain/model/AngleMode";

export interface FiniteProductService {
    product(
        expressionText: string,
        variableName: string,
        lowerBound: number,
        upperBound: number,
        angleMode: AngleMode,
    ): number;
}
