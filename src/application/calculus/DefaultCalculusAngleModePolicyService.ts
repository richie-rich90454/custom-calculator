import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";
import type { CalculusAngleModePolicyService } from "./CalculusAngleModePolicyService";

export class DefaultCalculusAngleModePolicyService
  implements CalculusAngleModePolicyService
{
  public getRadiansConversionFactor(angleMode: AngleMode): number {
    if (angleMode === AngleMode.DEG) {
      return Math.PI / 180;
    }

    if (angleMode === AngleMode.GON) {
      return Math.PI / 200;
    }

    return 1;
  }

  public getSymbolicTrigConversionFactor(
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): number {
    if (policy === CalculusAngleModePolicy.ANGLE_MODE_AWARE) {
      return this.getRadiansConversionFactor(angleMode);
    }

    return 1;
  }

  public resolveSymbolicAngleWarning(
    angleMode: AngleMode,
    policy: CalculusAngleModePolicy
  ): string | null {
    if (
      policy === CalculusAngleModePolicy.RADIANS_ONLY &&
      angleMode !== AngleMode.RAD
    ) {
      return "Symbolic calculus uses radians in RADIANS_ONLY mode. The current angle mode is not applied to symbolic results.";
    }

    return null;
  }

  public resolveNumericAngleMode(angleMode: AngleMode): AngleMode {
    return angleMode;
  }
}
