import { CalculatorPanelName } from "../../state/CalculatorUiState";

/**
 * Describes the context the shortcut service needs to resolve a key event.
 * The presentation layer forwards the current panel and typing state so the
 * decision logic stays testable outside TSX.
 */
export interface CalculatorKeyboardShortcutTarget {
  readonly activePanel: CalculatorPanelName;
  readonly isTypingContext: boolean;
  readonly onPanelOpened: (panelName: string) => void;
  readonly onClearPressed: () => void;
  readonly onEvaluatePressed: () => void;
  readonly onAngleModeTogglePressed: () => void;
}

export interface CalculatorKeyboardShortcutResolution {
  readonly handled: boolean;
}

/**
 * Resolves global calculator keyboard shortcuts.
 *
 * Escape closes the active panel or clears the expression, Enter evaluates
 * outside of typing contexts, and modifier shortcuts open panels or toggle
 * the angle mode. Arrow and text editing keys are intentionally left to the
 * focused control.
 */
export class CalculatorKeyboardShortcutRegistry {
  public resolveKeyDown(
    event: {
      readonly key: string;
      readonly ctrlKey: boolean;
      readonly metaKey: boolean;
    },
    target: CalculatorKeyboardShortcutTarget
  ): CalculatorKeyboardShortcutResolution {
    if (event.key === "Escape") {
      return this.resolveEscape(target);
    }

    if (event.key === "Enter" && !target.isTypingContext) {
      target.onEvaluatePressed();
      return { handled: true };
    }

    if (event.ctrlKey || event.metaKey) {
      return this.resolveModifierShortcut(event, target);
    }

    return { handled: false };
  }

  private resolveEscape(
    target: CalculatorKeyboardShortcutTarget
  ): CalculatorKeyboardShortcutResolution {
    if (target.activePanel !== CalculatorPanelName.NONE) {
      target.onPanelOpened(target.activePanel);
      return { handled: true };
    }

    if (!target.isTypingContext) {
      target.onClearPressed();
    }

    return { handled: true };
  }

  private resolveModifierShortcut(
    event: {
      readonly key: string;
      readonly ctrlKey: boolean;
      readonly metaKey: boolean;
    },
    target: CalculatorKeyboardShortcutTarget
  ): CalculatorKeyboardShortcutResolution {
    const shortcutKey = event.key.toLowerCase();

    if (shortcutKey === "d") {
      target.onAngleModeTogglePressed();
      return { handled: true };
    }

    if (shortcutKey === "h") {
      target.onPanelOpened(CalculatorPanelName.HISTORY);
      return { handled: true };
    }

    if (shortcutKey === "m") {
      target.onPanelOpened(CalculatorPanelName.MEMORY);
      return { handled: true };
    }

    if (shortcutKey === "e") {
      target.onPanelOpened(CalculatorPanelName.CONSTANTS);
      return { handled: true };
    }

    if (shortcutKey === ",") {
      target.onPanelOpened(CalculatorPanelName.SETTINGS);
      return { handled: true };
    }

    return { handled: false };
  }
}
