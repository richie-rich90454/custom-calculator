import { AngleMode } from "../../domain/model/AngleMode";
import type { ResultFormattingService } from "../../domain/services/ResultFormattingService";
import { CalculusOperationKind } from "./CalculusOperationKind";
import { CalculusAngleModePolicy } from "./CalculusAngleModePolicy";
import type { CalculusBlockDescriptor } from "./CalculusBlockDescriptor";
import type { CalculusAngleModePolicyService } from "./CalculusAngleModePolicyService";
import type {
    CalculusExpressionRouterService,
    CalculusRouteResolution,
} from "./CalculusExpressionRouterService";
import type { NumericDifferentiationService } from "./NumericDifferentiationService";
import type { NumericIntegrationService } from "./NumericIntegrationService";
import type { LimitEstimationService } from "./LimitEstimationService";
import type { FiniteSummationService } from "./FiniteSummationService";
import type { FiniteProductService } from "./FiniteProductService";
import type { SymbolicDifferentiationService } from "./SymbolicDifferentiationService";
import type { SymbolicIntegrationService } from "./SymbolicIntegrationService";
import type { TaylorSeriesService } from "./TaylorSeriesService";

const SYMBOLIC_OPERATION_KINDS = new Set<CalculusOperationKind>([
    CalculusOperationKind.DERIVATIVE,
    CalculusOperationKind.INTEGRATE,
    CalculusOperationKind.TAYLOR,
]);

/**
 * Executes a parsed calculus(...) block against the configured numeric or
 * symbolic calculus service, keeping symbolic expressions out of the numeric
 * gateway.
 *
 * Symbolic operations use the RADIANS_ONLY policy so the active angle mode
 * never leaks a conversion factor into a symbolic result; a warning is
 * returned instead when the angle mode is not radians.
 */
export class DefaultCalculusExpressionRouterService implements CalculusExpressionRouterService {
    public constructor(
        private readonly numericDifferentiationService: NumericDifferentiationService,
        private readonly numericIntegrationService: NumericIntegrationService,
        private readonly limitEstimationService: LimitEstimationService,
        private readonly finiteSummationService: FiniteSummationService,
        private readonly finiteProductService: FiniteProductService,
        private readonly symbolicDifferentiationService: SymbolicDifferentiationService,
        private readonly symbolicIntegrationService: SymbolicIntegrationService,
        private readonly taylorSeriesService: TaylorSeriesService,
        private readonly angleModePolicyService: CalculusAngleModePolicyService,
        private readonly resultFormattingService: ResultFormattingService,
    ) {}

    public routeBlock(
        blockDescriptor: CalculusBlockDescriptor,
        angleMode: AngleMode,
    ): CalculusRouteResolution {
        try {
            const resultText = this.executeOperation(blockDescriptor, angleMode);

            return {
                routed: true,
                resultText: resultText,
                errorText: null,
                warningText: this.resolveWarning(blockDescriptor, angleMode),
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            return {
                routed: true,
                resultText: null,
                errorText: message,
                warningText: null,
            };
        }
    }

    private resolveWarning(
        blockDescriptor: CalculusBlockDescriptor,
        angleMode: AngleMode,
    ): string | null {
        if (!SYMBOLIC_OPERATION_KINDS.has(blockDescriptor.operationKind)) {
            return null;
        }

        return this.angleModePolicyService.resolveSymbolicAngleWarning(
            angleMode,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );
    }

    private executeOperation(
        blockDescriptor: CalculusBlockDescriptor,
        angleMode: AngleMode,
    ): string {
        switch (blockDescriptor.operationKind) {
            case CalculusOperationKind.DERIVATIVE:
                return this.symbolicDifferentiationService.differentiateSymbolically(
                    blockDescriptor.innerExpressionText,
                    blockDescriptor.variableName,
                    angleMode,
                    CalculusAngleModePolicy.RADIANS_ONLY,
                );
            case CalculusOperationKind.NUMERIC_DERIVATIVE:
                return this.formatNumericResult(
                    this.numericDifferentiationService.estimateDerivative(
                        blockDescriptor.innerExpressionText,
                        blockDescriptor.variableName,
                        blockDescriptor.limitTarget ?? 0,
                        angleMode,
                    ),
                );
            case CalculusOperationKind.INTEGRAL:
                return this.formatNumericResult(
                    this.numericIntegrationService.integrate(
                        blockDescriptor.innerExpressionText,
                        blockDescriptor.variableName,
                        blockDescriptor.lowerBound ?? 0,
                        blockDescriptor.upperBound ?? 0,
                        angleMode,
                    ),
                );
            case CalculusOperationKind.INTEGRATE:
                return this.symbolicIntegrationService.integrateSymbolically(
                    blockDescriptor.innerExpressionText,
                    blockDescriptor.variableName,
                );
            case CalculusOperationKind.LIMIT:
                return this.formatLimitResult(
                    this.limitEstimationService.estimateLimit(
                        blockDescriptor.innerExpressionText,
                        blockDescriptor.variableName,
                        blockDescriptor.limitTarget ?? 0,
                        blockDescriptor.limitDirection,
                        angleMode,
                    ),
                );
            case CalculusOperationKind.TAYLOR:
                return this.taylorSeriesService.expand(
                    blockDescriptor.innerExpressionText,
                    blockDescriptor.variableName,
                    blockDescriptor.center ?? 0,
                    blockDescriptor.order ?? 0,
                    angleMode,
                    CalculusAngleModePolicy.RADIANS_ONLY,
                );
            case CalculusOperationKind.SUM:
                return this.formatNumericResult(
                    this.finiteSummationService.sum(
                        blockDescriptor.innerExpressionText,
                        blockDescriptor.variableName,
                        blockDescriptor.lowerBound ?? 0,
                        blockDescriptor.upperBound ?? 0,
                        angleMode,
                    ),
                );
            case CalculusOperationKind.PRODUCT:
                return this.formatNumericResult(
                    this.finiteProductService.product(
                        blockDescriptor.innerExpressionText,
                        blockDescriptor.variableName,
                        blockDescriptor.lowerBound ?? 0,
                        blockDescriptor.upperBound ?? 0,
                        angleMode,
                    ),
                );
            default:
                return this.symbolicDifferentiationService.differentiateSymbolically(
                    blockDescriptor.innerExpressionText,
                    blockDescriptor.variableName,
                    angleMode,
                    CalculusAngleModePolicy.RADIANS_ONLY,
                );
        }
    }

    private formatNumericResult(value: number): string {
        return this.resultFormattingService.formatNumber(value);
    }

    private formatLimitResult(
        estimate:
            | { readonly kind: "FINITE"; readonly value: number }
            | { readonly kind: "INFINITY"; readonly sign: 1 | -1 },
    ): string {
        if (estimate.kind === "FINITE") {
            return this.formatNumericResult(estimate.value);
        }

        return estimate.sign < 0 ? "-∞" : "∞";
    }
}
