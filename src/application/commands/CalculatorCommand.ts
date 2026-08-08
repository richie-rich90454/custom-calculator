import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";

export interface CalculatorCommand {
  execute(currentState: CalculatorSessionState): CalculatorSessionState;
}
