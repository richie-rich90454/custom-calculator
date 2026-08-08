import { useEffect } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorApplicationBootstrap } from "../../app/CalculatorApplicationBootstrap";
import { ThemePreference } from "../../domain/model/ThemePreference";

export function useCalculatorTheme(): void {
  const { store, compositionRoot } = useCalculatorApplicationContext();
  const themePreference = store((state) => state.themePreference);

  useEffect(() => {
    const bootstrap = new CalculatorApplicationBootstrap(compositionRoot);

    bootstrap.applyThemeToDocument(themePreference);

    if (themePreference !== ThemePreference.SYSTEM) {
      return;
    }

    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (): void => {
      bootstrap.applyThemeToDocument(themePreference);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [compositionRoot, themePreference]);
}
