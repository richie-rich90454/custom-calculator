import { AngleMode } from "../../domain/model/AngleMode";

export interface FiniteSummationService {
  sum(
    expressionText: string,
    variableName: string,
    lowerBound: number,
    upperBound: number,
    angleMode: AngleMode
  ): number;
}
