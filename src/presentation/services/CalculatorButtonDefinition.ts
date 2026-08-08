import type { CalculatorKeyDefinition } from "./CalculatorKeyDefinition";
import type { CalculatorButtonInsertionBehavior } from "./CalculatorButtonInsertionBehavior";

/**
 * A keypad key enriched with its standardized insertion behavior.
 *
 * Every button routes through the same insertion model so cursor placement is
 * predictable regardless of which keypad region the key belongs to.
 */
export interface CalculatorButtonDefinition extends CalculatorKeyDefinition {
  readonly behavior: CalculatorButtonInsertionBehavior;
}
