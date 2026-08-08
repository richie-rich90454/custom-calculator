import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";

export interface SymbolicDifferentiationService {
  differentiateSymbolically(
    expressionText: string,
    variableName: string,
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): string;
}
