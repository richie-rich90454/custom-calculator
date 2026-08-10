import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type {
    UnitConversionGateway,
    UnitConversionResult,
} from "../../domain/services/UnitConversionGateway";

/**
 * Unit conversion gateway backed by the math.js unit engine.
 *
 * math.js raises an error for incompatible units; the gateway turns that into
 * a thrown error with a clear message so callers can surface it.
 */
export class MathJsUnitConversionGateway implements UnitConversionGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public convert(value: number, fromUnit: string, toUnit: string): UnitConversionResult {
        const math = this.instanceProvider.getInstance();
        const quantity = math.unit(value, fromUnit);

        let converted;
        try {
            converted = quantity.to(toUnit);
        } catch {
            throw new Error(`Cannot convert ${fromUnit} to ${toUnit}.`);
        }

        const convertedValue = math.number(converted.toNumeric());
        const text = `${formatValue(convertedValue)} ${toUnit}`;

        return { value: convertedValue, text };
    }
}

function formatValue(value: number): string {
    return Object.is(value, -0) ? "0" : String(Math.round(value * 1e12) / 1e12);
}
