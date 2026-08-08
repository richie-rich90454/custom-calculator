import { CasOperationKind } from "./CasOperationKind";

export interface CasOperationDefinition {
  readonly functionName: string;
  readonly operationKind: CasOperationKind;
  readonly label: string;
  readonly ariaLabel: string;
  readonly invocationText: string;
  readonly description: string;
}

export interface CasOperationCatalogService {
  getOperationNames(): readonly string[];
  hasOperation(functionName: string): boolean;
  getOperations(): readonly CasOperationDefinition[];
}
