export interface ExpressionTextEdit {
  readonly text: string;
  readonly cursorPosition: number;
  readonly selectionStart: number;
  readonly selectionEnd: number;
}

export interface ExpressionEditingService {
  insertText(
    currentText: string,
    textToInsert: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  deleteBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  deleteForward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  deleteWordBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  autoCloseParentheses(expressionText: string): string;
}
