import { EvaluationResult } from "./EvaluationResult";

export class NumericEvaluationResult extends EvaluationResult {
    public constructor(
        public readonly numericText: string,
        public readonly numericValue: number,
    ) {
        super(numericText, numericText, numericValue);
    }
}
