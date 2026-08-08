export interface ExpressionEditorSelectionInput {
  readonly selectionStart: number | null;
  readonly selectionEnd: number | null;
  readonly value: string;
}

export interface ExpressionEditorSelection {
  readonly start: number;
  readonly end: number;
}

/**
 * Resolves the selection range of the expression editor input.
 *
 * The native input can report a null selection in some environments, so the
 * resolver normalizes a null selection to the end of the value.
 */
export interface ExpressionEditorSelectionService {
  resolveSelection(
    input: ExpressionEditorSelectionInput
  ): ExpressionEditorSelection;
}
