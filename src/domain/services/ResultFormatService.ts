import type { ResultFormatConversion, ResultFormatGateway } from "./ResultFormatGateway";

/**
 * Orchestrates display result conversions for the S-D, ENG, and FIX/SCI keys.
 *
 * The service stays value oriented: callers pass the raw result value and
 * receive formatted text plus an exactness flag for the approximate
 * indicator.
 */
export interface ResultFormatService {
    convertToFraction(value: unknown): ResultFormatConversion;
    convertToDecimal(value: unknown): ResultFormatConversion;
    formatEngineering(value: unknown): string;
    formatFixed(value: unknown, decimalPlaces: number): string;
    formatSignificant(value: unknown, digits: number): string;
}

export class DefaultResultFormatService implements ResultFormatService {
    public constructor(private readonly gateway: ResultFormatGateway) {}

    public convertToFraction(value: unknown): ResultFormatConversion {
        return this.gateway.toFractionText(value);
    }

    public convertToDecimal(value: unknown): ResultFormatConversion {
        return this.gateway.toDecimalText(value);
    }

    public formatEngineering(value: unknown): string {
        return this.gateway.toEngineeringText(value);
    }

    public formatFixed(value: unknown, decimalPlaces: number): string {
        return this.gateway.toFixedText(value, decimalPlaces);
    }

    public formatSignificant(value: unknown, digits: number): string {
        return this.gateway.toSignificantText(value, digits);
    }
}
