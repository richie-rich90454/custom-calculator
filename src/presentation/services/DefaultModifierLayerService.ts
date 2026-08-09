import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { ModifierLayerState } from "../../domain/model/ModifierLayerState";
import type { ModifierLayerConsumption, ModifierLayerService } from "./ModifierLayerService";

export class DefaultModifierLayerService implements ModifierLayerService {
    public armShift(current: ModifierLayerState): ModifierLayerState {
        return current.arm(ModifierLayer.SHIFT);
    }

    public armAlpha(current: ModifierLayerState): ModifierLayerState {
        return current.arm(ModifierLayer.ALPHA);
    }

    public disarm(): ModifierLayerState {
        return ModifierLayerState.NONE;
    }

    public consume(current: ModifierLayerState): ModifierLayerConsumption {
        const armedLayer = current.armedLayer;
        return { armedLayer: armedLayer, nextState: ModifierLayerState.NONE };
    }
}
