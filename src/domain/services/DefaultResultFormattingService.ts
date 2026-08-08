import { CalculationError } from "../model/CalculationError";
import { CalculationErrorCode } from "../model/CalculationErrorCode";
import type { ResultFormattingService } from "./ResultFormattingService";

export class DefaultResultFormattingService
  implements ResultFormattingService
{
  private static readonly SIGNIFICANT_DIGITS = 15;
  private static readonly SCIENTIFIC_NOTATION_UPPER_BOUND = 1e15;
  private static readonly SCIENTIFIC_NOTATION_LOWER_BOUND = 1e-9;

  public formatNumber(value: number): string {
    if (!this.isFiniteNumber(value)) {
      throw new CalculationError(
        CalculationErrorCode.OVERFLOW,
        "Result is too large or undefined to display."
      );
    }

    if (value === 0) {
      return "0";
    }

    const absoluteValue = Math.abs(value);

    if (
      absoluteValue >=
        DefaultResultFormattingService.SCIENTIFIC_NOTATION_UPPER_BOUND ||
      absoluteValue <
        DefaultResultFormattingService.SCIENTIFIC_NOTATION_LOWER_BOUND
    ) {
      return this.formatScientificNotation(value);
    }

    const noiseFreeValue = Number(
      value.toPrecision(DefaultResultFormattingService.SIGNIFICANT_DIGITS)
    );

    return String(noiseFreeValue);
  }

  public normalizeResultText(rawResultText: string): string {
    return rawResultText.replace(/\s+/g, "");
  }

  public isFiniteNumber(value: number): boolean {
    return Number.isFinite(value);
  }

  private formatScientificNotation(value: number): string {
    const parts = value.toExponential(10).split("e");
    const mantissa = parts[0]!;
    const exponent = parts[1]!;

    const trimmedMantissa = Number(mantissa).toString();

    return `${trimmedMantissa}e${exponent}`;
  }
}
