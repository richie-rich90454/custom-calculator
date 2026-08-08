import { describe, expect, it } from "vitest";
import { DefaultExpressionEditingService } from "./DefaultExpressionEditingService";
import { DefaultScientificFunctionCatalogService } from "./DefaultScientificFunctionCatalogService";

describe("DefaultExpressionEditingService", () => {
  const catalog = new DefaultScientificFunctionCatalogService();
  const service = new DefaultExpressionEditingService(catalog);

  describe("insertText", () => {
    it("inserts a digit into the expression", () => {
      const edit = service.insertText("1+", "2", 2, 2);

      expect(edit.text).toBe("1+2");
      expect(edit.cursorPosition).toBe(3);
    });

    it("replaces a selection with inserted text", () => {
      const edit = service.insertText("123", "9", 1, 2);

      expect(edit.text).toBe("193");
      expect(edit.cursorPosition).toBe(2);
    });
  });

  describe("deleteBackward", () => {
    it("deletes a single digit inside a number", () => {
      const edit = service.deleteBackward("123", 3, 3);

      expect(edit.text).toBe("12");
      expect(edit.cursorPosition).toBe(2);
    });

    it("deletes a function group when the cursor follows the opening parenthesis", () => {
      const edit = service.deleteBackward("2+sin(", 6, 6);

      expect(edit.text).toBe("2+");
      expect(edit.cursorPosition).toBe(2);
    });

    it("deletes a constant token as a whole", () => {
      const edit = service.deleteBackward("speedOfLight", 12, 12);

      expect(edit.text).toBe("");
      expect(edit.cursorPosition).toBe(0);
    });

    it("deletes paired empty parentheses", () => {
      const edit = service.deleteBackward("2+()", 3, 3);

      expect(edit.text).toBe("2+");
    });

    it("deletes a selection", () => {
      const edit = service.deleteBackward("12+34", 1, 3);

      expect(edit.text).toBe("134");
      expect(edit.cursorPosition).toBe(1);
    });
  });

  describe("deleteForward", () => {
    it("deletes the character after the cursor", () => {
      const edit = service.deleteForward("123", 1, 1);

      expect(edit.text).toBe("13");
      expect(edit.cursorPosition).toBe(1);
    });

    it("deletes a leading identifier token", () => {
      const edit = service.deleteForward("ans+1", 0, 0);

      expect(edit.text).toBe("+1");
    });
  });

  describe("deleteWordBackward", () => {
    it("deletes an entire number word", () => {
      const edit = service.deleteWordBackward("12+34", 5, 5);

      expect(edit.text).toBe("12+");
    });

    it("deletes an identifier token", () => {
      const edit = service.deleteWordBackward("2+ans", 5, 5);

      expect(edit.text).toBe("2+");
    });
  });

  describe("autoCloseParentheses", () => {
    it("closes an unbalanced opening parenthesis", () => {
      expect(service.autoCloseParentheses("(2+3")).toBe("(2+3)");
    });

    it("does not modify a balanced expression", () => {
      expect(service.autoCloseParentheses("(2+3)")).toBe("(2+3)");
    });

    it("closes nested parentheses", () => {
      expect(service.autoCloseParentheses("((1+2)")).toBe("((1+2))");
    });

    it("does not add parentheses when closing parentheses exceed opening ones", () => {
      expect(service.autoCloseParentheses("2+3)")).toBe("2+3)");
    });
  });
});
