import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { ModifierLayerState } from "../../domain/model/ModifierLayerState";

export interface ModifierLayerConsumption {
    readonly armedLayer: ModifierLayer;
    readonly nextState: ModifierLayerState;
}

/**
 * Manages the sticky SHIFT and sticky ALPHA modifier layers.
 *
 * The service is stateless: callers hold the current {@link ModifierLayerState}
 * and pass it in, which keeps the transition rules pure and unit testable.
 */
export interface ModifierLayerService {
    armShift(current: ModifierLayerState): ModifierLayerState;
    armAlpha(current: ModifierLayerState): ModifierLayerState;
    disarm(): ModifierLayerState;
    /**
     * Returns the armed layer (or NONE) and disarms the layer so the next
     * keycap press starts from the primary layer.
     */
    consume(current: ModifierLayerState): ModifierLayerConsumption;
}
