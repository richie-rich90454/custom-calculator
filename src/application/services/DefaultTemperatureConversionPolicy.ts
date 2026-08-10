import type { TemperatureConversionPolicy, TemperatureUnit } from "./TemperatureConversionPolicy";

/**
 * Affine temperature conversions between Celsius, Fahrenheit, Kelvin, and
 * Rankine.
 *
 * Conversion goes through Celsius as the common intermediate scale.
 */
export class DefaultTemperatureConversionPolicy implements TemperatureConversionPolicy {
    public convert(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
        const celsius = this.toCelsius(value, from);

        switch (to) {
            case "C":
                return celsius;
            case "F":
                return celsius * (9 / 5) + 32;
            case "K":
                return celsius + 273.15;
            case "R":
                return (celsius + 273.15) * (9 / 5);
        }
    }

    private toCelsius(value: number, from: TemperatureUnit): number {
        switch (from) {
            case "C":
                return value;
            case "F":
                return (value - 32) * (5 / 9);
            case "K":
                return value - 273.15;
            case "R":
                return (value - 491.67) * (5 / 9);
        }
    }
}
