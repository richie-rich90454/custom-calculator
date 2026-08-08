/**
 * Computes whether the expression editor should render a synthetic caret.
 *
 * The native input caret is visible whenever the editor is focused and has
 * content, so a synthetic indicator is only needed when the editor is focused
 * but empty, guaranteeing a clear insertion point at all times.
 */
export interface ExpressionEditorCaretState {
  readonly showIndicator: boolean;
}

export class ExpressionEditorCaretService {
  public getCaretState(
    expressionText: string,
    hasFocus: boolean
  ): ExpressionEditorCaretState {
    return {
      showIndicator: hasFocus && expressionText.length === 0,
    };
  }
}
