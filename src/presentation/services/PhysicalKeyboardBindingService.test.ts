import { describe, expect, it } from "vitest";
import { KeyActionKind } from "./KeyAction";
import {
    PhysicalKeyboardBindingService,
    PhysicalKeyboardEscapeAction,
    type PhysicalKeyboardBindingContext,
} from "./PhysicalKeyboardBindingService";

describe("PhysicalKeyboardBindingService", () => {
    const service = new PhysicalKeyboardBindingService();

    function context(
        overrides: Partial<PhysicalKeyboardBindingContext> = {},
    ): PhysicalKeyboardBindingContext {
        return {
            isTypingContext: false,
            activePanelOpen: false,
            modifierArmed: false,
            ...overrides,
        };
    }

    it("types digits directly when outside a typing context", () => {
        const resolution = service.resolveKeyDown({ key: "5" }, context());

        expect(resolution.handled).toBe(true);
        expect(resolution.keyAction?.kind).toBe(KeyActionKind.INSERT_TEXT);
        expect(resolution.keyAction?.value).toBe("5");
    });

    it("types operators directly", () => {
        const resolution = service.resolveKeyDown({ key: "+" }, context());

        expect(resolution.keyAction?.value).toBe("+");
    });

    it.each(["-", "*", "/", "^", ".", ",", "(", ")", "%", "!"])(
        "types the %s character directly",
        (character) => {
            const resolution = service.resolveKeyDown({ key: character }, context());

            expect(resolution.handled).toBe(true);
            expect(resolution.keyAction?.kind).toBe(KeyActionKind.INSERT_TEXT);
            expect(resolution.keyAction?.value).toBe(character);
        },
    );

    it("deletes backward on Delete outside a typing context", () => {
        const resolution = service.resolveKeyDown({ key: "Delete" }, context());

        expect(resolution.keyAction?.kind).toBe(KeyActionKind.DELETE_BACKWARD);
    });

    it("leaves typing to the focused editor", () => {
        const resolution = service.resolveKeyDown({ key: "5" }, context({ isTypingContext: true }));

        expect(resolution.handled).toBe(false);
    });

    it("evaluates on Enter outside a typing context", () => {
        const resolution = service.resolveKeyDown({ key: "Enter" }, context());

        expect(resolution.keyAction?.kind).toBe(KeyActionKind.EVALUATE);
    });

    it("lets the editor handle Enter inside a typing context", () => {
        const resolution = service.resolveKeyDown(
            { key: "Enter" },
            context({ isTypingContext: true }),
        );

        expect(resolution.handled).toBe(false);
    });

    it("deletes backward on Backspace outside a typing context", () => {
        const resolution = service.resolveKeyDown({ key: "Backspace" }, context());

        expect(resolution.keyAction?.kind).toBe(KeyActionKind.DELETE_BACKWARD);
    });

    it("maps the function keys to their commands", () => {
        expect(service.resolveKeyDown({ key: "F1" }, context()).keyAction?.kind).toBe(
            KeyActionKind.ARM_SHIFT,
        );
        expect(service.resolveKeyDown({ key: "F2" }, context()).keyAction?.kind).toBe(
            KeyActionKind.ARM_ALPHA,
        );
        expect(service.resolveKeyDown({ key: "F3" }, context()).keyAction?.kind).toBe(
            KeyActionKind.OPEN_MENU,
        );
        expect(service.resolveKeyDown({ key: "F4" }, context()).keyAction?.kind).toBe(
            KeyActionKind.CYCLE_S_TO_D,
        );
        expect(service.resolveKeyDown({ key: "F5" }, context()).keyAction?.kind).toBe(
            KeyActionKind.CALC,
        );
        expect(service.resolveKeyDown({ key: "F6" }, context()).keyAction?.kind).toBe(
            KeyActionKind.SOLVE,
        );
    });

    it("recalls previous and next history entries", () => {
        expect(service.resolveKeyDown({ key: "PageUp" }, context()).keyAction?.kind).toBe(
            KeyActionKind.HISTORY_STEP_BACK,
        );
        expect(service.resolveKeyDown({ key: "PageDown" }, context()).keyAction?.kind).toBe(
            KeyActionKind.HISTORY_STEP_FORWARD,
        );
    });

    it("disarms the armed modifier on Escape", () => {
        const resolution = service.resolveKeyDown(
            { key: "Escape" },
            context({ modifierArmed: true }),
        );

        expect(resolution.keyAction?.kind).toBe(KeyActionKind.DISARM_MODIFIER);
    });

    it("closes the open panel on Escape", () => {
        const resolution = service.resolveKeyDown(
            { key: "Escape" },
            context({ activePanelOpen: true }),
        );

        expect(resolution.handled).toBe(true);
        expect(resolution.keyAction).toBeNull();
        expect(resolution.escapeAction).toBe(PhysicalKeyboardEscapeAction.CLOSE_PANEL);
    });

    it("clears the expression on Escape outside a typing context", () => {
        const resolution = service.resolveKeyDown({ key: "Escape" }, context());

        expect(resolution.keyAction?.kind).toBe(KeyActionKind.CLEAR);
    });

    it("leaves Escape to the editor inside a typing context", () => {
        const resolution = service.resolveKeyDown(
            { key: "Escape" },
            context({ isTypingContext: true }),
        );

        expect(resolution.handled).toBe(false);
    });

    it("ignores unknown keys", () => {
        const resolution = service.resolveKeyDown({ key: "q" }, context());

        expect(resolution.handled).toBe(false);
    });
});
