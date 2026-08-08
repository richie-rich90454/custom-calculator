export interface BrowserFeatureSnapshot {
    readonly bigIntSupported: boolean;
}

export interface BrowserFeatureDetectionService {
    detectBrowserFeatures(): BrowserFeatureSnapshot;
}
