import { EvaluationResult } from "./EvaluationResult";

export class FailedEvaluationResult extends EvaluationResult {
  public constructor(
    public readonly failedExpressionText: string,
    public readonly failureMessage: string
  ) {
    super(failedExpressionText, failureMessage, null);
  }
}
