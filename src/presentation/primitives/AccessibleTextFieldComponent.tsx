import { FieldError, Input, Label, TextField, type TextFieldProps } from "react-aria-components";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/AccessibleTextFieldComponent.module.css";

export interface AccessibleTextFieldComponentProperties extends Omit<TextFieldProps, "className"> {
    readonly label: string;
    readonly inputClassName?: string;
}

export function AccessibleTextFieldComponent(props: AccessibleTextFieldComponentProperties) {
    const { label, inputClassName, ...textFieldProperties } = props;

    const mergedInputClassName = joinClassNames(styles.input, inputClassName);

    return (
        <TextField {...textFieldProperties} className={cssClass(styles.textField)}>
            <Label className={cssClass(styles.label)}>{label}</Label>
            <Input className={mergedInputClassName} />
            <FieldError className={cssClass(styles.fieldError)} />
        </TextField>
    );
}
