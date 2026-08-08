/**
 * Resolves the selection range of the expression editor input.
 *
 * The native input can report a null selection in some environments, so this
 * service normalizes a null selection to the end of the value. Keeping the
 * normalization here makes the fallback behavior unit testable.
 */
export interface ExpressionEditorSelectionInput {
  readonly selectionStart: number | null;
  readonly selectionEnd: number | null;
  readonly value: string;
}

export interface ExpressionEditorSelection {
  readonly start: number;
  readonly end: number;
}

export class ExpressionEditorSelectionService {
  public resolveSelection(
    input: ExpressionEditorSelectionInput
  ): ExpressionEditorSelection {
    return {
      start: input.selectionStart ?? input.value.length,
      end: input.selectionEnd ?? input.value.length,
    };
  }
}
