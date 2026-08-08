import { CasOperationKind } from "./CasOperationKind";
import type { CasBlockDescriptor } from "./CasBlockDescriptor";
import type { CasExpressionRouterService, CasRouteResolution } from "./CasExpressionRouterService";
import type { CasService } from "../../domain/services/CasService";

/**
 * Executes a parsed cas(...) block against the configured CAS service.
 *
 * Routing happens before numeric evaluation so symbolic expressions never
 * reach the numeric gateway. When CAS is disabled every block resolves to a
 * clear inline error instead of being silently evaluated or ignored.
 */
export class DefaultCasExpressionRouterService
  implements CasExpressionRouterService
{
  private static readonly CAS_DISABLED_ERROR_TEXT = "CAS is disabled.";

  public routeBlock(
    blockDescriptor: CasBlockDescriptor,
    casEnabled: boolean,
    casService: CasService
  ): CasRouteResolution {
    if (!casEnabled) {
      return {
        routed: true,
        resultText: null,
        errorText: DefaultCasExpressionRouterService.CAS_DISABLED_ERROR_TEXT,
      };
    }

    try {
      const resultText = this.executeOperation(blockDescriptor, casService);

      return {
        routed: true,
        resultText: resultText,
        errorText: null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        routed: true,
        resultText: null,
        errorText: message,
      };
    }
  }

  private executeOperation(
    blockDescriptor: CasBlockDescriptor,
    casService: CasService
  ): string {
    switch (blockDescriptor.operationKind) {
      case CasOperationKind.SIMPLIFY:
        return casService.simplifyExpression(
          blockDescriptor.innerExpressionText
        );
      case CasOperationKind.EXPAND:
        return casService.expandExpression(blockDescriptor.innerExpressionText);
      case CasOperationKind.DERIVATIVE:
        return casService.differentiateExpression(
          blockDescriptor.innerExpressionText,
          blockDescriptor.derivativeVariableName ?? "x"
        );
      default:
        return casService.simplifyExpression(
          blockDescriptor.innerExpressionText
        );
    }
  }
}
