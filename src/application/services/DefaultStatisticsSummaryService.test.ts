import { describe, expect, it } from "vitest";
import { DefaultStatisticsSummaryService } from "./DefaultStatisticsSummaryService";

describe("DefaultStatisticsSummaryService", () => {
    const service = new DefaultStatisticsSummaryService();

    it("summarizes a one-variable data set", () => {
        const result = service.summarize([1, 2, 3, 4, 5]);

        expect(result.errorMessage).toBeNull();
        expect(result.summary?.count).toBe(5);
        expect(result.summary?.sumX).toBe(15);
        expect(result.summary?.sumX2).toBe(55);
        expect(result.summary?.mean).toBe(3);
        expect(result.summary?.populationSigma).toBeCloseTo(1.41421, 4);
        expect(result.summary?.sampleSigma).toBeCloseTo(1.58114, 4);
        expect(result.summary?.min).toBe(1);
        expect(result.summary?.max).toBe(5);
    });

    it("reports an error for an empty data set", () => {
        const result = service.summarize([]);

        expect(result.summary).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });

    it("reports an error for a single value", () => {
        const result = service.summarize([7]);

        expect(result.summary).toBeNull();
        expect(result.errorMessage).not.toBeNull();
    });
});
