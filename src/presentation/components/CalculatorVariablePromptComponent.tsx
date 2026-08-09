import { useState, type FormEvent } from "react";
import { Form } from "react-aria-components";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorVariablePromptComponent.module.css";

/**
 * CALC variable prompt dialog.
 *
 * When an expression references variables that are not yet defined, CALC
 * asks for their values in this accessible dialog and re-evaluates with the
 * collected values.
 */
export function CalculatorVariablePromptComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();
    const [values, setValues] = useState<Record<string, string>>({});

    const handleValueChanged = (variableName: string, value: string): void => {
        setValues((previousValues) => ({ ...previousValues, [variableName]: value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        store.getState().onVariablePromptSubmitted(values);
    };

    const prompts = viewModel.pendingVariablePrompts;

    return (
        <Form className={cssClass(styles.form)} onSubmit={handleSubmit}>
            <p className={cssClass(styles.intro)}>
                {prompts.length === 1
                    ? "Enter a value for the variable used in the expression."
                    : "Enter values for the variables used in the expression."}
            </p>
            {prompts.map((variableName, index) => (
                <AccessibleTextFieldComponent
                    key={variableName}
                    label={`Value for ${variableName}`}
                    /* eslint-disable-next-line jsx-a11y/no-autofocus -- Focus the first field so the dialog can be filled without a mouse. */
                    autoFocus={index === 0}
                    value={values[variableName] ?? ""}
                    onChange={(value) => handleValueChanged(variableName, value)}
                    aria-label={`Value for ${variableName}`}
                />
            ))}
            <div className={cssClass(styles.actions)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.submitButton)}
                    type="submit"
                >
                    Evaluate
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.cancelButton)}
                    onPress={() => store.getState().onVariablePromptCancelled()}
                >
                    Cancel
                </AccessibleButtonComponent>
            </div>
        </Form>
    );
}
