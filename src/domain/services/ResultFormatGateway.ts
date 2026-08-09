/**
 * A formatted result value with an exactness flag.
 *
 * The flag lets the UI show an approximate indicator when a conversion is a
 * numerical approximation rather than an exact value.
 */
export interface ResultFormatConversion {
    readonly text: string;
    readonly isExact: boolean;
}

/**
 * Gateway that performs value conversions through the math.js instance.
 *
 * The domain result format service depends on this interface so the math.js
 * dependency stays confined to the infrastructure layer.
 */
export interface ResultFormatGateway {
    toFractionText(value: unknown): ResultFormatConversion;
    toDecimalText(value: unknown): ResultFormatConversion;
    toEngineeringText(value: unknown): string;
    toFixedText(value: unknown, decimalPlaces: number): string;
    toSignificantText(value: unknown, digits: number): string;
}
