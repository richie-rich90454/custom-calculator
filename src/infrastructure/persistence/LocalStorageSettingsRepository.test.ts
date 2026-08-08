import { describe, expect, it } from "vitest";
import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ThemePreference } from "../../domain/model/ThemePreference";
import { LocalStorageSettingsRepository } from "./LocalStorageSettingsRepository";

describe("LocalStorageSettingsRepository", () => {
  const storageKey = "custom-calculator.settings";

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it("returns null when no settings are stored", () => {
    const repository = new LocalStorageSettingsRepository();

    expect(repository.loadSettings()).toBeNull();
  });

  it("round trips settings through storage", () => {
    const repository = new LocalStorageSettingsRepository();
    const settings = new CalculatorSettings(
      AngleMode.RAD,
      NumericMode.EXACT_DECIMAL,
      true,
      true,
      ThemePreference.DARK
    );

    repository.saveSettings(settings);

    const loadedSettings = repository.loadSettings();

    expect(loadedSettings).toEqual(settings);
  });

  it("returns null for corrupt stored JSON", () => {
    globalThis.localStorage.setItem(storageKey, "not-json");

    const repository = new LocalStorageSettingsRepository();

    expect(repository.loadSettings()).toBeNull();
  });

  it("returns null for invalid stored settings", () => {
    globalThis.localStorage.setItem(
      storageKey,
      JSON.stringify({ angleMode: "INVALID", numericMode: "STANDARD" })
    );

    const repository = new LocalStorageSettingsRepository();

    expect(repository.loadSettings()).toBeNull();
  });

  it("clears stored settings", () => {
    const repository = new LocalStorageSettingsRepository();
    const settings = new CalculatorSettings(
      AngleMode.DEG,
      NumericMode.STANDARD,
      false,
      false,
      ThemePreference.SYSTEM
    );

    repository.saveSettings(settings);
    repository.clearSettings();

    expect(repository.loadSettings()).toBeNull();
  });

  it("tolerates unavailable storage", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "localStorage"
    );

    Object.defineProperty(globalThis, "localStorage", {
      get: () => {
        throw new Error("Storage unavailable");
      },
      configurable: true,
    });

    try {
      const repository = new LocalStorageSettingsRepository();

      expect(repository.loadSettings()).toBeNull();
      expect(() => repository.saveSettings(
        new CalculatorSettings(
          AngleMode.DEG,
          NumericMode.STANDARD,
          false,
          false,
          ThemePreference.LIGHT
        )
      )).not.toThrow();
    } finally {
      if (originalDescriptor !== undefined) {
        Object.defineProperty(globalThis, "localStorage", originalDescriptor);
      }
    }
  });
});
