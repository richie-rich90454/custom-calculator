import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./custom.css";

const customTheme: Theme = {
  extends: DefaultTheme,
  enhanceApp() {
    // Custom theme extension point for the documentation site.
  },
};

export default customTheme;
