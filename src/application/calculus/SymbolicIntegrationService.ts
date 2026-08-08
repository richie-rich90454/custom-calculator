export interface SymbolicIntegrationService {
  integrateSymbolically(
    expressionText: string,
    variableName: string
  ): string;
}
