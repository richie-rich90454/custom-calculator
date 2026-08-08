import { useEffect } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorKeyboardShortcutRegistry } from "../services/CalculatorKeyboardShortcutRegistry";

const keyboardShortcutRegistry = new CalculatorKeyboardShortcutRegistry();

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

      const resolution = keyboardShortcutRegistry.resolveKeyDown(event, {
        activePanel: actions.activePanel,
        isTypingContext: isTypingContext,
        onPanelOpened: actions.onPanelOpened,
        onClearPressed: actions.onClearPressed,
        onEvaluatePressed: actions.onEvaluatePressed,
        onAngleModeTogglePressed: actions.onAngleModeTogglePressed,
      });

      if (resolution.handled) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [store]);
}
