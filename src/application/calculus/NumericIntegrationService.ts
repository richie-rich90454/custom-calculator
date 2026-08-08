import { AngleMode } from "../../domain/model/AngleMode";

export interface NumericIntegrationService {
  integrate(
    expressionText: string,
    variableName: string,
    lowerBound: number,
    upperBound: number,
    angleMode: AngleMode
  ): number;
}
