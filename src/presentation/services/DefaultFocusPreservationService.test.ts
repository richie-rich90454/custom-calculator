import { afterEach, describe, expect, it, vi } from "vitest";
import { ButtonActivationKind } from "./FocusPreservationService";
import { DefaultFocusPreservationService } from "./DefaultFocusPreservationService";

describe("DefaultFocusPreservationService", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("resolves a keyboard press to the keyboard activation kind", () => {
        const service = new DefaultFocusPreservationService();

        expect(service.resolveActivationKind("keyboard")).toBe(ButtonActivationKind.KEYBOARD);
    });

    it("resolves a pointer press to the pointer activation kind", () => {
        const service = new DefaultFocusPreservationService();

        expect(service.resolveActivationKind("mouse")).toBe(ButtonActivationKind.POINTER);
    });

    it("restores focus to the registered editor after a pointer press", () => {
        vi.stubGlobal("requestAnimationFrame", (callback: () => void): number => {
            callback();
            return 0;
        });

        const service = new DefaultFocusPreservationService();
        const focus = vi.fn();

        service.registerEditor({ focus: focus });
        service.restoreFocusAfterButtonPress(ButtonActivationKind.POINTER);

        expect(focus).toHaveBeenCalledTimes(1);
    });

    it("keeps focus on the button after a keyboard press", () => {
        vi.stubGlobal("requestAnimationFrame", (callback: () => void): number => {
            callback();
            return 0;
        });

        const service = new DefaultFocusPreservationService();
        const focus = vi.fn();

        service.registerEditor({ focus: focus });
        service.restoreFocusAfterButtonPress(ButtonActivationKind.KEYBOARD);

        expect(focus).not.toHaveBeenCalled();
    });

    it("does nothing when no editor is registered", () => {
        vi.stubGlobal("requestAnimationFrame", (callback: () => void): number => {
            callback();
            return 0;
        });

        const service = new DefaultFocusPreservationService();

        expect(() => {
            service.restoreFocusAfterButtonPress(ButtonActivationKind.POINTER);
        }).not.toThrow();
    });

    it("restores focus to the most recently registered editor", () => {
        vi.stubGlobal("requestAnimationFrame", (callback: () => void): number => {
            callback();
            return 0;
        });

        const service = new DefaultFocusPreservationService();
        const firstFocus = vi.fn();
        const secondFocus = vi.fn();

        service.registerEditor({ focus: firstFocus });
        service.registerEditor({ focus: secondFocus });
        service.unregisterEditor();
        service.restoreFocusAfterButtonPress(ButtonActivationKind.POINTER);

        expect(firstFocus).toHaveBeenCalledTimes(1);
        expect(secondFocus).not.toHaveBeenCalled();
    });

    it("falls back to a timeout when request animation frame is unavailable", () => {
        vi.stubGlobal("requestAnimationFrame", undefined);
        vi.stubGlobal("setTimeout", (callback: () => void): number => {
            callback();
            return 0;
        });

        const service = new DefaultFocusPreservationService();
        const focus = vi.fn();

        service.registerEditor({ focus: focus });
        service.restoreFocusAfterButtonPress(ButtonActivationKind.POINTER);

        expect(focus).toHaveBeenCalledTimes(1);
    });
});
