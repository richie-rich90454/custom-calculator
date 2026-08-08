import { describe, expect, it } from "vitest";
import { DefaultExpressionCursorService } from "./DefaultExpressionCursorService";
import { DefaultExpressionInsertionService } from "./DefaultExpressionInsertionService";

describe("DefaultExpressionInsertionService", () => {
    const cursorService = new DefaultExpressionCursorService();
    const service = new DefaultExpressionInsertionService(cursorService);

    it("inserts a digit at the cursor", () => {
        const edit = service.insertTemplate(
            {
                text: "7",
                cursorOffset: 1,
                wrapsSelection: false,
                wrapOpenText: "",
                wrapCloseText: "",
            },
            "1+",
            2,
            2,
        );

        expect(edit.text).toBe("1+7");
        expect(edit.cursorPosition).toBe(3);
    });

    it("replaces a selection with the inserted text", () => {
        const edit = service.insertTemplate(
            {
                text: "9",
                cursorOffset: 1,
                wrapsSelection: false,
                wrapOpenText: "",
                wrapCloseText: "",
            },
            "123",
            1,
            2,
        );

        expect(edit.text).toBe("193");
        expect(edit.cursorPosition).toBe(2);
    });

    it("wraps a selection with a function call", () => {
        const edit = service.insertTemplate(
            {
                text: "sin(",
                cursorOffset: 4,
                wrapsSelection: true,
                wrapOpenText: "sin(",
                wrapCloseText: ")",
            },
            "x+1",
            0,
            3,
        );

        expect(edit.text).toBe("sin(x+1)");
        expect(edit.cursorPosition).toBe(7);
    });

    it("does not wrap when the template does not wrap selections", () => {
        const edit = service.insertTemplate(
            {
                text: "+",
                cursorOffset: 1,
                wrapsSelection: false,
                wrapOpenText: "",
                wrapCloseText: "",
            },
            "5",
            0,
            1,
        );

        expect(edit.text).toBe("+");
        expect(edit.cursorPosition).toBe(1);
    });

    it("clamps a selection that exceeds the text length", () => {
        const edit = service.insertTemplate(
            {
                text: "2",
                cursorOffset: 1,
                wrapsSelection: false,
                wrapOpenText: "",
                wrapCloseText: "",
            },
            "5",
            3,
            9,
        );

        expect(edit.text).toBe("52");
        expect(edit.cursorPosition).toBe(2);
    });
});
