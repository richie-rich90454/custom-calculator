export enum ScientificFunctionCategory {
    TRIGONOMETRIC = "TRIGONOMETRIC",
    INVERSE_TRIGONOMETRIC = "INVERSE_TRIGONOMETRIC",
    HYPERBOLIC = "HYPERBOLIC",
    INVERSE_HYPERBOLIC = "INVERSE_HYPERBOLIC",
    LOGARITHMIC = "LOGARITHMIC",
    POWER_AND_ROOT = "POWER_AND_ROOT",
    ROUNDING = "ROUNDING",
    ARITHMETIC = "ARITHMETIC",
}

export class ScientificFunctionDefinition {
    public constructor(
        public readonly name: string,
        public readonly displayLabel: string,
        public readonly description: string,
        public readonly category: ScientificFunctionCategory,
        public readonly minimumArgumentCount: number,
        public readonly maximumArgumentCount: number,
    ) {}

    public get isVariadic(): boolean {
        return this.maximumArgumentCount > this.minimumArgumentCount;
    }
}
