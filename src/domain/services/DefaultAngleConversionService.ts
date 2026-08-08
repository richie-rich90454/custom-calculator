import { AngleMode } from "../model/AngleMode";
import type { AngleConversionService } from "./AngleConversionService";

export abstract class AbstractAngleConversionService implements AngleConversionService {
    public abstract convertToRadians(value: number, angleMode: AngleMode): number;

    public abstract convertFromRadians(value: number, angleMode: AngleMode): number;
}

export class DefaultAngleConversionService extends AbstractAngleConversionService {
    public override convertToRadians(value: number, angleMode: AngleMode): number {
        if (angleMode === AngleMode.DEG) {
            return (value * Math.PI) / 180;
        }

        if (angleMode === AngleMode.GON) {
            return (value * Math.PI) / 200;
        }

        return value;
    }

    public override convertFromRadians(value: number, angleMode: AngleMode): number {
        if (angleMode === AngleMode.DEG) {
            return (value * 180) / Math.PI;
        }

        if (angleMode === AngleMode.GON) {
            return (value * 200) / Math.PI;
        }

        return value;
    }
}
