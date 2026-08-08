import {
  ButtonActivationKind,
  type ExpressionEditorFocusHandle,
  type FocusPreservationService,
} from "./FocusPreservationService";

/**
 * Default focus preservation service.
 *
 * Editor handles are kept in a stack so nested calculator instances each
 * restore to their own editor. Pointer activations schedule focus restoration
 * after the current render commits so the native caret appears at the freshly
 * inserted cursor position.
 */
export class DefaultFocusPreservationService
  implements FocusPreservationService
{
  private readonly editorHandles: ExpressionEditorFocusHandle[] = [];

  public resolveActivationKind(pointerType: string): ButtonActivationKind {
    return pointerType === "keyboard"
      ? ButtonActivationKind.KEYBOARD
      : ButtonActivationKind.POINTER;
  }

  public registerEditor(handle: ExpressionEditorFocusHandle): void {
    this.editorHandles.push(handle);
  }

  public unregisterEditor(): void {
    this.editorHandles.pop();
  }

  public restoreFocusAfterButtonPress(
    activationKind: ButtonActivationKind
  ): void {
    if (activationKind !== ButtonActivationKind.POINTER) {
      return;
    }

    const handle = this.editorHandles[this.editorHandles.length - 1];

    if (handle === undefined) {
      return;
    }

    const scheduleFocus = (): void => {
      handle.focus();
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(scheduleFocus);
    } else {
      window.setTimeout(scheduleFocus, 0);
    }
  }
}
