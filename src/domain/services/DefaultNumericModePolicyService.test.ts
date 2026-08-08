import { describe, expect, it } from "vitest";
import { NumericMode } from "../model/NumericMode";
import type { BigIntSupportDetector } from "../../infrastructure/featuredetection/BigIntSupportDetector";
import { DefaultNumericModePolicyService } from "./DefaultNumericModePolicyService";

class FakeBigIntSupportDetector implements BigIntSupportDetector {
    public constructor(private readonly supported: boolean) {}

    public isBigIntSupported(): boolean {
        return this.supported;
    }
}

describe("DefaultNumericModePolicyService", () => {
    it("includes BigInt mode when BigInt is supported", () => {
        const service = new DefaultNumericModePolicyService(new FakeBigIntSupportDetector(true));

        expect(service.isNumericModeSupported(NumericMode.BIGINT)).toBe(true);
        expect(service.getSupportedNumericModes()).toContain(NumericMode.BIGINT);
    });

    it("excludes BigInt mode when BigInt is unsupported", () => {
        const service = new DefaultNumericModePolicyService(new FakeBigIntSupportDetector(false));

        expect(service.isNumericModeSupported(NumericMode.BIGINT)).toBe(false);
        expect(service.getSupportedNumericModes()).not.toContain(NumericMode.BIGINT);
    });

    it("resolves BigInt to exact decimal mode when unsupported", () => {
        const service = new DefaultNumericModePolicyService(new FakeBigIntSupportDetector(false));

        expect(service.resolveEffectiveNumericMode(NumericMode.BIGINT)).toBe(
            NumericMode.EXACT_DECIMAL,
        );
    });

    it("resolves a supported mode to itself", () => {
        const service = new DefaultNumericModePolicyService(new FakeBigIntSupportDetector(false));

        expect(service.resolveEffectiveNumericMode(NumericMode.STANDARD)).toBe(
            NumericMode.STANDARD,
        );
        expect(service.resolveEffectiveNumericMode(NumericMode.FRACTION)).toBe(
            NumericMode.FRACTION,
        );
    });
});
