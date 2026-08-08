import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";

export interface ExpressionInsertionCursorPosition {
    readonly cursorPosition: number;
    readonly selectionStart: number;
    readonly selectionEnd: number;
}

/**
 * Resolves the cursor position produced by inserting a button template.
 *
 * The cursor math lives here, out of TSX, so every insertion rule is unit
 * testable in isolation.
 */
export interface ExpressionCursorService {
    resolveInsertionCursorPosition(
        template: CalculatorButtonTemplate,
        selectionStart: number,
        selectionEnd: number,
    ): ExpressionInsertionCursorPosition;
}
