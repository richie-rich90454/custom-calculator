import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class MemoryClearCalculatorCommand extends AbstractCalculatorCommand {
  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return currentState.copyWith({
      memoryValueText: null,
    });
  }
}
