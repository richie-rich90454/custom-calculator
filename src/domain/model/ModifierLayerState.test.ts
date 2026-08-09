import { describe, expect, it } from "vitest";
import { ModifierLayer } from "./ModifierLayer";
import { ModifierLayerState } from "./ModifierLayerState";

describe("ModifierLayerState", () => {
    it("starts with no armed layer", () => {
        expect(ModifierLayerState.NONE.armedLayer).toBe(ModifierLayer.NONE);
        expect(ModifierLayerState.NONE.isArmed()).toBe(false);
        expect(ModifierLayerState.NONE.isShiftArmed()).toBe(false);
        expect(ModifierLayerState.NONE.isAlphaArmed()).toBe(false);
    });

    it("arms a layer", () => {
        const state = ModifierLayerState.armed(ModifierLayer.SHIFT);

        expect(state.isArmed()).toBe(true);
        expect(state.isShiftArmed()).toBe(true);
        expect(state.isAlphaArmed()).toBe(false);
    });

    it("detects an armed alpha layer", () => {
        const state = ModifierLayerState.armed(ModifierLayer.ALPHA);

        expect(state.isAlphaArmed()).toBe(true);
        expect(state.isShiftArmed()).toBe(false);
    });

    it("keeps no layer armed when arming none", () => {
        expect(ModifierLayerState.NONE.arm(ModifierLayer.NONE).armedLayer).toBe(ModifierLayer.NONE);
    });

    it("replaces the armed layer when arming another", () => {
        const state = ModifierLayerState.armed(ModifierLayer.ALPHA).arm(ModifierLayer.SHIFT);

        expect(state.armedLayer).toBe(ModifierLayer.SHIFT);
        expect(state.isAlphaArmed()).toBe(false);
    });

    it("disarms any armed layer", () => {
        const state = ModifierLayerState.armed(ModifierLayer.SHIFT).disarm();

        expect(state.armedLayer).toBe(ModifierLayer.NONE);
    });
});
