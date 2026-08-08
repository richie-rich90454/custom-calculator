import { describe, expect, it } from "vitest";
import { AngleMode } from "../model/AngleMode";
import { DefaultAngleConversionService } from "./DefaultAngleConversionService";

describe("DefaultAngleConversionService", () => {
    const service = new DefaultAngleConversionService();

    it("converts degrees to radians correctly", () => {
        expect(service.convertToRadians(180, AngleMode.DEG)).toBeCloseTo(Math.PI, 12);
        expect(service.convertToRadians(90, AngleMode.DEG)).toBeCloseTo(Math.PI / 2, 12);
    });

    it("converts radians to degrees correctly", () => {
        expect(service.convertFromRadians(Math.PI, AngleMode.DEG)).toBeCloseTo(180, 12);
        expect(service.convertFromRadians(Math.PI / 2, AngleMode.DEG)).toBeCloseTo(90, 12);
    });

    it("converts gons to radians correctly", () => {
        expect(service.convertToRadians(200, AngleMode.GON)).toBeCloseTo(Math.PI, 12);
        expect(service.convertToRadians(100, AngleMode.GON)).toBeCloseTo(Math.PI / 2, 12);
    });

    it("converts radians to gons correctly", () => {
        expect(service.convertFromRadians(Math.PI, AngleMode.GON)).toBeCloseTo(200, 12);
        expect(service.convertFromRadians(Math.PI / 2, AngleMode.GON)).toBeCloseTo(100, 12);
    });

    it("leaves radian values unchanged", () => {
        expect(service.convertToRadians(1.25, AngleMode.RAD)).toBeCloseTo(1.25, 12);
        expect(service.convertFromRadians(1.25, AngleMode.RAD)).toBeCloseTo(1.25, 12);
    });
});
