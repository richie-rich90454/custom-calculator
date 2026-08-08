import { AngleMode } from "../model/AngleMode";

export interface AngleConversionService {
    convertToRadians(value: number, angleMode: AngleMode): number;
    convertFromRadians(value: number, angleMode: AngleMode): number;
}
