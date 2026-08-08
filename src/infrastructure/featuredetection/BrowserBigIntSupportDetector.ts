import type { BigIntSupportDetector } from "./BigIntSupportDetector";

export class BrowserBigIntSupportDetector implements BigIntSupportDetector {
    public isBigIntSupported(): boolean {
        return typeof globalThis.BigInt === "function";
    }
}
