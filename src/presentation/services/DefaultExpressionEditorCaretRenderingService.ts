import type {
    ExpressionEditorCaretRenderingService,
    ExpressionEditorCaretRenderingState,
} from "./ExpressionEditorCaretRenderingService";

/**
 * Default expression editor caret rendering service.
 *
 * The synthetic caret appears only when the editor is not focused and is
 * positioned at the measured offset of the text that precedes the cursor.
 */
export class DefaultExpressionEditorCaretRenderingService implements ExpressionEditorCaretRenderingService {
    public getCaretRenderingState(
        hasFocus: boolean,
        offsetX: number,
    ): ExpressionEditorCaretRenderingState {
        return {
            showIndicator: !hasFocus,
            offsetX: offsetX,
        };
    }
}
