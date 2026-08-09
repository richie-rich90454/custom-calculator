import type {
    BaseNBase,
    BaseNWordSize,
    BigIntBaseNArithmeticService,
} from "./BigIntBaseNArithmeticService";

/**
 * Base-N arithmetic over BigInt with two's-complement word masking.
 *
 * Negative values are stored as their two's-complement offset within the
 * active word size, so every stored value is a non-negative BigInt in
 * [0, 2^wordSize). Rendering masks to the word width and groups binary.
 */
export class DefaultBigIntBaseNArithmeticService implements BigIntBaseNArithmeticService {
    public toBase(value: bigint, base: BaseNBase, wordSize: BaseNWordSize): string {
        const masked = this.mask(value, wordSize);
        const digits: string[] = [];

        if (masked === 0n) {
            return "0";
        }

        let remainder = masked;

        while (remainder > 0n) {
            digits.push(this.digitToCharacter(remainder % BigInt(base)));
            remainder /= BigInt(base);
        }

        const text = digits.reverse().join("");

        if (base === 2) {
            return this.groupBinary(text, wordSize);
        }

        return text;
    }

    public parse(text: string, base: BaseNBase, wordSize: BaseNWordSize): bigint {
        const cleaned = text.trim().toLowerCase();

        if (cleaned === "" || cleaned === "-" || cleaned === "+") {
            return 0n;
        }

        const negative = cleaned.startsWith("-");
        const unsignedText = negative ? cleaned.slice(1) : cleaned;

        let magnitude = 0n;
        const radix = BigInt(base);

        for (const character of unsignedText) {
            const digit = this.characterToDigit(character);

            if (digit === null || digit >= base) {
                return 0n;
            }

            magnitude = magnitude * radix + BigInt(digit);
        }

        const signed = negative ? -magnitude : magnitude;
        return this.mask(signed, wordSize);
    }

    public add(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(a + b, wordSize);
    }

    public and(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(a & b, wordSize);
    }

    public or(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(a | b, wordSize);
    }

    public xor(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(a ^ b, wordSize);
    }

    public not(a: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(~a, wordSize);
    }

    public neg(a: bigint, wordSize: BaseNWordSize): bigint {
        return this.mask(-a, wordSize);
    }

    private mask(value: bigint, wordSize: BaseNWordSize): bigint {
        return value & ((1n << BigInt(wordSize)) - 1n);
    }

    private digitToCharacter(digit: bigint): string {
        return Number(digit).toString(16).toUpperCase();
    }

    private characterToDigit(character: string): number | null {
        const digit = Number.parseInt(character, 16);

        return Number.isNaN(digit) ? null : digit;
    }

    private groupBinary(text: string, wordSize: BaseNWordSize): string {
        const padded = text.padStart(wordSize, "0");

        return padded.match(/.{1,8}/g)!.join(" ");
    }
}
