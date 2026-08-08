export interface ExpressionEditorCaretRenderingState {
    readonly showIndicator: boolean;
    readonly offsetX: number;
}

/**
 * Decides whether the expression editor should render a synthetic caret and
 * where it should be positioned.
 *
 * The native input caret is authoritative while the editor is focused. A
 * synthetic indicator is shown only when the editor is not focused, so the
 * user always sees exactly one caret at the correct logical position.
 */
export interface ExpressionEditorCaretRenderingService {
    getCaretRenderingState(hasFocus: boolean, offsetX: number): ExpressionEditorCaretRenderingState;
}
