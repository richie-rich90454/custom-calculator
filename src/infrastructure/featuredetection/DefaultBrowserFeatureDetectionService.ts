import {
  BrowserFeatureDetectionService,
  BrowserFeatureSnapshot,
} from "./BrowserFeatureDetectionService";
import { BigIntSupportDetector } from "./BigIntSupportDetector";

export class DefaultBrowserFeatureDetectionService
  implements BrowserFeatureDetectionService
{
  public constructor(
    private readonly bigIntSupportDetector: BigIntSupportDetector
  ) {}

  public detectBrowserFeatures(): BrowserFeatureSnapshot {
    return {
      bigIntSupported: this.bigIntSupportDetector.isBigIntSupported(),
    };
  }
}
