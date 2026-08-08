import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";
import { DefaultCalculusAngleModePolicyService } from "./DefaultCalculusAngleModePolicyService";

describe("DefaultCalculusAngleModePolicyService", () => {
    const service = new DefaultCalculusAngleModePolicyService();

    it("returns the radians conversion factor per angle mode", () => {
        expect(service.getRadiansConversionFactor(AngleMode.DEG)).toBeCloseTo(Math.PI / 180);
        expect(service.getRadiansConversionFactor(AngleMode.GON)).toBeCloseTo(Math.PI / 200);
        expect(service.getRadiansConversionFactor(AngleMode.RAD)).toBe(1);
    });

    it("applies the angle conversion factor only in angle mode aware policy", () => {
        expect(
            service.getSymbolicTrigConversionFactor(
                AngleMode.DEG,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toBe(1);
        expect(
            service.getSymbolicTrigConversionFactor(
                AngleMode.DEG,
                CalculusAngleModePolicy.ANGLE_MODE_AWARE,
            ),
        ).toBeCloseTo(Math.PI / 180);
        expect(
            service.getSymbolicTrigConversionFactor(
                AngleMode.RAD,
                CalculusAngleModePolicy.ANGLE_MODE_AWARE,
            ),
        ).toBe(1);
    });

    it("warns when radians only policy is combined with a non radian angle mode", () => {
        expect(
            service.resolveSymbolicAngleWarning(
                AngleMode.DEG,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toContain("radians");
        expect(
            service.resolveSymbolicAngleWarning(
                AngleMode.GON,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toContain("radians");
        expect(
            service.resolveSymbolicAngleWarning(
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toBeNull();
        expect(
            service.resolveSymbolicAngleWarning(
                AngleMode.DEG,
                CalculusAngleModePolicy.ANGLE_MODE_AWARE,
            ),
        ).toBeNull();
    });

    it("passes the active angle mode through for numeric calculus", () => {
        expect(service.resolveNumericAngleMode(AngleMode.GON)).toBe(AngleMode.GON);
    });
});
