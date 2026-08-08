import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";

export interface TaylorSeriesService {
  expand(
    expressionText: string,
    variableName: string,
    center: number,
    order: number,
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): string;
}
