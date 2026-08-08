import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class InsertConstantCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(
    private readonly expressionEditingService: ExpressionEditingService,
    private readonly constantCatalogService: ConstantCatalogService,
    private readonly constantId: string
  ) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const constantText =
      this.constantCatalogService.getConstantInsertText(this.constantId);

    if (constantText === null) {
      return currentState;
    }

    const edit = this.expressionEditingService.insertText(
      currentState.expressionText,
      constantText,
      currentState.selectionStart,
      currentState.selectionEnd
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
