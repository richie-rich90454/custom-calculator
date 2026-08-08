/**
 * Describes how a button inserts text and where the cursor lands.
 *
 * The cursorOffset is the position of the cursor measured from the start of
 * the inserted text, which lets a single model describe both plain insertions
 * (cursor at the end) and template insertions (cursor at the first editable
 * position inside the inserted text).
 */
export interface CalculatorButtonTemplate {
    readonly text: string;
    readonly cursorOffset: number;
    readonly wrapsSelection: boolean;
    readonly wrapOpenText: string;
    readonly wrapCloseText: string;
}
