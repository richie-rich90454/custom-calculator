export class EvaluationResult {
  public constructor(
    public readonly expressionText: string,
    public readonly resultText: string,
    public readonly rawValue: unknown
  ) {}
}
