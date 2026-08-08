import type { ExpressionTextEdit } from "../../domain/services/ExpressionEditingService";
import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";
import type { ExpressionCursorService } from "./ExpressionCursorService";
import type { ExpressionInsertionService } from "./ExpressionInsertionService";

/**
 * Default expression insertion service.
 *
 * Selection wrapping replaces the selected range with the wrapped argument,
 * while a plain insertion replaces the selection with the template text. The
 * resulting cursor is resolved through the cursor service.
 */
export class DefaultExpressionInsertionService implements ExpressionInsertionService {
    public constructor(private readonly cursorService: ExpressionCursorService) {}

    public insertTemplate(
        template: CalculatorButtonTemplate,
        currentText: string,
        selectionStart: number,
        selectionEnd: number,
    ): ExpressionTextEdit {
        const clampedSelectionStart = this.clamp(selectionStart, currentText);
        const clampedSelectionEnd = this.clamp(selectionEnd, currentText);
        const hasSelection = clampedSelectionStart !== clampedSelectionEnd;

        const nextText =
            hasSelection && template.wrapsSelection
                ? this.wrapSelection(
                      currentText,
                      template,
                      clampedSelectionStart,
                      clampedSelectionEnd,
                  )
                : this.insertPlain(
                      currentText,
                      template,
                      clampedSelectionStart,
                      clampedSelectionEnd,
                  );

        const cursor = this.cursorService.resolveInsertionCursorPosition(
            template,
            clampedSelectionStart,
            clampedSelectionEnd,
        );

        return {
            text: nextText,
            cursorPosition: cursor.cursorPosition,
            selectionStart: cursor.selectionStart,
            selectionEnd: cursor.selectionEnd,
        };
    }

    private wrapSelection(
        currentText: string,
        template: CalculatorButtonTemplate,
        selectionStart: number,
        selectionEnd: number,
    ): string {
        return (
            currentText.slice(0, selectionStart) +
            template.wrapOpenText +
            currentText.slice(selectionStart, selectionEnd) +
            template.wrapCloseText +
            currentText.slice(selectionEnd)
        );
    }

    private insertPlain(
        currentText: string,
        template: CalculatorButtonTemplate,
        selectionStart: number,
        selectionEnd: number,
    ): string {
        return (
            currentText.slice(0, selectionStart) + template.text + currentText.slice(selectionEnd)
        );
    }

    private clamp(value: number, text: string): number {
        return Math.max(0, Math.min(value, text.length));
    }
}
