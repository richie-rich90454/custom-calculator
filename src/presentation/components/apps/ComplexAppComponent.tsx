import { useState, type ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { AccessibleTextFieldComponent } from "../../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../../utils/classNames";
import styles from "../../styles/ComplexAppComponent.module.css";

type ComplexForm = "rect" | "polar";

interface ComplexInputState {
    readonly form: ComplexForm;
    readonly re: string;
    readonly im: string;
    readonly radius: string;
    readonly angle: string;
}

function createEmptyInput(): ComplexInputState {
    return { form: "rect", re: "", im: "", radius: "", angle: "" };
}

export function ComplexAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();
    const [operandA, setOperandA] = useState<ComplexInputState>(createEmptyInput());
    const [operandB, setOperandB] = useState<ComplexInputState>(createEmptyInput());
    const [resultText, setResultText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const complexEnabled = viewModel.complexNumbersEnabled;

    const parseOperand = (input: ComplexInputState): { re: number; im: number } | null => {
        const re = Number(input.re);
        const im = Number(input.im);
        const radius = Number(input.radius);
        const angle = Number(input.angle);

        if (input.form === "rect") {
            if (
                input.re.trim() === "" ||
                input.im.trim() === "" ||
                !Number.isFinite(re) ||
                !Number.isFinite(im)
            ) {
                return null;
            }
            return { re, im };
        }

        if (
            input.radius.trim() === "" ||
            input.angle.trim() === "" ||
            !Number.isFinite(radius) ||
            !Number.isFinite(angle)
        ) {
            return null;
        }
        return compositionRoot.complexOperationsGateway.polarToRect(radius, angle);
    };

    const runUnary = (operation: (z: { re: number; im: number }) => string): void => {
        if (!complexEnabled) {
            setErrorText("Complex numbers are disabled. Enable them in settings.");
            return;
        }

        const value = parseOperand(operandA);

        if (value === null) {
            setErrorText("Enter a valid value for A.");
            return;
        }

        setResultText(operation(value));
        setErrorText(null);
    };

    const runBinary = (
        operation: (a: { re: number; im: number }, b: { re: number; im: number }) => string,
    ): void => {
        if (!complexEnabled) {
            setErrorText("Complex numbers are disabled. Enable them in settings.");
            return;
        }

        const valueA = parseOperand(operandA);
        const valueB = parseOperand(operandB);

        if (valueA === null || valueB === null) {
            setErrorText("Enter valid values for both A and B.");
            return;
        }

        setResultText(operation(valueA, valueB));
        setErrorText(null);
    };

    const renderOperandEditor = (
        input: ComplexInputState,
        onChange: (next: ComplexInputState) => void,
        label: string,
    ): ReactNode => {
        return (
            <section className={cssClass(styles.operandSection)}>
                <h3 className={cssClass(styles.operandHeading)}>{label}</h3>
                <AccessibleSelectComponent
                    label={`${label} form`}
                    selectedKey={input.form}
                    options={[
                        { id: "rect", label: "Rectangular a + bi" },
                        { id: "polar", label: "Polar r ∠ θ" },
                    ]}
                    onSelectionChange={(key) => onChange({ ...input, form: key as ComplexForm })}
                />
                {input.form === "rect" ? (
                    <div className={cssClass(styles.fieldsRow)}>
                        <AccessibleTextFieldComponent
                            label={`${label} real part`}
                            value={input.re}
                            inputMode="decimal"
                            onChange={(value) => onChange({ ...input, re: value })}
                        />
                        <AccessibleTextFieldComponent
                            label={`${label} imaginary part`}
                            value={input.im}
                            inputMode="decimal"
                            onChange={(value) => onChange({ ...input, im: value })}
                        />
                    </div>
                ) : (
                    <div className={cssClass(styles.fieldsRow)}>
                        <AccessibleTextFieldComponent
                            label={`${label} radius`}
                            value={input.radius}
                            inputMode="decimal"
                            onChange={(value) => onChange({ ...input, radius: value })}
                        />
                        <AccessibleTextFieldComponent
                            label={`${label} angle`}
                            value={input.angle}
                            inputMode="decimal"
                            onChange={(value) => onChange({ ...input, angle: value })}
                        />
                    </div>
                )}
            </section>
        );
    };

    const renderResult = (value: { re: number; im: number }): string => {
        const polar = compositionRoot.complexOperationsGateway.rectToPolar(value);
        const sign = value.im < 0 ? "-" : "+";
        return `${roundDisplay(value.re)} ${sign} ${roundDisplay(Math.abs(value.im))}i  (r = ${roundDisplay(polar.radius)}, θ = ${roundDisplay(polar.angle)})`;
    };

    return (
        <div className={cssClass(styles.app)}>
            {renderOperandEditor(operandA, setOperandA, "A")}
            {renderOperandEditor(operandB, setOperandB, "B")}

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Add complex numbers"
                    onPress={() =>
                        runBinary((a, b) =>
                            renderResult(compositionRoot.complexOperationsGateway.add(a, b)),
                        )
                    }
                >
                    A + B
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Subtract complex numbers"
                    onPress={() =>
                        runBinary((a, b) =>
                            renderResult(compositionRoot.complexOperationsGateway.subtract(a, b)),
                        )
                    }
                >
                    A − B
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Multiply complex numbers"
                    onPress={() =>
                        runBinary((a, b) =>
                            renderResult(compositionRoot.complexOperationsGateway.multiply(a, b)),
                        )
                    }
                >
                    A × B
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Divide complex numbers"
                    onPress={() =>
                        runBinary((a, b) =>
                            renderResult(compositionRoot.complexOperationsGateway.divide(a, b)),
                        )
                    }
                >
                    A ÷ B
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Conjugate of A"
                    onPress={() =>
                        runUnary((a) =>
                            renderResult(compositionRoot.complexOperationsGateway.conjugate(a)),
                        )
                    }
                >
                    conj(A)
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Absolute value of A"
                    onPress={() =>
                        runUnary(
                            (a) =>
                                `|A| = ${roundDisplay(compositionRoot.complexOperationsGateway.abs(a))}`,
                        )
                    }
                >
                    |A|
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Argument of A"
                    onPress={() =>
                        runUnary(
                            (a) =>
                                `arg(A) = ${roundDisplay(compositionRoot.complexOperationsGateway.arg(a))} rad`,
                        )
                    }
                >
                    arg(A)
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {resultText !== null ? (
                    <p className={cssClass(styles.resultLine)}>{resultText}</p>
                ) : null}
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
                {!complexEnabled ? (
                    <p className={cssClass(styles.disabledNotice)}>
                        Complex numbers are disabled. Enable them in settings to run operations.
                    </p>
                ) : null}
            </div>
        </div>
    );
}

function roundDisplay(value: number): string {
    return String(Math.round(value * 1e10) / 1e10);
}
