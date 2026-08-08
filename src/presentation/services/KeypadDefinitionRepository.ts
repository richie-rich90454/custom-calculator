import type { CalculatorKeyDefinition } from "./CalculatorKeyDefinition";

export interface KeypadDefinitionRepository {
  getScientificFunctionKeys(): readonly CalculatorKeyDefinition[];
  getCoreKeys(): readonly CalculatorKeyDefinition[];
  getCasOperationKeys(): readonly CalculatorKeyDefinition[];
}
