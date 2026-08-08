import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";

export interface CalculusAngleModePolicyService {
    getRadiansConversionFactor(angleMode: AngleMode): number;
    getSymbolicTrigConversionFactor(angleMode: AngleMode, policy: CalculusAngleModePolicy): number;
    resolveSymbolicAngleWarning(
        angleMode: AngleMode,
        policy: CalculusAngleModePolicy,
    ): string | null;
    resolveNumericAngleMode(angleMode: AngleMode): AngleMode;
}
