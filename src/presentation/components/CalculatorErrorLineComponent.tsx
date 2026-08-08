import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorErrorLineComponent.module.css";

interface CalculatorErrorLineComponentProperties {
  readonly errorText: string | null;
}

export function CalculatorErrorLineComponent(
  props: CalculatorErrorLineComponentProperties
) {
  const { errorText } = props;

  if (errorText === null) {
    return null;
  }

  return (
    <p id="error-text" className={cssClass(styles.error)} role="alert">
      {errorText}
    </p>
  );
}
