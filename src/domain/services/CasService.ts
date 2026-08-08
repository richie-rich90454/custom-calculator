export interface CasService {
  simplifyExpression(expressionText: string): string;
  expandExpression(expressionText: string): string;
  differentiateExpression(
    expressionText: string,
    variableName: string
  ): string;
}
