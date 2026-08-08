import {
  FieldError,
  Input,
  Label,
  TextField,
  type TextFieldProps,
} from "react-aria-components";
import styles from "../styles/AccessibleTextFieldComponent.module.css";

export interface AccessibleTextFieldComponentProperties
  extends Omit<TextFieldProps, "className"> {
  readonly label: string;
  readonly inputClassName?: string;
}

export function AccessibleTextFieldComponent(
  props: AccessibleTextFieldComponentProperties
) {
  const { label, inputClassName, ...textFieldProperties } = props;

  const mergedInputClassName = [styles.input, inputClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <TextField {...textFieldProperties} className={styles.textField}>
      <Label className={styles.label}>{label}</Label>
      <Input className={mergedInputClassName} />
      <FieldError className={styles.fieldError} />
    </TextField>
  );
}
