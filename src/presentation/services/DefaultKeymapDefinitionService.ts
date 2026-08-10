import {
    KeyActionKind,
    type KeyAction,
    createInsertFunctionAction,
    createInsertTemplateAction,
    createInsertTextAction,
} from "./KeyAction";
import { KeycapClass, type KeyDefinition, type KeyLayerDefinition } from "./KeyDefinition";
import type { KeymapDefinitionService } from "./KeymapDefinitionService";

/**
 * Frozen full keymap of the instrument.
 *
 * Every keycap carries up to three silkscreen layers: primary ink, copper
 * SHIFT, and teal ALPHA. The catalog is built once and deep-frozen so the
 * instrument layout can never mutate at runtime.
 */
export class DefaultKeymapDefinitionService implements KeymapDefinitionService {
    private readonly frozenKeys: readonly KeyDefinition[];

    public constructor() {
        this.frozenKeys = deepFreeze(buildFullKeymap());
    }

    public getAllKeys(): readonly KeyDefinition[] {
        return this.frozenKeys;
    }

    public getKey(keyId: string): KeyDefinition | null {
        return this.frozenKeys.find((key) => key.id === keyId) ?? null;
    }
}

function buildFullKeymap(): readonly KeyDefinition[] {
    return [
        {
            id: "menu",
            primary: layer("MENU", "Open the app menu", action(KeyActionKind.OPEN_MENU)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "optn",
            primary: layer("OPTN", "Open the options catalog", action(KeyActionKind.OPEN_OPTN)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "shift",
            primary: layer("SHIFT", "Arm the shift layer", action(KeyActionKind.ARM_SHIFT)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "alpha",
            primary: layer("ALPHA", "Arm the alpha layer", action(KeyActionKind.ARM_ALPHA)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "calc",
            primary: layer("CALC", "Evaluate with a variable prompt", action(KeyActionKind.CALC)),
            shift: layer("SOLVE", "Solve an equation numerically", action(KeyActionKind.SOLVE)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "integral",
            primary: layer("∫", "Insert a definite integral template", template("integral")),
            shift: layer("d/dx", "Insert a derivative template", template("derivative")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "limit",
            primary: layer("lim", "Insert a limit template", template("limit")),
            shift: layer("taylor", "Insert a Taylor series template", template("taylor")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "sum",
            primary: layer("Σ", "Insert a summation template", template("sum")),
            shift: layer("Π", "Insert a product template", template("product")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "xy",
            primary: layer("x", "Insert the variable x", text("x")),
            shift: layer("y", "Insert the variable y", text("y")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "fraction",
            primary: layer("a/b", "Insert a fraction template", template("fraction")),
            shift: layer("d/c", "Insert a mixed fraction template", template("mixedFraction")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "sqrt",
            primary: layer("√", "Insert a square root", fn("sqrt")),
            shift: layer("∛", "Insert a cube root", fn("cbrt")),
            alpha: layer("F", "Insert the variable F", text("F")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "square",
            primary: layer("x²", "Square", fn("square")),
            shift: layer("x³", "Cube", fn("cube")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "power",
            primary: layer("xʸ", "Insert the power operator", text("^")),
            shift: layer("x√y", "Insert an nth root", fn("nthRoot")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "log",
            primary: layer("log", "Insert a logarithm with base a", template("logBase")),
            shift: layer("10ˣ", "Insert ten to the power of", text("10^")),
            alpha: layer("E", "Insert the variable E", text("E")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "ln",
            primary: layer("ln", "Insert a natural logarithm", fn("ln")),
            shift: layer("eˣ", "Insert e to the power of", text("e^")),
            alpha: layer("D", "Insert the variable D", text("D")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "reciprocal",
            primary: layer("1/x", "Insert a reciprocal", fn("inv")),
            shift: layer("n!", "Insert a factorial", text("!")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "pi",
            primary: layer("π", "Insert pi", text("pi")),
            shift: layer("e", "Insert Euler's number", text("e")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "sin",
            primary: layer("sin", "Insert a sine", fn("sin")),
            shift: layer("sin⁻¹", "Insert an arcsine", fn("asin")),
            alpha: layer("A", "Insert the variable A", text("A")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "cos",
            primary: layer("cos", "Insert a cosine", fn("cos")),
            shift: layer("cos⁻¹", "Insert an arccosine", fn("acos")),
            alpha: layer("B", "Insert the variable B", text("B")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "tan",
            primary: layer("tan", "Insert a tangent", fn("tan")),
            shift: layer("tan⁻¹", "Insert an arctangent", fn("atan")),
            alpha: layer("C", "Insert the variable C", text("C")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "hyp",
            primary: layer(
                "hyp",
                "Open the hyperbolic menu",
                action(KeyActionKind.OPEN_HYPERBOLIC_MENU),
            ),
            shift: layer(
                "hyp⁻¹",
                "Open the inverse hyperbolic menu",
                action(KeyActionKind.OPEN_INVERSE_HYPERBOLIC_MENU),
            ),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "sto",
            primary: layer("STO", "Arm store-to-variable mode", action(KeyActionKind.STORE_ARM)),
            shift: layer("RCL", "Arm recall-variable mode", action(KeyActionKind.RECALL_ARM)),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "eng",
            primary: layer("ENG", "Toggle engineering format", {
                kind: KeyActionKind.TOGGLE_ENG,
                value: "forward",
            }),
            shift: layer("ENG", "Reverse engineering format direction", {
                kind: KeyActionKind.TOGGLE_ENG,
                value: "reverse",
            }),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "sd",
            primary: layer(
                "S⇔D",
                "Cycle between decimal and fraction result",
                action(KeyActionKind.CYCLE_S_TO_D),
            ),
            shift: layer(
                "FIX/SCI",
                "Open the display format menu",
                action(KeyActionKind.OPEN_FIX_SCI),
            ),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "m-plus",
            primary: layer("M+", "Add the result to memory", action(KeyActionKind.MEMORY_ADD)),
            shift: layer(
                "M-",
                "Subtract the result from memory",
                action(KeyActionKind.MEMORY_SUBTRACT),
            ),
            alpha: layer("M", "Insert the memory variable M", text("M")),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "paren-open",
            primary: layer("(", "Open parenthesis", text("(")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "paren-close",
            primary: layer(")", "Close parenthesis", text(")")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "x10x",
            primary: layer(
                "×10ˣ",
                "Insert a times ten to the power of",
                action(KeyActionKind.INSERT_EXPONENT_10),
            ),
            shift: layer("Ran#", "Insert a random number", fn("random")),
            keycapClass: KeycapClass.FUNCTION,
        },
        {
            id: "ans",
            primary: layer("Ans", "Insert the previous answer", text("ans")),
            shift: layer("%", "Insert a percent", text("%")),
            alpha: layer("Y", "Insert the variable Y", text("Y")),
            keycapClass: KeycapClass.UTILITY,
        },
        {
            id: "del",
            primary: layer(
                "DEL",
                "Delete the token before the caret",
                action(KeyActionKind.DELETE_BACKWARD),
            ),
            keycapClass: KeycapClass.DELETE,
        },
        {
            id: "ac",
            primary: layer("AC", "Clear the expression and result", action(KeyActionKind.CLEAR)),
            keycapClass: KeycapClass.CLEAR,
        },
        {
            id: "7",
            primary: layer("7", "Digit seven", text("7")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "8",
            primary: layer("8", "Digit eight", text("8")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "9",
            primary: layer("9", "Digit nine", text("9")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "divide",
            primary: layer("÷", "Division", text("/")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "4",
            primary: layer("4", "Digit four", text("4")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "5",
            primary: layer("5", "Digit five", text("5")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "6",
            primary: layer("6", "Digit six", text("6")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "multiply",
            primary: layer("×", "Multiplication", text("*")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "1",
            primary: layer("1", "Digit one", text("1")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "2",
            primary: layer("2", "Digit two", text("2")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "3",
            primary: layer("3", "Digit three", text("3")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "subtract",
            primary: layer("−", "Subtraction", text("-")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "0",
            primary: layer("0", "Digit zero", text("0")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "decimal",
            primary: layer(".", "Decimal point", text(".")),
            keycapClass: KeycapClass.DIGIT,
        },
        {
            id: "comma",
            primary: layer(",", "Argument separator", text(",")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "add",
            primary: layer("+", "Addition", text("+")),
            keycapClass: KeycapClass.OPERATOR,
        },
        {
            id: "equals",
            primary: layer("=", "Evaluate", action(KeyActionKind.EVALUATE)),
            shift: layer("≈", "Evaluate approximately", action(KeyActionKind.EVALUATE_APPROXIMATE)),
            keycapClass: KeycapClass.EVALUATE,
        },
        {
            id: "dpad-up",
            primary: layer(
                "▲",
                "Step back through history",
                action(KeyActionKind.HISTORY_STEP_BACK),
            ),
            keycapClass: KeycapClass.NAVIGATION,
        },
        {
            id: "dpad-down",
            primary: layer(
                "▼",
                "Step forward through history",
                action(KeyActionKind.HISTORY_STEP_FORWARD),
            ),
            keycapClass: KeycapClass.NAVIGATION,
        },
        {
            id: "dpad-left",
            primary: layer("◀", "Move left", action(KeyActionKind.MOVE_CURSOR_LEFT)),
            keycapClass: KeycapClass.NAVIGATION,
        },
        {
            id: "dpad-right",
            primary: layer("▶", "Move right", action(KeyActionKind.MOVE_CURSOR_RIGHT)),
            keycapClass: KeycapClass.NAVIGATION,
        },
        {
            id: "confirm",
            primary: layer("OK", "Confirm", action(KeyActionKind.CONFIRM)),
            keycapClass: KeycapClass.NAVIGATION,
        },
    ];
}

function layer(label: string, ariaLabel: string, action: KeyAction): KeyLayerDefinition {
    return { label: label, ariaLabel: ariaLabel, action: action };
}

function action(kind: KeyActionKind): KeyAction {
    return { kind: kind };
}

function text(value: string): KeyAction {
    return createInsertTextAction(value);
}

function fn(functionName: string): KeyAction {
    return createInsertFunctionAction(functionName);
}

function template(templateName: string): KeyAction {
    return createInsertTemplateAction(templateName);
}

function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === "object") {
        Object.freeze(value);
        for (const child of Object.values(value)) {
            deepFreeze(child);
        }
    }

    return value;
}
