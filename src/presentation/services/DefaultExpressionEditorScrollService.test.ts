import { describe, expect, it } from "vitest";
import { DefaultExpressionEditorScrollService } from "./DefaultExpressionEditorScrollService";

describe("DefaultExpressionEditorScrollService", () => {
    const service = new DefaultExpressionEditorScrollService();

    const createInput = (scrollLeft: number, clientWidth: number) =>
        ({ scrollLeft: scrollLeft, clientWidth: clientWidth }) as HTMLInputElement;

    it("scrolls left when the caret is before the visible area", () => {
        const input = createInput(200, 100);

        service.scrollCaretIntoView({
            input: input,
            caretOffsetX: 80,
            scrollPadding: 8,
        });

        expect(input.scrollLeft).toBe(80);
    });

    it("scrolls right when the caret is past the visible area", () => {
        const input = createInput(0, 100);

        service.scrollCaretIntoView({
            input: input,
            caretOffsetX: 240,
            scrollPadding: 8,
        });

        expect(input.scrollLeft).toBe(148);
    });

    it("does not scroll when the caret is already visible", () => {
        const input = createInput(10, 100);

        service.scrollCaretIntoView({
            input: input,
            caretOffsetX: 60,
            scrollPadding: 8,
        });

        expect(input.scrollLeft).toBe(10);
    });

    it("scrolls left to reveal the caret when it is behind the visible area", () => {
        const input = createInput(10, 100);

        service.scrollCaretIntoView({
            input: input,
            caretOffsetX: 4,
            scrollPadding: 8,
        });

        expect(input.scrollLeft).toBe(4);
    });
});
