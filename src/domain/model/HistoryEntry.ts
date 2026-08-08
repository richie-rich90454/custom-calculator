import { AngleMode } from "./AngleMode";
import { NumericMode } from "./NumericMode";

export class HistoryEntry {
    public constructor(
        public readonly id: string,
        public readonly expressionText: string,
        public readonly resultText: string,
        public readonly angleMode: AngleMode,
        public readonly numericMode: NumericMode,
        public readonly complexNumbersEnabled: boolean,
        public readonly createdAt: string,
    ) {}
}
