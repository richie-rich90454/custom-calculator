import { describe, expect, it } from "vitest";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ApplyTextEditCalculatorCommand } from "./ApplyTextEditCalculatorCommand";

describe("ApplyTextEditCalculatorCommand", () => {
    it("applies the text edit and clears the previous result", () => {
        const currentState = CalculatorSessionState.createInitial().copyWith({
            expressionText: "5",
            resultText: "5",
            errorText: null,
        });

        const nextState = new ApplyTextEditCalculatorCommand({
            text: "sin(",
            cursorPosition: 4,
            selectionStart: 4,
            selectionEnd: 4,
        }).execute(currentState);

        expect(nextState.expressionText).toBe("sin(");
        expect(nextState.cursorPosition).toBe(4);
        expect(nextState.selectionStart).toBe(4);
        expect(nextState.selectionEnd).toBe(4);
        expect(nextState.resultText).toBeNull();
    });

    it("preserves the mode fields of the session state", () => {
        const currentState = new CalculatorSessionState(
            "2",
            1,
            1,
            1,
            null,
            null,
            "42",
            42,
            AngleMode.RAD,
            NumericMode.FRACTION,
            true,
            true,
            [],
            "7",
        );

        const nextState = new ApplyTextEditCalculatorCommand({
            text: "2+",
            cursorPosition: 2,
            selectionStart: 2,
            selectionEnd: 2,
        }).execute(currentState);

        expect(nextState.angleMode).toBe(AngleMode.RAD);
        expect(nextState.numericMode).toBe(NumericMode.FRACTION);
        expect(nextState.complexNumbersEnabled).toBe(true);
        expect(nextState.casEnabled).toBe(true);
        expect(nextState.lastResultText).toBe("42");
        expect(nextState.memoryValueText).toBe("7");
    });
});
