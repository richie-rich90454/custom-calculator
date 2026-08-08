import { CasOperationKind } from "./CasOperationKind";
import type {
  CasOperationCatalogService,
  CasOperationDefinition,
} from "./CasOperationCatalogService";

/**
 * Catalog of the symbolic operations the CAS engine supports.
 *
 * The catalog is the single source of truth for which cas(...) function names
 * are valid, so validation, keyboard insertion, and the main keypad all agree
 * on the supported surface.
 */
export class DefaultCasOperationCatalogService
  implements CasOperationCatalogService
{
  private static readonly OPERATIONS: readonly CasOperationDefinition[] = [
    {
      functionName: "cas",
      operationKind: CasOperationKind.SIMPLIFY,
      label: "CAS",
      ariaLabel: "Insert CAS block",
      invocationText: "cas(",
      description: "Simplifies the wrapped symbolic expression.",
    },
    {
      functionName: "casSimplify",
      operationKind: CasOperationKind.SIMPLIFY,
      label: "simplify",
      ariaLabel: "Insert CAS simplify block",
      invocationText: "casSimplify(",
      description: "Simplifies the wrapped symbolic expression.",
    },
    {
      functionName: "casExpand",
      operationKind: CasOperationKind.EXPAND,
      label: "expand",
      ariaLabel: "Insert CAS expand block",
      invocationText: "casExpand(",
      description: "Expands the wrapped symbolic expression.",
    },
    {
      functionName: "casDerivative",
      operationKind: CasOperationKind.DERIVATIVE,
      label: "derivative",
      ariaLabel: "Insert CAS derivative block",
      invocationText: "casDerivative(",
      description: "Differentiates the wrapped expression with respect to a variable.",
    },
  ];

  private readonly operationNames: readonly string[];

  public constructor() {
    this.operationNames = DefaultCasOperationCatalogService.OPERATIONS.map(
      (operation) => operation.functionName
    );
  }

  public getOperationNames(): readonly string[] {
    return this.operationNames;
  }

  public hasOperation(functionName: string): boolean {
    return this.operationNames.includes(functionName);
  }

  public getOperations(): readonly CasOperationDefinition[] {
    return DefaultCasOperationCatalogService.OPERATIONS;
  }
}
