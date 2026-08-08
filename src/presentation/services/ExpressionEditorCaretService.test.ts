import { describe, expect, it } from "vitest";
import { ExpressionEditorCaretService } from "./ExpressionEditorCaretService";

describe("ExpressionEditorCaretService", () => {
  const service = new ExpressionEditorCaretService();

  it("hides the synthetic caret while the editor is focused so the native caret is the single cursor", () => {
    expect(service.getCaretState("", true).showIndicator).toBe(false);
    expect(service.getCaretState("2+2", true).showIndicator).toBe(false);
  });

  it("shows the synthetic caret when the editor loses focus", () => {
    expect(service.getCaretState("", false).showIndicator).toBe(true);
    expect(service.getCaretState("2+2", false).showIndicator).toBe(true);
  });
});
