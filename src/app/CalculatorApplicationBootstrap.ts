import { CalculatorSettings } from "../domain/model/CalculatorSettings";
import { NumericMode } from "../domain/model/NumericMode";
import { ThemePreference } from "../domain/model/ThemePreference";
import type { CalculatorCompositionRoot } from "./CalculatorCompositionRoot";

export interface CalculatorApplicationBootstrapResult {
  readonly bigIntSupported: boolean;
  readonly settings: CalculatorSettings;
  readonly statusMessage: string | null;
}

export type ResolvedThemeName = "light" | "dark";

export class CalculatorApplicationBootstrap {
  public constructor(
    private readonly compositionRoot: CalculatorCompositionRoot
  ) {}

  public bootstrap(): CalculatorApplicationBootstrapResult {
    const featureSnapshot =
      this.compositionRoot.browserFeatureDetectionService.detectBrowserFeatures();

    const storedSettings =
      this.compositionRoot.orchestrationService.loadSettings();

    const defaultSettings = CalculatorSettings.createDefault();
    const requestedSettings = storedSettings ?? defaultSettings;

    const resolvedSettings = this.resolveBigIntFallback(
      requestedSettings,
      featureSnapshot.bigIntSupported
    );

    if (resolvedSettings !== requestedSettings) {
      this.compositionRoot.orchestrationService.saveSettings(resolvedSettings);
    }

    const statusMessage = this.createStatusMessage(
      requestedSettings,
      featureSnapshot.bigIntSupported
    );

    return {
      bigIntSupported: featureSnapshot.bigIntSupported,
      settings: resolvedSettings,
      statusMessage: statusMessage,
    };
  }

  public applyThemeToDocument(themePreference: ThemePreference): void {
    const resolvedTheme = this.resolveTheme(themePreference);

    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }

  public resolveTheme(themePreference: ThemePreference): ResolvedThemeName {
    if (themePreference === ThemePreference.LIGHT) {
      return "light";
    }

    if (themePreference === ThemePreference.DARK) {
      return "dark";
    }

    return this.resolveSystemTheme();
  }

  private resolveSystemTheme(): ResolvedThemeName {
    if (
      typeof globalThis.matchMedia === "function"
    ) {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "light";
  }

  private resolveBigIntFallback(
    requestedSettings: CalculatorSettings,
    bigIntSupported: boolean
  ): CalculatorSettings {
    if (requestedSettings.numericMode !== NumericMode.BIGINT) {
      return requestedSettings;
    }

    if (bigIntSupported) {
      return requestedSettings;
    }

    return new CalculatorSettings(
      requestedSettings.angleMode,
      NumericMode.EXACT_DECIMAL,
      requestedSettings.complexNumbersEnabled,
      requestedSettings.casEnabled,
      requestedSettings.themePreference
    );
  }

  private createStatusMessage(
    requestedSettings: CalculatorSettings,
    bigIntSupported: boolean
  ): string | null {
    if (
      requestedSettings.numericMode === NumericMode.BIGINT &&
      !bigIntSupported
    ) {
      return "BigInt mode is not supported in this browser. Falling back to exact decimal mode.";
    }

    return null;
  }
}
