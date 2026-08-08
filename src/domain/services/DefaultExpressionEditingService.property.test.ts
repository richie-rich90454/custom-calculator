import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { DefaultExpressionEditingService } from "./DefaultExpressionEditingService";
import { DefaultScientificFunctionCatalogService } from "./DefaultScientificFunctionCatalogService";

describe("DefaultExpressionEditingService property tests", () => {
  const service = new DefaultExpressionEditingService(
    new DefaultScientificFunctionCatalogService()
  );

  it("auto-closes all opening parentheses for arbitrary expressions", () => {
    const expressionGenerator = fc
      .array(fc.constantFrom("(", ")", "1", "2", "+"))
      .map((characters) => characters.join(""));

    fc.assert(
      fc.property(expressionGenerator, (input) => {
        const closedText = service.autoCloseParentheses(input);

        if (!closedText.startsWith(input)) {
          return false;
        }

        const appendedText = closedText.slice(input.length);

        return appendedText.split("").every((character) => character === ")");
      })
    );
  });

  it("never increases the length when deleting backward", () => {
    fc.assert(
      fc.property(fc.string(), fc.nat(), (text, cursorPositionRaw) => {
        const cursorPosition = Math.min(cursorPositionRaw, text.length);

        const edit = service.deleteBackward(text, cursorPosition, cursorPosition);

        return edit.text.length <= text.length;
      })
    );
  });

  it("keeps the cursor within the resulting text after inserting", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.nat(), (text, insertion, cursorRaw) => {
        const cursorPosition = Math.min(cursorRaw, text.length);

        const edit = service.insertText(text, insertion, cursorPosition, cursorPosition);

        return edit.cursorPosition <= edit.text.length;
      })
    );
  });
});

function countCharacters(text: string, character: string): number {
  let count = 0;

  for (const value of text) {
    if (value === character) {
      count += 1;
    }
  }

  return count;
}
