import type { CalculatorUiActions } from "../../state/CalculatorUiActions";
import { CalculatorKeyKind, type CalculatorKeyDefinition } from "./CalculatorKeyDefinition";

/**
 * Maps a pressed key definition to the matching Zustand action.
 *
 * Keeping the dispatch table in a service keeps TSX components free of
 * decision logic and makes the key behavior unit testable.
 */
export class CalculatorKeyCommandDispatcherService {
    public dispatchKeyPressed(key: CalculatorKeyDefinition, actions: CalculatorUiActions): void {
        switch (key.kind) {
            case CalculatorKeyKind.DIGIT:
                actions.onDigitPressed(key.value);
                break;
            case CalculatorKeyKind.OPERATOR:
                actions.onOperatorPressed(key.value);
                break;
            case CalculatorKeyKind.FUNCTION:
            case CalculatorKeyKind.CAS_OPERATION:
            case CalculatorKeyKind.CALCULUS_OPERATION:
                actions.onFunctionPressed(key.value);
                break;
            case CalculatorKeyKind.CONSTANT:
                actions.onConstantPressed(key.value);
                break;
            case CalculatorKeyKind.PARENTHESIS:
                actions.onParenthesisPressed(key.value);
                break;
            case CalculatorKeyKind.CLEAR:
                actions.onClearPressed();
                break;
            case CalculatorKeyKind.DELETE_BACKWARD:
                actions.onDeleteBackwardPressed();
                break;
            case CalculatorKeyKind.DELETE_FORWARD:
                actions.onDeleteForwardPressed();
                break;
            case CalculatorKeyKind.EVALUATE:
                actions.onEvaluatePressed();
                break;
            case CalculatorKeyKind.ANS:
                actions.onVariablePressed("ans");
                break;
            case CalculatorKeyKind.MEMORY_RECALL:
                actions.onMemoryRecallPressed();
                break;
        }
    }
}
