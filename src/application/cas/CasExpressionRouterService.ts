import type { CasBlockDescriptor } from "./CasBlockDescriptor";
import type { CasService } from "../../domain/services/CasService";

export interface CasRouteResolution {
    readonly routed: boolean;
    readonly resultText: string | null;
    readonly errorText: string | null;
}

export interface CasExpressionRouterService {
    routeBlock(
        blockDescriptor: CasBlockDescriptor,
        casEnabled: boolean,
        casService: CasService,
    ): CasRouteResolution;
}
