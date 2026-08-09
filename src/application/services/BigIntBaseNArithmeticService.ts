export type BaseNBase = 2 | 8 | 10 | 16;
export type BaseNWordSize = 8 | 16 | 32 | 64;

export interface BigIntBaseNArithmeticService {
    toBase(value: bigint, base: BaseNBase, wordSize: BaseNWordSize): string;
    parse(text: string, base: BaseNBase, wordSize: BaseNWordSize): bigint;
    add(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint;
    and(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint;
    or(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint;
    xor(a: bigint, b: bigint, wordSize: BaseNWordSize): bigint;
    not(a: bigint, wordSize: BaseNWordSize): bigint;
    neg(a: bigint, wordSize: BaseNWordSize): bigint;
}
