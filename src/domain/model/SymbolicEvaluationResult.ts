import { EvaluationResult } from "./EvaluationResult";

export class SymbolicEvaluationResult extends EvaluationResult {
    public constructor(
        public readonly symbolicText: string,
        public readonly latexText: string,
        public readonly displayText: string,
    ) {
        super(symbolicText, displayText, symbolicText);
    }
}
