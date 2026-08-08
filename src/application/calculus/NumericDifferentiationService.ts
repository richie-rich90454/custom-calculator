import { AngleMode } from "../../domain/model/AngleMode";

export interface NumericDifferentiationService {
    estimateDerivative(
        expressionText: string,
        variableName: string,
        point: number,
        angleMode: AngleMode,
    ): number;
}
