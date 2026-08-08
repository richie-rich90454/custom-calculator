import { NumericMode } from "../model/NumericMode";

export interface NumericModePolicyService {
    getSupportedNumericModes(): readonly NumericMode[];
    isNumericModeSupported(numericMode: NumericMode): boolean;
    resolveEffectiveNumericMode(requestedNumericMode: NumericMode): NumericMode;
}
