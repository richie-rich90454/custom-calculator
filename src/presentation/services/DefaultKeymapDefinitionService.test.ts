import { describe, expect, it } from "vitest";
import { KeyActionKind } from "./KeyAction";
import { KeycapClass } from "./KeyDefinition";
import { DefaultKeymapDefinitionService } from "./DefaultKeymapDefinitionService";

describe("DefaultKeymapDefinitionService", () => {
    const service = new DefaultKeymapDefinitionService();

    it("provides a frozen catalog", () => {
        const keys = service.getAllKeys();

        expect(Object.isFrozen(keys)).toBe(true);
        expect(Object.isFrozen(keys[0] as unknown)).toBe(true);
        expect(Object.isFrozen((keys[0] as unknown as { primary: object }).primary)).toBe(true);
    });

    it("assigns unique ids to every key", () => {
        const keys = service.getAllKeys();
        const ids = keys.map((key) => key.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it("looks up a key by id", () => {
        expect(service.getKey("sin")?.primary.label).toBe("sin");
    });

    it("returns null for an unknown key id", () => {
        expect(service.getKey("does-not-exist")).toBeNull();
    });

    it("covers the full keycap inventory with all three layers", () => {
        const keys = service.getAllKeys();
        const byId = new Map(keys.map((key) => [key.id, key]));

        expect(byId.has("optn")).toBe(true);
        expect(byId.has("calc")).toBe(true);
        expect(byId.has("integral")).toBe(true);
        expect(byId.has("limit")).toBe(true);
        expect(byId.has("sum")).toBe(true);
        expect(byId.has("fraction")).toBe(true);
        expect(byId.has("sqrt")).toBe(true);
        expect(byId.has("power")).toBe(true);
        expect(byId.has("log")).toBe(true);
        expect(byId.has("ln")).toBe(true);
        expect(byId.has("reciprocal")).toBe(true);
        expect(byId.has("pi")).toBe(true);
        expect(byId.has("sin")).toBe(true);
        expect(byId.has("cos")).toBe(true);
        expect(byId.has("tan")).toBe(true);
        expect(byId.has("hyp")).toBe(true);
        expect(byId.has("sto")).toBe(true);
        expect(byId.has("eng")).toBe(true);
        expect(byId.has("sd")).toBe(true);
        expect(byId.has("m-plus")).toBe(true);
        expect(byId.has("x10x")).toBe(true);
        expect(byId.has("ans")).toBe(true);
        expect(byId.has("equals")).toBe(true);
        expect(byId.has("del")).toBe(true);
        expect(byId.has("ac")).toBe(true);
        expect(byId.has("menu")).toBe(true);
        expect(byId.has("dpad-up")).toBe(true);
        expect(byId.has("confirm")).toBe(true);

        for (let digit = 0; digit <= 9; digit += 1) {
            expect(byId.has(String(digit))).toBe(true);
        }
    });

    it("prints the alpha letters on their silkscreen layers", () => {
        const alphaLayers = service
            .getAllKeys()
            .map((key) => key.alpha?.label)
            .filter((label) => label !== undefined);

        for (const letter of ["A", "B", "C", "D", "E", "F", "M", "Y"]) {
            expect(alphaLayers).toContain(letter);
        }
    });

    it("solves from the shift layer of the calc key", () => {
        expect(service.getKey("calc")?.shift?.action.kind).toBe(KeyActionKind.SOLVE);
    });

    it("arms modifiers from the shift and alpha keys", () => {
        expect(service.getKey("shift")?.primary.action.kind).toBe(KeyActionKind.ARM_SHIFT);
        expect(service.getKey("alpha")?.primary.action.kind).toBe(KeyActionKind.ARM_ALPHA);
    });

    it("places delete and clear keys in their keycap classes", () => {
        expect(service.getKey("del")?.keycapClass).toBe(KeycapClass.DELETE);
        expect(service.getKey("ac")?.keycapClass).toBe(KeycapClass.CLEAR);
    });

    it("lays out the digit keys as bone-white digits", () => {
        expect(service.getKey("5")?.keycapClass).toBe(KeycapClass.DIGIT);
    });
});
