import { describe, expect, it, vi } from "vitest";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import type { CalculatorKeyboardShortcutTarget } from "./CalculatorKeyboardShortcutRegistry";
import { CalculatorKeyboardShortcutRegistry } from "./CalculatorKeyboardShortcutRegistry";

function buildTarget(
  overrides: Partial<CalculatorKeyboardShortcutTarget> = {}
): CalculatorKeyboardShortcutTarget {
  return {
    activePanel: CalculatorPanelName.NONE,
    isTypingContext: false,
    onPanelOpened: vi.fn(),
    onClearPressed: vi.fn(),
    onEvaluatePressed: vi.fn(),
    onAngleModeTogglePressed: vi.fn(),
    ...overrides,
  };
}

describe("CalculatorKeyboardShortcutRegistry", () => {
  const registry = new CalculatorKeyboardShortcutRegistry();

  it("closes the active panel on Escape", () => {
    const target = buildTarget({
      activePanel: CalculatorPanelName.HISTORY,
      onPanelOpened: vi.fn(),
    });

    const resolution = registry.resolveKeyDown(
      { key: "Escape", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.HISTORY);
  });

  it("clears the expression on Escape when no panel is open and not typing", () => {
    const target = buildTarget({ onClearPressed: vi.fn() });

    registry.resolveKeyDown(
      { key: "Escape", ctrlKey: false, metaKey: false },
      target
    );

    expect(target.onClearPressed).toHaveBeenCalledOnce();
  });

  it("does not clear the expression on Escape while typing", () => {
    const target = buildTarget({
      isTypingContext: true,
      onClearPressed: vi.fn(),
    });

    registry.resolveKeyDown(
      { key: "Escape", ctrlKey: false, metaKey: false },
      target
    );

    expect(target.onClearPressed).not.toHaveBeenCalled();
  });

  it("evaluates on Enter outside a typing context", () => {
    const target = buildTarget({ onEvaluatePressed: vi.fn() });

    registry.resolveKeyDown(
      { key: "Enter", ctrlKey: false, metaKey: false },
      target
    );

    expect(target.onEvaluatePressed).toHaveBeenCalledOnce();
  });

  it("ignores Enter inside a typing context", () => {
    const target = buildTarget({
      isTypingContext: true,
      onEvaluatePressed: vi.fn(),
    });

    registry.resolveKeyDown(
      { key: "Enter", ctrlKey: false, metaKey: false },
      target
    );

    expect(target.onEvaluatePressed).not.toHaveBeenCalled();
  });

  it("toggles the angle mode with Control+D", () => {
    const target = buildTarget({ onAngleModeTogglePressed: vi.fn() });

    registry.resolveKeyDown(
      { key: "d", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onAngleModeTogglePressed).toHaveBeenCalledOnce();
  });

  it("opens the history panel with Control+H", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    registry.resolveKeyDown(
      { key: "h", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.HISTORY);
  });

  it("opens the memory panel with Control+M", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    registry.resolveKeyDown(
      { key: "m", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.MEMORY);
  });

  it("opens the constants panel with Control+E", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    registry.resolveKeyDown(
      { key: "e", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.CONSTANTS);
  });

  it("opens the settings panel with Control+comma", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    registry.resolveKeyDown(
      { key: ",", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.SETTINGS);
  });

  it("opens the calculus panel with Control+L", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    registry.resolveKeyDown(
      { key: "l", ctrlKey: true, metaKey: false },
      target
    );

    expect(target.onPanelOpened).toHaveBeenCalledWith(CalculatorPanelName.CALCULUS);
  });

  it("leaves unrelated keys unhandled", () => {
    const target = buildTarget({ onPanelOpened: vi.fn() });

    const resolution = registry.resolveKeyDown(
      { key: "ArrowLeft", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(false);
    expect(target.onPanelOpened).not.toHaveBeenCalled();
  });
});
