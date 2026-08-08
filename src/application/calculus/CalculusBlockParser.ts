import type { CalculusBlockDescriptor } from "./CalculusBlockDescriptor";

export interface CalculusBlockParser {
  parseBlock(expressionText: string): CalculusBlockDescriptor | null;
}
