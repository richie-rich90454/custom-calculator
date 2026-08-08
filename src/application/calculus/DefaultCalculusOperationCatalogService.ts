import { CalculusOperationKind } from "./CalculusOperationKind";
import type {
  CalculusOperationCatalogService,
  CalculusOperationDefinition,
} from "./CalculusOperationCatalogService";

export class DefaultCalculusOperationCatalogService
  implements CalculusOperationCatalogService
{
  private static readonly OPERATIONS: readonly CalculusOperationDefinition[] = [
    {
      functionName: "derivative",
      operationKind: CalculusOperationKind.DERIVATIVE,
      label: "d/dx",
      ariaLabel: "Insert symbolic derivative block",
      invocationText: "derivative(",
      description:
        "Differentiates the wrapped expression symbolically with respect to a variable.",
    },
    {
      functionName: "numericDerivative",
      operationKind: CalculusOperationKind.NUMERIC_DERIVATIVE,
      label: "d/dx|",
      ariaLabel: "Insert numeric derivative block",
      invocationText: "numericDerivative(",
      description:
        "Approximates the derivative of the wrapped expression numerically at a point.",
    },
    {
      functionName: "integral",
      operationKind: CalculusOperationKind.INTEGRAL,
      label: "∫",
      ariaLabel: "Insert definite integral block",
      invocationText: "integral(",
      description:
        "Computes the definite integral of the wrapped expression between two bounds.",
    },
    {
      functionName: "integrate",
      operationKind: CalculusOperationKind.INTEGRATE,
      label: "∫dx",
      ariaLabel: "Insert symbolic antiderivative block",
      invocationText: "integrate(",
      description:
        "Computes the symbolic antiderivative of the wrapped expression with respect to a variable.",
    },
    {
      functionName: "limit",
      operationKind: CalculusOperationKind.LIMIT,
      label: "lim",
      ariaLabel: "Insert limit block",
      invocationText: "limit(",
      description:
        "Estimates the limit of the wrapped expression as a variable approaches a target.",
    },
    {
      functionName: "taylor",
      operationKind: CalculusOperationKind.TAYLOR,
      label: "Tₙ",
      ariaLabel: "Insert Taylor series block",
      invocationText: "taylor(",
      description:
        "Expands the wrapped expression into a Taylor series about a center to a given order.",
    },
    {
      functionName: "sum",
      operationKind: CalculusOperationKind.SUM,
      label: "Σ",
      ariaLabel: "Insert finite summation block",
      invocationText: "sum(",
      description:
        "Sums the wrapped expression over an integer range.",
    },
    {
      functionName: "product",
      operationKind: CalculusOperationKind.PRODUCT,
      label: "∏",
      ariaLabel: "Insert finite product block",
      invocationText: "product(",
      description:
        "Multiplies the wrapped expression over an integer range.",
    },
  ];

  private readonly operationNames: readonly string[];

  public constructor() {
    this.operationNames = DefaultCalculusOperationCatalogService.OPERATIONS.map(
      (operation) => operation.functionName
    );
  }

  public getOperationNames(): readonly string[] {
    return this.operationNames;
  }

  public hasOperation(functionName: string): boolean {
    return this.operationNames.includes(functionName);
  }

  public getOperations(): readonly CalculusOperationDefinition[] {
    return DefaultCalculusOperationCatalogService.OPERATIONS;
  }
}
