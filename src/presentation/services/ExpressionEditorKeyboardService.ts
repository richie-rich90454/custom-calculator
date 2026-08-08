/**
 * Decides how keyboard events inside the expression editor should behave.
 *
 * The presentation layer delegates raw key events to this service so the
 * editing policy (evaluate on enter, delete on backspace, and so on) lives
 * in testable TypeScript rather than inside a TSX component.
 */
export interface ExpressionEditorKeyActionTarget {
    onEvaluatePressed(): void;
    onDeleteBackwardPressed(): void;
    onDeleteForwardPressed(): void;
    onDeleteWordBackwardPressed(): void;
    onClearPressed(): void;
}

export interface ExpressionEditorKeyDownResolution {
    readonly handled: boolean;
}

export class ExpressionEditorKeyboardService {
    /**
     * Handles a key down event on the expression editor.
     *
     * Returns true when the event was handled so the caller can prevent
     * default browser behavior. Arrow keys, Home, and End are intentionally
     * left to the native input so the cursor moves naturally.
     */
    public handleKeyDown(
        event: { readonly key: string; readonly ctrlKey: boolean; readonly metaKey: boolean },
        target: ExpressionEditorKeyActionTarget,
    ): ExpressionEditorKeyDownResolution {
        if (event.key === "Enter") {
            target.onEvaluatePressed();
            return { handled: true };
        }

        if (event.key === "Backspace" && (event.ctrlKey || event.metaKey)) {
            target.onDeleteWordBackwardPressed();
            return { handled: true };
        }

        if (event.key === "Backspace") {
            target.onDeleteBackwardPressed();
            return { handled: true };
        }

        if (event.key === "Delete") {
            target.onDeleteForwardPressed();
            return { handled: true };
        }

        if (event.key === "Escape") {
            target.onClearPressed();
            return { handled: true };
        }

        return { handled: false };
    }
}
