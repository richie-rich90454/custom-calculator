import { ScientificConstantCategory } from "./ScientificConstantCategory";

export class ScientificConstant {
    public constructor(
        public readonly id: string,
        public readonly symbol: string,
        public readonly name: string,
        public readonly category: ScientificConstantCategory,
        public readonly value: string,
        public readonly unit: string | null,
        public readonly description: string,
        public readonly source: string,
        public readonly aliases: readonly string[],
    ) {}
}
