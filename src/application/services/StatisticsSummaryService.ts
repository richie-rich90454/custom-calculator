export interface StatisticsSummary {
    readonly count: number;
    readonly sumX: number;
    readonly sumX2: number;
    readonly mean: number;
    readonly populationSigma: number;
    readonly sampleSigma: number;
    readonly min: number;
    readonly max: number;
}

export interface StatisticsSummaryResult {
    readonly summary: StatisticsSummary | null;
    readonly errorMessage: string | null;
}

export interface StatisticsSummaryService {
    summarize(data: readonly number[]): StatisticsSummaryResult;
}
