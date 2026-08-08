import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class ToggleCasModeCalculatorCommand extends AbstractCalculatorCommand {
  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return currentState.copyWith({
      casEnabled: !currentState.casEnabled,
      resultText: null,
      errorText: null,
    });
  }
}
