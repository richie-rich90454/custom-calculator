import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { CalculatorCommand } from "./CalculatorCommand";

export abstract class AbstractCalculatorCommand implements CalculatorCommand {
    public abstract execute(currentState: CalculatorSessionState): CalculatorSessionState;
}
