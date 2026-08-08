import { CasOperationKind } from "./CasOperationKind";

/**
 * Describes a parsed cas(...) block found at the top level of an expression.
 *
 * The descriptor carries enough information for the CAS router to invoke the
 * requested symbolic operation on the inner expression.
 */
export interface CasBlockDescriptor {
  readonly operationKind: CasOperationKind;
  readonly innerExpressionText: string;
  readonly derivativeVariableName: string | null;
}
