import { AngleMode } from "../../domain/model/AngleMode";
import type { CalculusBlockDescriptor } from "./CalculusBlockDescriptor";

export interface CalculusRouteResolution {
  readonly routed: boolean;
  readonly resultText: string | null;
  readonly errorText: string | null;
  readonly warningText: string | null;
}

export interface CalculusExpressionRouterService {
  routeBlock(
    blockDescriptor: CalculusBlockDescriptor,
    angleMode: AngleMode
  ): CalculusRouteResolution;
}
