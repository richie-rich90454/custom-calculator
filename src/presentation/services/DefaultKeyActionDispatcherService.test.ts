import { describe, expect, it } from "vitest";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { CursorMoveDirection } from "../../domain/model/CursorMoveDirection";
import { KeyActionKind } from "./KeyAction";
import { DefaultKeymapDefinitionService } from "./DefaultKeymapDefinitionService";
import { DefaultKeyActionDispatcherService } from "./DefaultKeyActionDispatcherService";
import type { KeyActionTarget } from "./KeyActionDispatcherService";
import type { KeyDefinition } from "./KeyDefinition";

class RecordingKeyActionTarget implements KeyActionTarget {
    private recordedCalls: string[] = [];

    public record(method: string, value?: string): void {
        this.recordedCalls.push(value === undefined ? method : `${method}:${value}`);
    }

    public getRecordedCalls(): readonly string[] {
        return this.recordedCalls;
    }

    onInsertTextPressed(value: string): void {
        this.record("insertText", value);
    }
    onInsertFunctionPressed(functionName: string): void {
        this.record("insertFunction", functionName);
    }
    onInsertTemplatePressed(templateName: string): void {
        this.record("insertTemplate", templateName);
    }
    onInsertExponent10Pressed(): void {
        this.record("insertExponent10");
    }
    onEvaluatePressed(): void {
        this.record("evaluate");
    }
    onEvaluateApproximatePressed(): void {
        this.record("evaluateApproximate");
    }
    onDeleteBackwardPressed(): void {
        this.record("deleteBackward");
    }
    onClearPressed(): void {
        this.record("clear");
    }
    onShiftPressed(): void {
        this.record("shift");
    }
    onAlphaPressed(): void {
        this.record("alpha");
    }
    onModifierDisarmed(): void {
        this.record("modifierDisarmed");
    }
    onMenuOpened(): void {
        this.record("menuOpened");
    }
    onOptnOpened(): void {
        this.record("optnOpened");
    }
    onCalcPressed(): void {
        this.record("calc");
    }
    onSolvePressed(): void {
        this.record("solve");
    }
    onSDCyclePressed(): void {
        this.record("sdCycle");
    }
    onEngTogglePressed(direction: "forward" | "reverse"): void {
        this.record("engToggle", direction);
    }
    onFixSciMenuOpened(): void {
        this.record("fixSciMenuOpened");
    }
    onStoreModeArmed(): void {
        this.record("storeArmed");
    }
    onRecallModeArmed(): void {
        this.record("recallArmed");
    }
    onMemoryAddPressed(): void {
        this.record("memoryAdd");
    }
    onMemorySubtractPressed(): void {
        this.record("memorySubtract");
    }
    onMemoryRecallPressed(): void {
        this.record("memoryRecall");
    }
    onHyperbolicMenuOpened(inverse: boolean): void {
        this.record("hyperbolicMenu", String(inverse));
    }
    onCursorMovePressed(direction: CursorMoveDirection): void {
        this.record("cursorMove", direction);
    }
    onConfirmPressed(): void {
        this.record("confirm");
    }
    onHistoryStepBackPressed(): void {
        this.record("historyStepBack");
    }
    onHistoryStepForwardPressed(): void {
        this.record("historyStepForward");
    }
}

describe("DefaultKeyActionDispatcherService", () => {
    const dispatcher = new DefaultKeyActionDispatcherService();
    const keymap = new DefaultKeymapDefinitionService();

    function requireKey(keyId: string): KeyDefinition {
        const key = keymap.getKey(keyId);

        if (key === null) {
            throw new Error(`Missing key: ${keyId}`);
        }

        return key;
    }

    it("routes the primary layer when no modifier is armed", () => {
        const target = new RecordingKeyActionTarget();
        const resolution = dispatcher.dispatchKeyPressed(
            requireKey("sin"),
            target,
            ModifierLayer.NONE,
        );

        expect(target.getRecordedCalls()).toEqual(["insertFunction:sin"]);
        expect(resolution.usedLayer).toBe(ModifierLayer.NONE);
    });

    it("routes the shift layer when shift is armed", () => {
        const target = new RecordingKeyActionTarget();
        dispatcher.dispatchKeyPressed(requireKey("sin"), target, ModifierLayer.SHIFT);

        expect(target.getRecordedCalls()).toEqual(["insertFunction:asin"]);
    });

    it("routes the alpha layer when alpha is armed", () => {
        const target = new RecordingKeyActionTarget();
        dispatcher.dispatchKeyPressed(requireKey("sin"), target, ModifierLayer.ALPHA);

        expect(target.getRecordedCalls()).toEqual(["insertText:A"]);
    });

    it("prefers the alpha layer over the shift layer", () => {
        const target = new RecordingKeyActionTarget();
        dispatcher.dispatchKeyPressed(requireKey("log"), target, ModifierLayer.ALPHA);

        expect(target.getRecordedCalls()).toEqual(["insertText:E"]);
    });

    it("falls back to the primary layer when the armed layer has no layer", () => {
        const target = new RecordingKeyActionTarget();
        dispatcher.dispatchKeyPressed(requireKey("7"), target, ModifierLayer.ALPHA);

        expect(target.getRecordedCalls()).toEqual(["insertText:7"]);
    });

    it("reports the used modifier layer to the caller", () => {
        const target = new RecordingKeyActionTarget();
        const resolution = dispatcher.dispatchKeyPressed(
            requireKey("calc"),
            target,
            ModifierLayer.SHIFT,
        );

        expect(resolution.usedLayer).toBe(ModifierLayer.SHIFT);
    });

    it("routes every keycap kind in the primary layer", () => {
        const target = new RecordingKeyActionTarget();

        dispatcher.dispatchKeyPressed(requireKey("integral"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("del"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("ac"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("shift"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("alpha"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("menu"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("optn"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("sto"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("eng"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("m-plus"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("dpad-up"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("confirm"), target, ModifierLayer.NONE);

        expect(target.getRecordedCalls()).toEqual([
            "insertTemplate:integral",
            "deleteBackward",
            "clear",
            "shift",
            "alpha",
            "menuOpened",
            "optnOpened",
            "storeArmed",
            "engToggle:forward",
            "memoryAdd",
            "cursorMove:UP",
            "confirm",
        ]);
    });

    it("routes the shift layer of every layered keycap", () => {
        const target = new RecordingKeyActionTarget();

        dispatcher.dispatchKeyPressed(requireKey("calc"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("integral"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("limit"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("sum"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("sqrt"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("power"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("log"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("ln"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("reciprocal"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("pi"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("sto"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("sd"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("m-plus"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("x10x"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("ans"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("equals"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("hyp"), target, ModifierLayer.SHIFT);
        dispatcher.dispatchKeyPressed(requireKey("eng"), target, ModifierLayer.SHIFT);

        expect(target.getRecordedCalls()).toEqual([
            "solve",
            "insertTemplate:derivative",
            "insertTemplate:taylor",
            "insertTemplate:product",
            "insertFunction:cbrt",
            "insertFunction:nthRoot",
            "insertText:10^",
            "insertText:e^",
            "insertText:!",
            "insertText:e",
            "recallArmed",
            "fixSciMenuOpened",
            "memorySubtract",
            "insertFunction:random",
            "insertText:%",
            "evaluateApproximate",
            "hyperbolicMenu:true",
            "engToggle:reverse",
        ]);
    });

    it("routes the remaining keycap actions across layers", () => {
        const target = new RecordingKeyActionTarget();

        dispatcher.dispatchKeyPressed(requireKey("x10x"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("sd"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("hyp"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("dpad-down"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("dpad-right"), target, ModifierLayer.NONE);
        dispatcher.dispatchKeyPressed(requireKey("dpad-left"), target, ModifierLayer.NONE);

        expect(target.getRecordedCalls()).toEqual([
            "insertExponent10",
            "sdCycle",
            "hyperbolicMenu:false",
            "cursorMove:DOWN",
            "cursorMove:RIGHT",
            "cursorMove:LEFT",
        ]);
    });

    it("dispatches keyboard-only actions directly", () => {
        const target = new RecordingKeyActionTarget();

        dispatcher.dispatchKeyAction({ kind: KeyActionKind.DISARM_MODIFIER }, target);
        dispatcher.dispatchKeyAction({ kind: KeyActionKind.MEMORY_RECALL }, target);
        dispatcher.dispatchKeyAction({ kind: KeyActionKind.HISTORY_STEP_BACK }, target);
        dispatcher.dispatchKeyAction({ kind: KeyActionKind.HISTORY_STEP_FORWARD }, target);

        expect(target.getRecordedCalls()).toEqual([
            "modifierDisarmed",
            "memoryRecall",
            "historyStepBack",
            "historyStepForward",
        ]);
    });

    it("dispatches insertion actions without an explicit value", () => {
        const target = new RecordingKeyActionTarget();

        dispatcher.dispatchKeyAction({ kind: KeyActionKind.INSERT_TEXT }, target);
        dispatcher.dispatchKeyAction({ kind: KeyActionKind.INSERT_FUNCTION }, target);
        dispatcher.dispatchKeyAction({ kind: KeyActionKind.INSERT_TEMPLATE }, target);

        expect(target.getRecordedCalls()).toEqual([
            "insertText:",
            "insertFunction:",
            "insertTemplate:",
        ]);
    });
});
