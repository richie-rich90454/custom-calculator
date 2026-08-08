import type {
    ExpressionEditorSelection,
    ExpressionEditorSelectionInput,
    ExpressionEditorSelectionService,
} from "./ExpressionEditorSelectionService";

/**
 * Default expression editor selection service.
 *
 * Normalizes a null native selection to the end of the value so the editor
 * never misreads the caret when the browser reports no selection.
 */
export class DefaultExpressionEditorSelectionService implements ExpressionEditorSelectionService {
    public resolveSelection(input: ExpressionEditorSelectionInput): ExpressionEditorSelection {
        return {
            start: input.selectionStart ?? input.value.length,
            end: input.selectionEnd ?? input.value.length,
        };
    }
}
