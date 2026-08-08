import { NumericMode } from "./NumericMode";

export class VariableAssignment {
  public constructor(
    public readonly name: string,
    public readonly valueText: string,
    public readonly numericMode: NumericMode,
    public readonly updatedAt: string
  ) {}
}
