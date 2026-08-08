export interface ExpressionEditorScrollInput {
    readonly input: HTMLInputElement;
    readonly caretOffsetX: number;
    readonly scrollPadding: number;
}

/**
 * Keeps the expression editor caret visible by scrolling horizontally.
 *
 * The caret offset is measured as the width of the text that precedes the
 * cursor, so the scroll logic only needs the visible width of the input.
 */
export interface ExpressionEditorScrollService {
    scrollCaretIntoView(scrollInput: ExpressionEditorScrollInput): void;
}
