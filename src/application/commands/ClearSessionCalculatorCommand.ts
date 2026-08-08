import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class ClearSessionCalculatorCommand extends AbstractCalculatorCommand {
    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        return currentState.copyWith({
            expressionText: "",
            cursorPosition: 0,
            selectionStart: 0,
            selectionEnd: 0,
            resultText: null,
            errorText: null,
        });
    }
}
