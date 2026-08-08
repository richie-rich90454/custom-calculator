import { describe, expect, it } from "vitest";
import { DefaultExpressionCursorService } from "./DefaultExpressionCursorService";

describe("DefaultExpressionCursorService", () => {
  const service = new DefaultExpressionCursorService();

  const wrappedFunctionTemplate = {
    text: "sin(",
    cursorOffset: 4,
    wrapsSelection: true,
    wrapOpenText: "sin(",
    wrapCloseText: ")",
  };

  const plainTemplate = {
    text: "7",
    cursorOffset: 1,
    wrapsSelection: false,
    wrapOpenText: "",
    wrapCloseText: "",
  };

  it("places the cursor after the inserted text for a plain insertion", () => {
    const cursor = service.resolveInsertionCursorPosition(plainTemplate, 2, 2);

    expect(cursor.cursorPosition).toBe(3);
    expect(cursor.selectionStart).toBe(3);
    expect(cursor.selectionEnd).toBe(3);
  });

  it("places the cursor after the opening parenthesis for a function", () => {
    const cursor = service.resolveInsertionCursorPosition(
      wrappedFunctionTemplate,
      2,
      2
    );

    expect(cursor.cursorPosition).toBe(6);
  });

  it("places the cursor after the wrapped argument inside a function call", () => {
    const cursor = service.resolveInsertionCursorPosition(
      wrappedFunctionTemplate,
      0,
      3
    );

    expect(cursor.cursorPosition).toBe(7);
  });

  it("does not wrap when the template does not wrap selections", () => {
    const cursor = service.resolveInsertionCursorPosition(plainTemplate, 1, 3);

    expect(cursor.cursorPosition).toBe(2);
  });
});
