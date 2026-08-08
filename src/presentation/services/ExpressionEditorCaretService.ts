/**
 * Computes whether the expression editor should render a synthetic caret.
 *
 * The native input caret is the authoritative cursor whenever the editor is
 * focused: it is visible, blinking, and positioned exactly at the cursor. A
 * synthetic indicator is only rendered when the editor is NOT focused, so the
 * user always sees a single blinking insertion point and the two carets never
 * double up.
 */
export interface ExpressionEditorCaretState {
  readonly showIndicator: boolean;
}

export class ExpressionEditorCaretService {
  public getCaretState(hasFocus: boolean): ExpressionEditorCaretState {
    return {
      showIndicator: !hasFocus,
    };
  }
}
