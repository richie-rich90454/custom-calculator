import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { CursorMoveDirection } from "../../domain/model/CursorMoveDirection";
import { KeyActionKind, type KeyAction } from "./KeyAction";
import type {
    KeyActionDispatcherService,
    KeyActionResolution,
    KeyActionTarget,
} from "./KeyActionDispatcherService";
import type { KeyDefinition, KeyLayerDefinition } from "./KeyDefinition";

export class DefaultKeyActionDispatcherService implements KeyActionDispatcherService {
    public dispatchKeyPressed(
        key: KeyDefinition,
        target: KeyActionTarget,
        armedLayer: ModifierLayer,
    ): KeyActionResolution {
        const resolvedLayer = this.resolveLayerDefinition(key, armedLayer);

        this.dispatchAction(resolvedLayer.action, target);

        return {
            usedLayer: armedLayer,
            actionKind: resolvedLayer.action.kind,
        };
    }

    public dispatchKeyAction(action: KeyAction, target: KeyActionTarget): void {
        this.dispatchAction(action, target);
    }

    private resolveLayerDefinition(
        key: KeyDefinition,
        armedLayer: ModifierLayer,
    ): KeyLayerDefinition {
        if (armedLayer === ModifierLayer.ALPHA && key.alpha !== undefined) {
            return key.alpha;
        }

        if (armedLayer === ModifierLayer.SHIFT && key.shift !== undefined) {
            return key.shift;
        }

        return key.primary;
    }

    private dispatchAction(action: KeyAction, target: KeyActionTarget): void {
        switch (action.kind) {
            case KeyActionKind.INSERT_TEXT:
                target.onInsertTextPressed(action.value ?? "");
                break;
            case KeyActionKind.INSERT_FUNCTION:
                target.onInsertFunctionPressed(action.value ?? "");
                break;
            case KeyActionKind.INSERT_TEMPLATE:
                target.onInsertTemplatePressed(action.value ?? "");
                break;
            case KeyActionKind.INSERT_EXPONENT_10:
                target.onInsertExponent10Pressed();
                break;
            case KeyActionKind.EVALUATE:
                target.onEvaluatePressed();
                break;
            case KeyActionKind.EVALUATE_APPROXIMATE:
                target.onEvaluateApproximatePressed();
                break;
            case KeyActionKind.DELETE_BACKWARD:
                target.onDeleteBackwardPressed();
                break;
            case KeyActionKind.CLEAR:
                target.onClearPressed();
                break;
            case KeyActionKind.ARM_SHIFT:
                target.onShiftPressed();
                break;
            case KeyActionKind.ARM_ALPHA:
                target.onAlphaPressed();
                break;
            case KeyActionKind.DISARM_MODIFIER:
                target.onModifierDisarmed();
                break;
            case KeyActionKind.OPEN_MENU:
                target.onMenuOpened();
                break;
            case KeyActionKind.OPEN_OPTN:
                target.onOptnOpened();
                break;
            case KeyActionKind.CALC:
                target.onCalcPressed();
                break;
            case KeyActionKind.SOLVE:
                target.onSolvePressed();
                break;
            case KeyActionKind.CYCLE_S_TO_D:
                target.onSDCyclePressed();
                break;
            case KeyActionKind.TOGGLE_ENG:
                target.onEngTogglePressed(action.value === "reverse" ? "reverse" : "forward");
                break;
            case KeyActionKind.OPEN_FIX_SCI:
                target.onFixSciMenuOpened();
                break;
            case KeyActionKind.STORE_ARM:
                target.onStoreModeArmed();
                break;
            case KeyActionKind.RECALL_ARM:
                target.onRecallModeArmed();
                break;
            case KeyActionKind.MEMORY_ADD:
                target.onMemoryAddPressed();
                break;
            case KeyActionKind.MEMORY_SUBTRACT:
                target.onMemorySubtractPressed();
                break;
            case KeyActionKind.MEMORY_RECALL:
                target.onMemoryRecallPressed();
                break;
            case KeyActionKind.OPEN_HYPERBOLIC_MENU:
                target.onHyperbolicMenuOpened(false);
                break;
            case KeyActionKind.OPEN_INVERSE_HYPERBOLIC_MENU:
                target.onHyperbolicMenuOpened(true);
                break;
            case KeyActionKind.MOVE_CURSOR_LEFT:
                target.onCursorMovePressed(CursorMoveDirection.LEFT);
                break;
            case KeyActionKind.MOVE_CURSOR_RIGHT:
                target.onCursorMovePressed(CursorMoveDirection.RIGHT);
                break;
            case KeyActionKind.MOVE_CURSOR_UP:
                target.onCursorMovePressed(CursorMoveDirection.UP);
                break;
            case KeyActionKind.MOVE_CURSOR_DOWN:
                target.onCursorMovePressed(CursorMoveDirection.DOWN);
                break;
            case KeyActionKind.CONFIRM:
                target.onConfirmPressed();
                break;
            case KeyActionKind.HISTORY_STEP_BACK:
                target.onHistoryStepBackPressed();
                break;
            case KeyActionKind.HISTORY_STEP_FORWARD:
                target.onHistoryStepForwardPressed();
                break;
        }
    }
}
