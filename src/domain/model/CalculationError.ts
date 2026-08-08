import { CalculationErrorCode } from "./CalculationErrorCode";

export class CalculationError extends Error {
  public constructor(
    public readonly code: CalculationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "CalculationError";
  }
}
