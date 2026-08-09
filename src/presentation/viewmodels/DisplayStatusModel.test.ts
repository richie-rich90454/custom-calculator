import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { DisplayStatusModel } from "./DisplayStatusModel";

describe("DisplayStatusModel", () => {
    it("labels each angle mode", () => {
        expect(
            new DisplayStatusModel(
                "Calculate",
                AngleMode.DEG,
                NumericMode.STANDARD,
                false,
                false,
                false,
                false,
                false,
                true,
            ).angleModeLabel,
        ).toBe("DEG");
        expect(
            new DisplayStatusModel(
                "Calculate",
                AngleMode.RAD,
                NumericMode.STANDARD,
                false,
                false,
                false,
                false,
                false,
                true,
            ).angleModeLabel,
        ).toBe("RAD");
        expect(
            new DisplayStatusModel(
                "Calculate",
                AngleMode.GON,
                NumericMode.STANDARD,
                false,
                false,
                false,
                false,
                false,
                true,
            ).angleModeLabel,
        ).toBe("GON");
    });
});
