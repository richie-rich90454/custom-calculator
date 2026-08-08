export interface ResultFormattingService {
    formatNumber(value: number): string;
    normalizeResultText(rawResultText: string): string;
    isFiniteNumber(value: number): boolean;
}
