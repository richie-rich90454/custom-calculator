import type { MathJsInstance } from "mathjs";

export interface MathJsFractionValueFactory {
  createFractionFromValueText(
    math: MathJsInstance,
    valueText: string
  ): unknown;
}

/**
 * Builds exact Fraction values from decimal value text.
 *
 * math.js converts a JavaScript number into a Fraction by rationalizing the
 * binary floating point representation, which is extremely slow for tiny or
 * enormous magnitudes (for example 6.6743e-11). Parsing the original decimal
 * string instead is both fast and exact, so this factory expands exponent
 * notation into a plain decimal string before delegating to math.js.
 */
export class DefaultMathJsFractionValueFactory
  implements MathJsFractionValueFactory
{
  private static readonly EXPONENT_NOTATION_PATTERN =
    /^([+-]?)(\d*)(?:\.(\d*))?[eE]([+-]?\d+)$/;

  public createFractionFromValueText(
    math: MathJsInstance,
    valueText: string
  ): unknown {
    return math.fraction(this.expandExponentNotation(valueText));
  }

  public expandExponentNotation(valueText: string): string {
    const match = DefaultMathJsFractionValueFactory.EXPONENT_NOTATION_PATTERN.exec(
      valueText.trim()
    );

    if (match === null) {
      return valueText;
    }

    const sign = match[1] ?? "";
    const integerPart = match[2] ?? "";
    const fractionalPart = match[3] ?? "";
    const exponent = Number.parseInt(match[4] ?? "0", 10);

    const digits = integerPart + fractionalPart;
    const decimalPointIndex = integerPart.length + exponent;

    const plainText =
      decimalPointIndex <= 0
        ? `0.${"0".repeat(-decimalPointIndex)}${digits}`
        : decimalPointIndex >= digits.length
          ? `${digits}${"0".repeat(decimalPointIndex - digits.length)}`
          : `${digits.slice(0, decimalPointIndex)}.${digits.slice(decimalPointIndex)}`;

    return `${sign}${plainText}`;
  }
}
