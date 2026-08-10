export type TemperatureUnit = "C" | "F" | "K" | "R";

export interface TemperatureConversionPolicy {
    convert(value: number, from: TemperatureUnit, to: TemperatureUnit): number;
}
