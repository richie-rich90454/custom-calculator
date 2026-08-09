import { afterEach, describe, expect, it, vi } from "vitest";
import { CalculatorCompositionRoot } from "./CalculatorCompositionRoot";
import { CalculatorSettings } from "../domain/model/CalculatorSettings";
import { AngleMode } from "../domain/model/AngleMode";
import { NumericMode } from "../domain/model/NumericMode";
import { ThemePreference } from "../domain/model/ThemePreference";
import { CalculatorApplicationBootstrap } from "./CalculatorApplicationBootstrap";

function buildRootWithSettings(
    settings: CalculatorSettings,
    bigIntSupported: boolean,
): CalculatorCompositionRoot {
    const root = new CalculatorCompositionRoot();

    vi.spyOn(root.orchestrationService, "loadSettings").mockReturnValue(settings);
    vi.spyOn(root.browserFeatureDetectionService, "detectBrowserFeatures").mockReturnValue({
        bigIntSupported: bigIntSupported,
    });
    vi.spyOn(root.orchestrationService, "saveSettings").mockImplementation(() => undefined);

    return root;
}

function buildBigIntSettings(): CalculatorSettings {
    return new CalculatorSettings(
        AngleMode.DEG,
        NumericMode.BIGINT,
        false,
        false,
        ThemePreference.SYSTEM,
    );
}

describe("CalculatorApplicationBootstrap", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("keeps the requested settings when BigInt is supported", () => {
        const settings = buildBigIntSettings();
        const root = buildRootWithSettings(settings, true);

        const result = new CalculatorApplicationBootstrap(root).bootstrap();

        expect(result.bigIntSupported).toBe(true);
        expect(result.settings.numericMode).toBe(NumericMode.BIGINT);
        expect(result.statusMessage).toBeNull();
    });

    it("falls back from BigInt to exact decimal when unsupported", () => {
        const settings = buildBigIntSettings();
        const root = buildRootWithSettings(settings, false);

        const result = new CalculatorApplicationBootstrap(root).bootstrap();

        expect(result.settings.numericMode).toBe(NumericMode.EXACT_DECIMAL);
        expect(result.statusMessage).toContain("BigInt mode is not supported");
    });

    it("uses default settings when nothing is stored", () => {
        const root = new CalculatorCompositionRoot();

        vi.spyOn(root.orchestrationService, "loadSettings").mockReturnValue(null);

        const result = new CalculatorApplicationBootstrap(root).bootstrap();

        expect(result.settings).toEqual(CalculatorSettings.createDefault());
    });

    it("resolves the stored active app mode", () => {
        const root = new CalculatorCompositionRoot();

        globalThis.localStorage.setItem("calculator.activeAppMode", "matrix");

        const bootstrap = new CalculatorApplicationBootstrap(root);

        expect(bootstrap.resolveActiveAppMode()).toBe("matrix");
    });

    it("defaults the active app mode to the calculate app", () => {
        const root = new CalculatorCompositionRoot();

        globalThis.localStorage.removeItem("calculator.activeAppMode");

        const bootstrap = new CalculatorApplicationBootstrap(root);

        expect(bootstrap.resolveActiveAppMode()).toBe("calculate");
    });

    it("includes the active app mode in the bootstrap result", () => {
        const root = new CalculatorCompositionRoot();

        globalThis.localStorage.setItem("calculator.activeAppMode", "statistics");

        const result = new CalculatorApplicationBootstrap(root).bootstrap();

        expect(result.activeAppMode).toBe("statistics");
    });

    it("resolves light and dark theme preferences", () => {
        const root = new CalculatorCompositionRoot();
        const bootstrap = new CalculatorApplicationBootstrap(root);

        expect(bootstrap.resolveTheme(ThemePreference.LIGHT)).toBe("light");
        expect(bootstrap.resolveTheme(ThemePreference.DARK)).toBe("dark");
    });

    it("resolves the system theme preference", () => {
        const root = new CalculatorCompositionRoot();
        const bootstrap = new CalculatorApplicationBootstrap(root);

        const originalMatchMedia = globalThis.matchMedia;

        Object.defineProperty(globalThis, "matchMedia", {
            value: vi.fn(() => ({ matches: true })),
            configurable: true,
        });

        try {
            expect(bootstrap.resolveTheme(ThemePreference.SYSTEM)).toBe("dark");
        } finally {
            Object.defineProperty(globalThis, "matchMedia", {
                value: originalMatchMedia,
                configurable: true,
            });
        }
    });

    it("defaults the system theme to light when matchMedia is unavailable", () => {
        const root = new CalculatorCompositionRoot();
        const bootstrap = new CalculatorApplicationBootstrap(root);

        const originalMatchMedia = globalThis.matchMedia;

        Object.defineProperty(globalThis, "matchMedia", {
            value: undefined,
            configurable: true,
        });

        try {
            expect(bootstrap.resolveTheme(ThemePreference.SYSTEM)).toBe("light");
        } finally {
            Object.defineProperty(globalThis, "matchMedia", {
                value: originalMatchMedia,
                configurable: true,
            });
        }
    });

    it("applies the theme to the document element", () => {
        const root = new CalculatorCompositionRoot();
        const bootstrap = new CalculatorApplicationBootstrap(root);

        bootstrap.applyThemeToDocument(ThemePreference.DARK);

        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
});
