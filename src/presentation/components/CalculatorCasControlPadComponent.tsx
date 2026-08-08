import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import { CalculatorKeypadGridSectionComponent } from "./CalculatorKeypadGridSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

interface CalculatorCasControlPadComponentProperties {
  readonly keys: readonly CalculatorKeyDefinition[];
  readonly onKeyPressed: (key: CalculatorKeyDefinition) => void;
}

/**
 * Renders the CAS shortcut keys on the main keypad.
 *
 * The pad is only rendered by the keypad container when CAS is enabled, so
 * disabled users never see the symbolic operation keys.
 */
export function CalculatorCasControlPadComponent(
  props: CalculatorCasControlPadComponentProperties
) {
  return (
    <CalculatorKeypadGridSectionComponent
      sectionClassName={cssClass(styles.casArea)}
      gridLabel="CAS operations"
      keys={props.keys}
      columnCount={4}
      resolveKeyClassName={() => cssClass(styles.casKey)}
      onKeyPressed={props.onKeyPressed}
    />
  );
}
