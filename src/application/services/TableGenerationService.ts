export interface TableRow {
    readonly x: number;
    readonly fx: number | null;
    readonly gx?: number | null;
}

export interface TableGenerationResult {
    readonly rows: readonly TableRow[];
    readonly errorMessage: string | null;
}

export interface TableGenerationService {
    generate(
        expressionText: string,
        start: number,
        end: number,
        step: number,
        secondExpressionText?: string,
    ): TableGenerationResult;
}
