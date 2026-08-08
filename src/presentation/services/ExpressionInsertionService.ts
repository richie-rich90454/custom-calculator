import type { ExpressionTextEdit } from "../../domain/services/ExpressionEditingService";
import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";

/**
 * Applies a button insertion template to the current expression.
 *
 * The service produces the final text edit (text plus cursor position) that
 * the application layer applies to the session state.
 */
export interface ExpressionInsertionService {
  insertTemplate(
    template: CalculatorButtonTemplate,
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;
}
