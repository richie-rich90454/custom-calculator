import { ModifierLayer } from "./ModifierLayer";

/**
 * Immutable snapshot of the armed modifier layer.
 *
 * Sticky SHIFT and sticky ALPHA are mutually exclusive: arming one disarms
 * the other. The armed layer is consumed by the next keycap press, so the
 * value object only ever represents a single armed layer or none.
 */
export class ModifierLayerState {
    private constructor(public readonly armedLayer: ModifierLayer) {}

    public static readonly NONE: ModifierLayerState = new ModifierLayerState(ModifierLayer.NONE);

    public static armed(layer: ModifierLayer): ModifierLayerState {
        return new ModifierLayerState(layer);
    }

    public isArmed(): boolean {
        return this.armedLayer !== ModifierLayer.NONE;
    }

    public isShiftArmed(): boolean {
        return this.armedLayer === ModifierLayer.SHIFT;
    }

    public isAlphaArmed(): boolean {
        return this.armedLayer === ModifierLayer.ALPHA;
    }

    /**
     * Arms a layer, disarming the other layer when it is active.
     */
    public arm(layer: ModifierLayer): ModifierLayerState {
        if (layer === ModifierLayer.NONE) {
            return ModifierLayerState.NONE;
        }

        return ModifierLayerState.armed(layer);
    }

    public disarm(): ModifierLayerState {
        return ModifierLayerState.NONE;
    }
}
