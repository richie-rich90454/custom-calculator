/**
 * Typed description of what a keycap press does.
 *
 * The keymap catalog is pure data: it never touches the store or services.
 * The key action dispatcher translates each kind into a store call, so the
 * catalog stays frozen and the dispatch behavior stays testable.
 */
export enum KeyActionKind {
    INSERT_TEXT = "INSERT_TEXT",
    INSERT_FUNCTION = "INSERT_FUNCTION",
    INSERT_TEMPLATE = "INSERT_TEMPLATE",
    INSERT_EXPONENT_10 = "INSERT_EXPONENT_10",
    EVALUATE = "EVALUATE",
    EVALUATE_APPROXIMATE = "EVALUATE_APPROXIMATE",
    DELETE_BACKWARD = "DELETE_BACKWARD",
    CLEAR = "CLEAR",
    ARM_SHIFT = "ARM_SHIFT",
    ARM_ALPHA = "ARM_ALPHA",
    DISARM_MODIFIER = "DISARM_MODIFIER",
    OPEN_MENU = "OPEN_MENU",
    OPEN_OPTN = "OPEN_OPTN",
    CALC = "CALC",
    SOLVE = "SOLVE",
    CYCLE_S_TO_D = "CYCLE_S_TO_D",
    TOGGLE_ENG = "TOGGLE_ENG",
    OPEN_FIX_SCI = "OPEN_FIX_SCI",
    STORE_ARM = "STORE_ARM",
    RECALL_ARM = "RECALL_ARM",
    MEMORY_ADD = "MEMORY_ADD",
    MEMORY_SUBTRACT = "MEMORY_SUBTRACT",
    MEMORY_RECALL = "MEMORY_RECALL",
    OPEN_HYPERBOLIC_MENU = "OPEN_HYPERBOLIC_MENU",
    OPEN_INVERSE_HYPERBOLIC_MENU = "OPEN_INVERSE_HYPERBOLIC_MENU",
    MOVE_CURSOR_LEFT = "MOVE_CURSOR_LEFT",
    MOVE_CURSOR_RIGHT = "MOVE_CURSOR_RIGHT",
    MOVE_CURSOR_UP = "MOVE_CURSOR_UP",
    MOVE_CURSOR_DOWN = "MOVE_CURSOR_DOWN",
    CONFIRM = "CONFIRM",
    HISTORY_STEP_BACK = "HISTORY_STEP_BACK",
    HISTORY_STEP_FORWARD = "HISTORY_STEP_FORWARD",
}

export interface KeyAction {
    readonly kind: KeyActionKind;
    readonly value?: string;
}

export function createInsertTextAction(value: string): KeyAction {
    return { kind: KeyActionKind.INSERT_TEXT, value: value };
}

export function createInsertFunctionAction(functionName: string): KeyAction {
    return { kind: KeyActionKind.INSERT_FUNCTION, value: functionName };
}

export function createInsertTemplateAction(templateName: string): KeyAction {
    return { kind: KeyActionKind.INSERT_TEMPLATE, value: templateName };
}
