import { KeyActionKind, type KeyAction, createInsertTextAction } from "./KeyAction";

/**
 * Context the physical keyboard binding needs to resolve a key event.
 */
export interface PhysicalKeyboardBindingContext {
    readonly isTypingContext: boolean;
    readonly activePanelOpen: boolean;
    readonly modifierArmed: boolean;
}

export enum PhysicalKeyboardEscapeAction {
    DISARM_MODIFIER = "DISARM_MODIFIER",
    CLOSE_PANEL = "CLOSE_PANEL",
    CLEAR = "CLEAR",
}

export interface PhysicalKeyboardBindingResolution {
    readonly handled: boolean;
    readonly keyAction: KeyAction | null;
    readonly escapeAction: PhysicalKeyboardEscapeAction | null;
}

/**
 * Maps hardware keyboard keys to calculator actions.
 *
 * Digits and operators type directly into the expression, F1-F6 map to the
 * calculator command keys, and PageUp and PageDown walk the history. Keys
 * that the focused control already handles natively (typing inside the
 * expression editor) are left untouched.
 */
export class PhysicalKeyboardBindingService {
    private static readonly DIRECT_INSERT_CHARACTERS = new Set([
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "+",
        "-",
        "*",
        "/",
        "^",
        ".",
        ",",
        "(",
        ")",
        "%",
        "!",
    ]);

    public resolveKeyDown(
        event: { readonly key: string },
        context: PhysicalKeyboardBindingContext,
    ): PhysicalKeyboardBindingResolution {
        if (event.key === "Escape") {
            return this.resolveEscape(context);
        }

        const functionKeyAction = this.resolveFunctionKey(event.key);

        if (functionKeyAction !== null) {
            return { handled: true, keyAction: functionKeyAction, escapeAction: null };
        }

        if (context.isTypingContext) {
            return this.ignore();
        }

        if (event.key === "Enter") {
            return {
                handled: true,
                keyAction: { kind: KeyActionKind.EVALUATE },
                escapeAction: null,
            };
        }

        if (event.key === "Backspace") {
            return {
                handled: true,
                keyAction: { kind: KeyActionKind.DELETE_BACKWARD },
                escapeAction: null,
            };
        }

        if (event.key === "Delete") {
            return {
                handled: true,
                keyAction: { kind: KeyActionKind.DELETE_BACKWARD },
                escapeAction: null,
            };
        }

        if (event.key === "PageUp") {
            return this.resolveHistoryStep("back");
        }

        if (event.key === "PageDown") {
            return this.resolveHistoryStep("forward");
        }

        if (PhysicalKeyboardBindingService.DIRECT_INSERT_CHARACTERS.has(event.key)) {
            return {
                handled: true,
                keyAction: createInsertTextAction(event.key),
                escapeAction: null,
            };
        }

        return this.ignore();
    }

    public resolveHistoryStep(direction: "back" | "forward"): PhysicalKeyboardBindingResolution {
        return {
            handled: true,
            keyAction: {
                kind:
                    direction === "back"
                        ? KeyActionKind.HISTORY_STEP_BACK
                        : KeyActionKind.HISTORY_STEP_FORWARD,
            },
            escapeAction: null,
        };
    }

    private resolveFunctionKey(key: string): KeyAction | null {
        switch (key) {
            case "F1":
                return { kind: KeyActionKind.ARM_SHIFT };
            case "F2":
                return { kind: KeyActionKind.ARM_ALPHA };
            case "F3":
                return { kind: KeyActionKind.OPEN_MENU };
            case "F4":
                return { kind: KeyActionKind.CYCLE_S_TO_D };
            case "F5":
                return { kind: KeyActionKind.CALC };
            case "F6":
                return { kind: KeyActionKind.SOLVE };
            default:
                return null;
        }
    }

    private resolveEscape(
        context: PhysicalKeyboardBindingContext,
    ): PhysicalKeyboardBindingResolution {
        if (context.modifierArmed) {
            return {
                handled: true,
                keyAction: { kind: KeyActionKind.DISARM_MODIFIER },
                escapeAction: null,
            };
        }

        if (context.activePanelOpen) {
            return {
                handled: true,
                keyAction: null,
                escapeAction: PhysicalKeyboardEscapeAction.CLOSE_PANEL,
            };
        }

        if (!context.isTypingContext) {
            return {
                handled: true,
                keyAction: { kind: KeyActionKind.CLEAR },
                escapeAction: null,
            };
        }

        return this.ignore();
    }

    private ignore(): PhysicalKeyboardBindingResolution {
        return { handled: false, keyAction: null, escapeAction: null };
    }
}
