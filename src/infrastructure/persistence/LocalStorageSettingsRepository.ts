import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ThemePreference } from "../../domain/model/ThemePreference";
import type { SettingsRepository } from "../../domain/repositories/SettingsRepository";

interface StoredSettingsShape {
  readonly angleMode: AngleMode;
  readonly numericMode: NumericMode;
  readonly complexNumbersEnabled: boolean;
  readonly casEnabled: boolean;
  readonly themePreference: ThemePreference;
}

const STORAGE_KEY = "custom-calculator.settings";

export class LocalStorageSettingsRepository implements SettingsRepository {
  private readonly storage: Storage | null;

  public constructor() {
    this.storage = this.resolveStorage();
  }

  public loadSettings(): CalculatorSettings | null {
    if (this.storage === null) {
      return null;
    }

    try {
      const rawValue = this.storage.getItem(STORAGE_KEY);

      if (rawValue === null) {
        return null;
      }

      const parsedValue = JSON.parse(rawValue) as StoredSettingsShape;

      return this.validateStoredSettings(parsedValue);
    } catch {
      return null;
    }
  }

  public saveSettings(settings: CalculatorSettings): void {
    if (this.storage === null) {
      return;
    }

    const storedSettings: StoredSettingsShape = {
      angleMode: settings.angleMode,
      numericMode: settings.numericMode,
      complexNumbersEnabled: settings.complexNumbersEnabled,
      casEnabled: settings.casEnabled,
      themePreference: settings.themePreference,
    };

    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(storedSettings));
    } catch {
      // Persistence is best effort; a failing write must not crash the app.
    }
  }

  public clearSettings(): void {
    if (this.storage === null) {
      return;
    }

    this.storage.removeItem(STORAGE_KEY);
  }

  private resolveStorage(): Storage | null {
    try {
      return globalThis.localStorage;
    } catch {
      return null;
    }
  }

  private validateStoredSettings(
    storedSettings: StoredSettingsShape
  ): CalculatorSettings | null {
    if (
      !Object.values(AngleMode).includes(storedSettings.angleMode) ||
      !Object.values(NumericMode).includes(storedSettings.numericMode) ||
      !Object.values(ThemePreference).includes(storedSettings.themePreference) ||
      typeof storedSettings.complexNumbersEnabled !== "boolean" ||
      typeof storedSettings.casEnabled !== "boolean"
    ) {
      return null;
    }

    return new CalculatorSettings(
      storedSettings.angleMode,
      storedSettings.numericMode,
      storedSettings.complexNumbersEnabled,
      storedSettings.casEnabled,
      storedSettings.themePreference
    );
  }
}
