export enum CalculatorKeyKind {
  DIGIT = "DIGIT",
  OPERATOR = "OPERATOR",
  FUNCTION = "FUNCTION",
  CONSTANT = "CONSTANT",
  PARENTHESIS = "PARENTHESIS",
  CLEAR = "CLEAR",
  DELETE_BACKWARD = "DELETE_BACKWARD",
  DELETE_FORWARD = "DELETE_FORWARD",
  EVALUATE = "EVALUATE",
  ANS = "ANS",
  MEMORY_RECALL = "MEMORY_RECALL",
  CAS_OPERATION = "CAS_OPERATION",
  CALCULUS_OPERATION = "CALCULUS_OPERATION",
}

/**
 * Data driven description of a single keypad key.
 *
 * Keeping key definitions as data makes the keypad layout, labels, and
 * dispatch behavior testable and easily extensible without touching TSX.
 */
export interface CalculatorKeyDefinition {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly kind: CalculatorKeyKind;
  readonly value: string;
}
