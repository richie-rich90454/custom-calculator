import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class InsertFunctionCalculatorCommand extends AbstractCalculatorCommand {
    public constructor(
        private readonly expressionEditingService: ExpressionEditingService,
        private readonly functionName: string,
    ) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        const functionInvocationText = `${this.functionName}(`;

        const edit = this.expressionEditingService.insertText(
            currentState.expressionText,
            functionInvocationText,
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
