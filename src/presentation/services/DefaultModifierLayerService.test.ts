import { describe, expect, it } from "vitest";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { ModifierLayerState } from "../../domain/model/ModifierLayerState";
import { DefaultModifierLayerService } from "./DefaultModifierLayerService";

describe("DefaultModifierLayerService", () => {
    const service = new DefaultModifierLayerService();

    describe("armShift", () => {
        it("arms the shift layer from none", () => {
            const next = service.armShift(ModifierLayerState.NONE);

            expect(next.armedLayer).toBe(ModifierLayer.SHIFT);
            expect(next.isShiftArmed()).toBe(true);
        });

        it("disarms alpha when arming shift", () => {
            const next = service.armShift(ModifierLayerState.armed(ModifierLayer.ALPHA));

            expect(next.armedLayer).toBe(ModifierLayer.SHIFT);
            expect(next.isAlphaArmed()).toBe(false);
        });

        it("keeps shift armed when shift is already armed", () => {
            const next = service.armShift(ModifierLayerState.armed(ModifierLayer.SHIFT));

            expect(next.armedLayer).toBe(ModifierLayer.SHIFT);
        });
    });

    describe("armAlpha", () => {
        it("arms the alpha layer from none", () => {
            const next = service.armAlpha(ModifierLayerState.NONE);

            expect(next.armedLayer).toBe(ModifierLayer.ALPHA);
            expect(next.isAlphaArmed()).toBe(true);
        });

        it("disarms shift when arming alpha", () => {
            const next = service.armAlpha(ModifierLayerState.armed(ModifierLayer.SHIFT));

            expect(next.armedLayer).toBe(ModifierLayer.ALPHA);
            expect(next.isShiftArmed()).toBe(false);
        });
    });

    describe("disarm", () => {
        it("disarms without side effects", () => {
            const next = service.disarm();

            expect(next.armedLayer).toBe(ModifierLayer.NONE);
        });
    });

    describe("consume", () => {
        it("returns the armed layer and disarms", () => {
            const consumption = service.consume(ModifierLayerState.armed(ModifierLayer.SHIFT));

            expect(consumption.armedLayer).toBe(ModifierLayer.SHIFT);
            expect(consumption.nextState.armedLayer).toBe(ModifierLayer.NONE);
        });

        it("reports none when nothing is armed", () => {
            const consumption = service.consume(ModifierLayerState.NONE);

            expect(consumption.armedLayer).toBe(ModifierLayer.NONE);
            expect(consumption.nextState.armedLayer).toBe(ModifierLayer.NONE);
        });
    });
});
