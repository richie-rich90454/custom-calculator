import { describe, expect, it } from "vitest";
import { DefaultExpressionEditorSelectionService } from "./DefaultExpressionEditorSelectionService";

describe("DefaultExpressionEditorSelectionService", () => {
    const service = new DefaultExpressionEditorSelectionService();

    it("resolves a normal selection", () => {
        expect(
            service.resolveSelection({
                selectionStart: 1,
                selectionEnd: 3,
                value: "2+3",
            }),
        ).toEqual({ start: 1, end: 3 });
    });

    it("falls back to the value length when the selection is null", () => {
        expect(
            service.resolveSelection({
                selectionStart: null,
                selectionEnd: null,
                value: "2+3",
            }),
        ).toEqual({ start: 3, end: 3 });
    });

    it("falls back independently for start and end", () => {
        expect(
            service.resolveSelection({
                selectionStart: 0,
                selectionEnd: null,
                value: "2+3",
            }),
        ).toEqual({ start: 0, end: 3 });
    });
});
