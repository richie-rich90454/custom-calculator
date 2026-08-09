import type { MathJsInstance } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type {
    ResultFormatConversion,
    ResultFormatGateway,
} from "../../domain/services/ResultFormatGateway";

const EXACTNESS_TOLERANCE = 1e-9;
const MAX_SIMPLE_DENOMINATOR = 1e9;
const DISPLAY_PRECISION = 15;
const FRACTION_INPUT_PRECISION = 12;
const ENGINEERING_MANTISSA_DIGITS = 6;

export class MathJsResultFormatGateway implements ResultFormatGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public toFractionText(value: unknown): ResultFormatConversion {
        const math = this.instanceProvider.getInstance();
        const valueString = math.format(value, { precision: FRACTION_INPUT_PRECISION });

        if (valueString.includes("e")) {
            return { text: math.format(value, { precision: DISPLAY_PRECISION }), isExact: false };
        }

        let fraction;
        try {
            fraction = math.fraction(valueString);
        } catch {
            return { text: math.format(value, { precision: DISPLAY_PRECISION }), isExact: false };
        }

        const text = math.format(fraction, { fraction: "ratio" });
        const isExact = this.isExactFraction(math, fraction, value);

        return { text: text, isExact: isExact };
    }

    public toDecimalText(value: unknown): ResultFormatConversion {
        const math = this.instanceProvider.getInstance();

        return {
            text: math.format(math.number(value as number), { precision: DISPLAY_PRECISION }),
            isExact: true,
        };
    }

    public toEngineeringText(value: unknown): string {
        const math = this.instanceProvider.getInstance();
        const numericValue = Number(math.number(value as number));

        if (!Number.isFinite(numericValue) || numericValue === 0) {
            return math.format(value, { precision: DISPLAY_PRECISION });
        }

        const magnitudeExponent = Math.floor(Math.log10(Math.abs(numericValue)));
        const engineeringExponent = Math.floor(magnitudeExponent / 3) * 3;
        const mantissa = numericValue / Math.pow(10, engineeringExponent);
        const formattedMantissa = math.format(mantissa, { precision: ENGINEERING_MANTISSA_DIGITS });

        return `${formattedMantissa}×10^${engineeringExponent}`;
    }

    public toFixedText(value: unknown, decimalPlaces: number): string {
        const math = this.instanceProvider.getInstance();

        return math.format(value, { notation: "fixed", precision: decimalPlaces });
    }

    public toSignificantText(value: unknown, digits: number): string {
        const math = this.instanceProvider.getInstance();

        return math.format(value, { precision: digits });
    }

    private isExactFraction(math: MathJsInstance, fraction: unknown, value: unknown): boolean {
        const fractionObject = fraction as { n: number; d: number };
        const denominator = Number(math.number(fractionObject.d));

        if (denominator === 0 || denominator > MAX_SIMPLE_DENOMINATOR) {
            return false;
        }

        const numerator = Number(math.number(fractionObject.n));
        const originalValue = Number(math.number(value as number));
        const reconstructed = numerator / denominator;

        return (
            Math.abs(reconstructed - originalValue) <=
            EXACTNESS_TOLERANCE * Math.max(1, Math.abs(originalValue))
        );
    }
}
