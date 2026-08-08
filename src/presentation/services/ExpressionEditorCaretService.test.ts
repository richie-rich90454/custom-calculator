import { describe, expect, it } from "vitest";
import { ExpressionEditorCaretService } from "./ExpressionEditorCaretService";

describe("ExpressionEditorCaretService", () => {
  const service = new ExpressionEditorCaretService();

  it("shows the caret indicator when the focused editor is empty", () => {
    expect(service.getCaretState("", true).showIndicator).toBe(true);
  });

  it("hides the caret indicator when the editor has content", () => {
    expect(service.getCaretState("2+2", true).showIndicator).toBe(false);
  });

  it("hides the caret indicator when the editor is not focused", () => {
    expect(service.getCaretState("", false).showIndicator).toBe(false);
  });

  it("hides the caret indicator when the editor has content and is not focused", () => {
    expect(service.getCaretState("2+2", false).showIndicator).toBe(false);
  });
});
