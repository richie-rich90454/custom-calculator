import { describe, expect, it } from "vitest";
import { DefaultExpressionEditorCaretRenderingService } from "./DefaultExpressionEditorCaretRenderingService";

describe("DefaultExpressionEditorCaretRenderingService", () => {
    const service = new DefaultExpressionEditorCaretRenderingService();

    it("hides the synthetic caret while the editor is focused so the native caret is the single cursor", () => {
        expect(service.getCaretRenderingState(true, 24)).toEqual({
            showIndicator: false,
            offsetX: 24,
        });
    });

    it("shows the synthetic caret at the measured offset when the editor loses focus", () => {
        expect(service.getCaretRenderingState(false, 36)).toEqual({
            showIndicator: true,
            offsetX: 36,
        });
    });
});
