import { CalculusOperationKind } from "./CalculusOperationKind";

export interface CalculusOperationDefinition {
  readonly functionName: string;
  readonly operationKind: CalculusOperationKind;
  readonly label: string;
  readonly ariaLabel: string;
  readonly invocationText: string;
  readonly description: string;
}

export interface CalculusOperationCatalogService {
  getOperationNames(): readonly string[];
  hasOperation(functionName: string): boolean;
  getOperations(): readonly CalculusOperationDefinition[];
}
