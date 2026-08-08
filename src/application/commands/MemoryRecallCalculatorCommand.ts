import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class MemoryRecallCalculatorCommand extends AbstractCalculatorCommand {
    public constructor(private readonly expressionEditingService: ExpressionEditingService) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        if (currentState.memoryValueText === null) {
            return currentState;
        }

        const edit = this.expressionEditingService.insertText(
            currentState.expressionText,
            currentState.memoryValueText,
            currentState.selectionStart,
            currentState.selectionEnd,
        );

        return currentState.copyWith({
            expressionText: edit.text,
            cursorPosition: edit.cursorPosition,
            selectionStart: edit.selectionStart,
            selectionEnd: edit.selectionEnd,
            resultText: null,
            errorText: null,
        });
    }
}
