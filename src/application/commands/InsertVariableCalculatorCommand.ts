import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class InsertVariableCalculatorCommand extends AbstractCalculatorCommand {
    public constructor(
        private readonly expressionEditingService: ExpressionEditingService,
        private readonly variableName: string,
    ) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        const edit = this.expressionEditingService.insertText(
            currentState.expressionText,
            this.variableName,
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
