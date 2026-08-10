export interface UnitConversionResult {
    readonly value: number;
    readonly text: string;
}

/**
 * Converts between compatible units through the math.js instance.
 *
 * Temperature conversions are excluded here and routed to a dedicated
 * policy because they use affine offsets rather than simple scaling.
 */
export interface UnitConversionGateway {
    convert(value: number, fromUnit: string, toUnit: string): UnitConversionResult;
}
