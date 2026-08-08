import { CalculatorSettings } from "../model/CalculatorSettings";

export interface SettingsRepository {
    loadSettings(): CalculatorSettings | null;
    saveSettings(settings: CalculatorSettings): void;
    clearSettings(): void;
}
