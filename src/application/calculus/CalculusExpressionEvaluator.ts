import { AngleMode } from "../../domain/model/AngleMode";

export interface CalculusExpressionEvaluator {
  evaluate(
    expressionText: string,
    variableName: string,
    value: number,
    angleMode: AngleMode
  ): number;
}
