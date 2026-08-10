import type {
    StatisticsSummary,
    StatisticsSummaryResult,
    StatisticsSummaryService,
} from "./StatisticsSummaryService";

/**
 * One-variable descriptive statistics.
 *
 * Formulas: mean = sum(x)/n; population sigma = sqrt(sum((x-mean)^2)/n);
 * sample sigma = sqrt(sum((x-mean)^2)/(n-1)).
 */
export class DefaultStatisticsSummaryService implements StatisticsSummaryService {
    public summarize(data: readonly number[]): StatisticsSummaryResult {
        if (data.length === 0) {
            return { summary: null, errorMessage: "Enter at least one data value." };
        }

        if (data.length < 2) {
            return {
                summary: null,
                errorMessage: "Sample standard deviation needs at least two values.",
            };
        }

        const count = data.length;
        const sumX = data.reduce((total, value) => total + value, 0);
        const sumX2 = data.reduce((total, value) => total + value * value, 0);
        const mean = sumX / count;

        const squaredDeviations = data.reduce(
            (total, value) => total + (value - mean) * (value - mean),
            0,
        );

        const populationSigma = Math.sqrt(squaredDeviations / count);
        const sampleSigma = Math.sqrt(squaredDeviations / (count - 1));

        const summary: StatisticsSummary = {
            count,
            sumX,
            sumX2,
            mean,
            populationSigma,
            sampleSigma,
            min: Math.min(...data),
            max: Math.max(...data),
        };

        return { summary, errorMessage: null };
    }
}
