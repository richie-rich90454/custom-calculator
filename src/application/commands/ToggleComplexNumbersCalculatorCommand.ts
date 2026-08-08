import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class ToggleComplexNumbersCalculatorCommand extends AbstractCalculatorCommand {
    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        return currentState.copyWith({
            complexNumbersEnabled: !currentState.complexNumbersEnabled,
            resultText: null,
            errorText: null,
            lastResultValue: null,
            lastResultText: null,
        });
    }
}
