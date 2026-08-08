import type {
  ExpressionEditingService,
  ExpressionTextEdit,
} from "./ExpressionEditingService";
import type { ScientificFunctionCatalogService } from "./ScientificFunctionCatalogService";

export abstract class AbstractExpressionEditingService
  implements ExpressionEditingService
{
  public abstract insertText(
    currentText: string,
    textToInsert: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  public abstract deleteBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  public abstract deleteForward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  public abstract deleteWordBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit;

  public abstract autoCloseParentheses(expressionText: string): string;
}

export class DefaultExpressionEditingService extends AbstractExpressionEditingService {
  private static readonly IDENTIFIER_TOKEN_PATTERN = /[a-zA-Z][a-zA-Z0-9]*$/;
  private static readonly WORD_TOKEN_PATTERN = /[a-zA-Z0-9_.]+$/;
  private static readonly LEADING_IDENTIFIER_TOKEN_PATTERN =
    /^[a-zA-Z][a-zA-Z0-9]*/;

  public constructor(
    private readonly functionCatalogService: ScientificFunctionCatalogService
  ) {
    super();
  }

  public insertText(
    currentText: string,
    textToInsert: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit {
    const normalizedSelectionStart = this.clampSelectionStart(
      selectionStart,
      currentText
    );
    const normalizedSelectionEnd = this.clampSelectionEnd(
      selectionEnd,
      currentText
    );

    const nextText =
      currentText.slice(0, normalizedSelectionStart) +
      textToInsert +
      currentText.slice(normalizedSelectionEnd);

    const nextCursorPosition = normalizedSelectionStart + textToInsert.length;

    return {
      text: nextText,
      cursorPosition: nextCursorPosition,
      selectionStart: nextCursorPosition,
      selectionEnd: nextCursorPosition,
    };
  }

  public deleteBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit {
    if (selectionStart !== selectionEnd) {
      return this.deleteRange(currentText, selectionStart, selectionEnd);
    }

    const cursorPosition = selectionStart;

    if (cursorPosition <= 0) {
      return this.noOpEdit(currentText, cursorPosition);
    }

    const prefix = currentText.slice(0, cursorPosition);
    const suffix = currentText.slice(cursorPosition);

    const trailingFunctionGroupStart = this.findTrailingFunctionGroupStart(
      prefix
    );

    if (trailingFunctionGroupStart >= 0) {
      return this.removeRangeEdit(
        currentText,
        trailingFunctionGroupStart,
        cursorPosition
      );
    }

    if (prefix.endsWith("(") && suffix.startsWith(")")) {
      return this.removeRangeEdit(
        currentText,
        cursorPosition - 1,
        cursorPosition + 1
      );
    }

    const trailingIdentifierStart = this.findTrailingIdentifierStart(prefix);

    if (trailingIdentifierStart >= 0) {
      return this.removeRangeEdit(
        currentText,
        trailingIdentifierStart,
        cursorPosition
      );
    }

    return this.removeRangeEdit(currentText, cursorPosition - 1, cursorPosition);
  }

  public deleteForward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit {
    if (selectionStart !== selectionEnd) {
      return this.deleteRange(currentText, selectionStart, selectionEnd);
    }

    const cursorPosition = selectionStart;

    if (cursorPosition >= currentText.length) {
      return this.noOpEdit(currentText, cursorPosition);
    }

    const suffix = currentText.slice(cursorPosition);

    if (suffix.startsWith(")") && currentText.charAt(cursorPosition - 1) === "(") {
      return this.removeRangeEdit(
        currentText,
        cursorPosition - 1,
        cursorPosition + 1
      );
    }

    const leadingIdentifierLength = this.findLeadingIdentifierLength(suffix);

    if (leadingIdentifierLength > 0) {
      return this.removeRangeEdit(
        currentText,
        cursorPosition,
        cursorPosition + leadingIdentifierLength
      );
    }

    return this.removeRangeEdit(currentText, cursorPosition, cursorPosition + 1);
  }

  public deleteWordBackward(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit {
    if (selectionStart !== selectionEnd) {
      return this.deleteRange(currentText, selectionStart, selectionEnd);
    }

    const cursorPosition = selectionStart;

    if (cursorPosition <= 0) {
      return this.noOpEdit(currentText, cursorPosition);
    }

    const prefix = currentText.slice(0, cursorPosition);
    const wordTokenMatch = prefix.match(
      DefaultExpressionEditingService.WORD_TOKEN_PATTERN
    );

    if (wordTokenMatch !== null && wordTokenMatch.index !== undefined) {
      return this.removeRangeEdit(
        currentText,
        wordTokenMatch.index,
        cursorPosition
      );
    }

    return this.removeRangeEdit(currentText, cursorPosition - 1, cursorPosition);
  }

  public autoCloseParentheses(expressionText: string): string {
    let openParenthesisCount = 0;

    for (const character of expressionText) {
      if (character === "(") {
        openParenthesisCount += 1;
      } else if (character === ")") {
        openParenthesisCount = Math.max(0, openParenthesisCount - 1);
      }
    }

    return expressionText + ")".repeat(openParenthesisCount);
  }

  private findTrailingFunctionGroupStart(prefix: string): number {
    if (!prefix.endsWith("(")) {
      return -1;
    }

    const possibleNameText = prefix.slice(0, -1);

    if (possibleNameText.length === 0) {
      return -1;
    }

    const nameTokenMatch = possibleNameText.match(
      /[a-zA-Z][a-zA-Z0-9]*$/
    );

    if (nameTokenMatch === null || nameTokenMatch.index === undefined) {
      return -1;
    }

    const functionName = nameTokenMatch[0];

    if (!this.functionCatalogService.hasFunction(functionName)) {
      return -1;
    }

    return nameTokenMatch.index;
  }

  private findTrailingIdentifierStart(prefix: string): number {
    const match = prefix.match(
      DefaultExpressionEditingService.IDENTIFIER_TOKEN_PATTERN
    );

    if (match === null || match.index === undefined) {
      return -1;
    }

    return match.index;
  }

  private findLeadingIdentifierLength(suffix: string): number {
    const match = suffix.match(
      DefaultExpressionEditingService.LEADING_IDENTIFIER_TOKEN_PATTERN
    );

    if (match === null) {
      return 0;
    }

    return match[0].length;
  }

  private deleteRange(
    currentText: string,
    selectionStart: number,
    selectionEnd: number
  ): ExpressionTextEdit {
    return this.removeRangeEdit(
      currentText,
      selectionStart,
      selectionEnd
    );
  }

  private removeRangeEdit(
    currentText: string,
    startIndex: number,
    endIndex: number
  ): ExpressionTextEdit {
    const nextText =
      currentText.slice(0, startIndex) + currentText.slice(endIndex);

    return {
      text: nextText,
      cursorPosition: startIndex,
      selectionStart: startIndex,
      selectionEnd: startIndex,
    };
  }

  private noOpEdit(
    currentText: string,
    cursorPosition: number
  ): ExpressionTextEdit {
    return {
      text: currentText,
      cursorPosition: cursorPosition,
      selectionStart: cursorPosition,
      selectionEnd: cursorPosition,
    };
  }

  private clampSelectionStart(selectionStart: number, currentText: string): number {
    return Math.max(0, Math.min(selectionStart, currentText.length));
  }

  private clampSelectionEnd(selectionEnd: number, currentText: string): number {
    return Math.max(0, Math.min(selectionEnd, currentText.length));
  }
}
