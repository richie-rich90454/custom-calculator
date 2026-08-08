import { NumericMode } from "../model/NumericMode";
import type { BigIntSupportDetector } from "../../infrastructure/featuredetection/BigIntSupportDetector";
import type { NumericModePolicyService } from "./NumericModePolicyService";

export abstract class AbstractNumericModePolicyService implements NumericModePolicyService {
    public abstract getSupportedNumericModes(): readonly NumericMode[];
    public abstract isNumericModeSupported(numericMode: NumericMode): boolean;
    public abstract resolveEffectiveNumericMode(requestedNumericMode: NumericMode): NumericMode;
}

export class DefaultNumericModePolicyService extends AbstractNumericModePolicyService {
    public constructor(private readonly bigIntSupportDetector: BigIntSupportDetector) {
        super();
    }

    public getSupportedNumericModes(): readonly NumericMode[] {
        const supportedModes: NumericMode[] = [
            NumericMode.STANDARD,
            NumericMode.EXACT_DECIMAL,
            NumericMode.FRACTION,
        ];

        if (this.bigIntSupportDetector.isBigIntSupported()) {
            supportedModes.push(NumericMode.BIGINT);
        }

        return supportedModes;
    }

    public isNumericModeSupported(numericMode: NumericMode): boolean {
        return this.getSupportedNumericModes().includes(numericMode);
    }

    public resolveEffectiveNumericMode(requestedNumericMode: NumericMode): NumericMode {
        if (this.isNumericModeSupported(requestedNumericMode)) {
            return requestedNumericMode;
        }

        return NumericMode.EXACT_DECIMAL;
    }
}
