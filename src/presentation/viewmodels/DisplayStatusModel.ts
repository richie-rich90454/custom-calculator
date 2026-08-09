import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";

/**
 * Read-only description of the status strip shown above the display.
 *
 * The status strip mirrors the current state of the instrument: the active
 * app, the angle and numeric format chips, the armed modifier arrows, and the
 * memory, CAS, complex, and BigInt warning indicators.
 */
export class DisplayStatusModel {
    public constructor(
        public readonly activeAppName: string,
        public readonly angleMode: AngleMode,
        public readonly numericMode: NumericMode,
        public readonly shiftArmed: boolean,
        public readonly alphaArmed: boolean,
        public readonly hasMemory: boolean,
        public readonly casEnabled: boolean,
        public readonly complexNumbersEnabled: boolean,
        public readonly bigIntSupported: boolean,
    ) {}

    public get angleModeLabel(): string {
        switch (this.angleMode) {
            case AngleMode.RAD:
                return "RAD";
            case AngleMode.GON:
                return "GON";
            default:
                return "DEG";
        }
    }
}
