import { ModifierLayer } from "../../domain/model/ModifierLayer";
import type { CursorMoveDirection } from "../../domain/model/CursorMoveDirection";
import type { KeyAction } from "./KeyAction";
import type { KeyDefinition } from "./KeyDefinition";

/**
 * Action surface the dispatcher forwards keycap presses to.
 *
 * The Zustand store implements this surface; components and the dispatcher
 * never call the session controller directly.
 */
export interface KeyActionTarget {
    onInsertTextPressed(value: string): void;
    onInsertFunctionPressed(functionName: string): void;
    onInsertTemplatePressed(templateName: string): void;
    onInsertExponent10Pressed(): void;
    onEvaluatePressed(): void;
    onEvaluateApproximatePressed(): void;
    onDeleteBackwardPressed(): void;
    onClearPressed(): void;
    onShiftPressed(): void;
    onAlphaPressed(): void;
    onModifierDisarmed(): void;
    onMenuOpened(): void;
    onOptnOpened(): void;
    onCalcPressed(): void;
    onSolvePressed(): void;
    onSDCyclePressed(): void;
    onEngTogglePressed(direction: "forward" | "reverse"): void;
    onFixSciMenuOpened(): void;
    onStoreModeArmed(): void;
    onRecallModeArmed(): void;
    onMemoryAddPressed(): void;
    onMemorySubtractPressed(): void;
    onMemoryRecallPressed(): void;
    onHyperbolicMenuOpened(inverse: boolean): void;
    onCursorMovePressed(direction: CursorMoveDirection): void;
    onConfirmPressed(): void;
    onHistoryStepBackPressed(): void;
    onHistoryStepForwardPressed(): void;
}

export interface KeyActionResolution {
    readonly usedLayer: ModifierLayer;
    readonly actionKind: string;
}

/**
 * Routes a keycap press to the store action for the active modifier layer.
 */
export interface KeyActionDispatcherService {
    dispatchKeyPressed(
        key: KeyDefinition,
        target: KeyActionTarget,
        armedLayer: ModifierLayer,
    ): KeyActionResolution;
    dispatchKeyAction(action: KeyAction, target: KeyActionTarget): void;
}
