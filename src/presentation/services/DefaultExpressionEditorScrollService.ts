import type {
    ExpressionEditorScrollInput,
    ExpressionEditorScrollService,
} from "./ExpressionEditorScrollService";

/**
 * Default expression editor scroll service.
 *
 * Scrolls only when the caret falls outside the visible width, moving the
 * left edge when the caret is behind it and the right edge when the caret is
 * ahead of it. No scrolling happens when the caret is already visible.
 */
export class DefaultExpressionEditorScrollService implements ExpressionEditorScrollService {
    public scrollCaretIntoView(scrollInput: ExpressionEditorScrollInput): void {
        const { input, caretOffsetX, scrollPadding } = scrollInput;
        const scrollLeft = input.scrollLeft;
        const clientWidth = input.clientWidth;

        if (caretOffsetX < scrollLeft) {
            input.scrollLeft = Math.max(0, caretOffsetX);
            return;
        }

        if (caretOffsetX > scrollLeft + clientWidth) {
            input.scrollLeft = caretOffsetX - clientWidth + scrollPadding;
        }
    }
}
