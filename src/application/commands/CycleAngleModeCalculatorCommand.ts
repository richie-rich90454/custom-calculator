import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class CycleAngleModeCalculatorCommand extends AbstractCalculatorCommand {
  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const nextAngleMode =
      currentState.angleMode === AngleMode.DEG
        ? AngleMode.RAD
        : currentState.angleMode === AngleMode.RAD
          ? AngleMode.GON
          : AngleMode.DEG;

    return currentState.copyWith({
      angleMode: nextAngleMode,
      resultText: null,
      errorText: null,
    });
  }
}
