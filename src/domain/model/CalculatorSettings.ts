import { AngleMode } from "./AngleMode";
import { NumericMode } from "./NumericMode";
import { ThemePreference } from "./ThemePreference";

export class CalculatorSettings {
    public constructor(
        public readonly angleMode: AngleMode,
        public readonly numericMode: NumericMode,
        public readonly complexNumbersEnabled: boolean,
        public readonly casEnabled: boolean,
        public readonly themePreference: ThemePreference,
    ) {}

    public static createDefault(): CalculatorSettings {
        return new CalculatorSettings(
            AngleMode.DEG,
            NumericMode.STANDARD,
            false,
            false,
            ThemePreference.SYSTEM,
        );
    }
}
