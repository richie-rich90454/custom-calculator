import { describe, expect, it, vi } from "vitest";
import type { ExpressionEditorKeyActionTarget } from "./ExpressionEditorKeyboardService";
import { ExpressionEditorKeyboardService } from "./ExpressionEditorKeyboardService";

function buildTarget(): ExpressionEditorKeyActionTarget {
  return {
    onEvaluatePressed: vi.fn(),
    onDeleteBackwardPressed: vi.fn(),
    onDeleteForwardPressed: vi.fn(),
    onDeleteWordBackwardPressed: vi.fn(),
    onClearPressed: vi.fn(),
  };
}

describe("ExpressionEditorKeyboardService", () => {
  const service = new ExpressionEditorKeyboardService();

  it("evaluates the expression on Enter", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Enter", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onEvaluatePressed).toHaveBeenCalledOnce();
  });

  it("deletes a word backward on Ctrl+Backspace", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Backspace", ctrlKey: true, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onDeleteWordBackwardPressed).toHaveBeenCalledOnce();
  });

  it("deletes a word backward on Meta+Backspace", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Backspace", ctrlKey: false, metaKey: true },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onDeleteWordBackwardPressed).toHaveBeenCalledOnce();
  });

  it("deletes backward on plain Backspace", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Backspace", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onDeleteBackwardPressed).toHaveBeenCalledOnce();
  });

  it("deletes forward on Delete", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Delete", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onDeleteForwardPressed).toHaveBeenCalledOnce();
  });

  it("clears the expression on Escape", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "Escape", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(true);
    expect(target.onClearPressed).toHaveBeenCalledOnce();
  });

  it("leaves arrow keys to the native input", () => {
    const target = buildTarget();

    const resolution = service.handleKeyDown(
      { key: "ArrowLeft", ctrlKey: false, metaKey: false },
      target
    );

    expect(resolution.handled).toBe(false);
    expect(target.onEvaluatePressed).not.toHaveBeenCalled();
    expect(target.onClearPressed).not.toHaveBeenCalled();
  });
});
