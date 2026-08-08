export enum ButtonActivationKind {
  POINTER = "POINTER",
  KEYBOARD = "KEYBOARD",
}

export interface ExpressionEditorFocusHandle {
  focus(): void;
}

/**
 * Preserves the expression editing experience when a keypad button is used.
 *
 * Pointer activations restore focus to the expression editor after the
 * insertion commits, while keyboard activations keep focus on the button so
 * arrow-key grid navigation continues uninterrupted.
 */
export interface FocusPreservationService {
  resolveActivationKind(pointerType: string): ButtonActivationKind;

  registerEditor(handle: ExpressionEditorFocusHandle): void;

  unregisterEditor(): void;

  restoreFocusAfterButtonPress(activationKind: ButtonActivationKind): void;
}
