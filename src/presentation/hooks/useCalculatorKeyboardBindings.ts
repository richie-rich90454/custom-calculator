import { useEffect } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorPanelName } from "../../state/CalculatorUiState";

export function useCalculatorKeyboardBindings(): void {
  const { store } = useCalculatorApplicationContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const actions = store.getState();
      const target = event.target as HTMLElement | null;
      const isTypingContext =
        target !== null &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "Escape") {
        if (actions.activePanel !== CalculatorPanelName.NONE) {
          event.preventDefault();
          actions.onPanelOpened(actions.activePanel);
          return;
        }

        if (!isTypingContext) {
          event.preventDefault();
          actions.onClearPressed();
        }

        return;
      }

      if (event.key === "Enter" && !isTypingContext) {
        event.preventDefault();
        actions.onEvaluatePressed();
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        const shortcutKey = event.key.toLowerCase();

        if (shortcutKey === "d") {
          event.preventDefault();
          actions.onAngleModeTogglePressed();
        } else if (shortcutKey === "h") {
          event.preventDefault();
          actions.onPanelOpened(CalculatorPanelName.HISTORY);
        } else if (shortcutKey === "m") {
          event.preventDefault();
          actions.onPanelOpened(CalculatorPanelName.MEMORY);
        } else if (shortcutKey === "e") {
          event.preventDefault();
          actions.onPanelOpened(CalculatorPanelName.CONSTANTS);
        } else if (shortcutKey === ",") {
          event.preventDefault();
          actions.onPanelOpened(CalculatorPanelName.SETTINGS);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [store]);
}
