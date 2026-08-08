import { AngleMode } from "../../domain/model/AngleMode";
import type { NumericIntegrationService } from "./NumericIntegrationService";

export interface NumericIntegrationService {
  integrate(
    expressionText: string,
    variableName: string,
    lowerBound: number,
    upperBound: number,
    angleMode: AngleMode
  ): number;
}
