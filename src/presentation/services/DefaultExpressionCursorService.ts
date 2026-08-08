import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";
import type {
  ExpressionCursorService,
  ExpressionInsertionCursorPosition,
} from "./ExpressionCursorService";

/**
 * Default expression cursor service.
 *
 * A wrapped selection places the cursor after the wrapped argument, inside
 * the function call. Any other insertion places the cursor at the template
 * cursor offset measured from the start of the selection.
 */
export class DefaultExpressionCursorService implements ExpressionCursorService {
  public resolveInsertionCursorPosition(
    template: CalculatorButtonTemplate,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionInsertionCursorPosition {
    const hasSelection = selectionStart !== selectionEnd;

    if (hasSelection && template.wrapsSelection) {
      const selectedLength = selectionEnd - selectionStart;
      const cursorPosition =
        selectionStart + template.wrapOpenText.length + selectedLength;

      return {
        cursorPosition: cursorPosition,
        selectionStart: cursorPosition,
        selectionEnd: cursorPosition,
      };
    }

    const cursorPosition = selectionStart + template.cursorOffset;

    return {
      cursorPosition: cursorPosition,
      selectionStart: cursorPosition,
      selectionEnd: cursorPosition,
    };
  }
}
