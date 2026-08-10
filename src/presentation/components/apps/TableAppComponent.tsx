import { useState } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../../utils/classNames";
import styles from "../../styles/TableAppComponent.module.css";

export function TableAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [functionText, setFunctionText] = useState<string>("");
    const [secondFunctionText, setSecondFunctionText] = useState<string>("");
    const [startText, setStartText] = useState<string>("1");
    const [endText, setEndText] = useState<string>("3");
    const [stepText, setStepText] = useState<string>("1");
    const [rows, setRows] = useState<
        readonly { x: number; fx: number | null; gx?: number | null }[]
    >([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const generateTable = (): void => {
        const start = Number(startText);
        const end = Number(endText);
        const step = Number(stepText);

        const result = compositionRoot.tableGenerationService.generate(
            functionText,
            start,
            end,
            step,
            secondFunctionText.trim() === "" ? undefined : secondFunctionText,
        );

        setRows(result.rows);
        setErrorText(result.errorMessage);
    };

    const clearTable = (): void => {
        setRows([]);
        setErrorText(null);
    };

    return (
        <div className={cssClass(styles.app)}>
            <div className={cssClass(styles.controlsRow)}>
                <AccessibleTextFieldComponent
                    label="f(x)"
                    value={functionText}
                    onChange={setFunctionText}
                />
                <AccessibleTextFieldComponent
                    label="g(x)"
                    value={secondFunctionText}
                    onChange={setSecondFunctionText}
                />
                <AccessibleTextFieldComponent
                    label="Start"
                    value={startText}
                    inputMode="decimal"
                    onChange={setStartText}
                />
                <AccessibleTextFieldComponent
                    label="End"
                    value={endText}
                    inputMode="decimal"
                    onChange={setEndText}
                />
                <AccessibleTextFieldComponent
                    label="Step"
                    value={stepText}
                    inputMode="decimal"
                    onChange={setStepText}
                />
            </div>

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Generate the table"
                    onPress={generateTable}
                >
                    Generate
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Clear the table"
                    onPress={clearTable}
                >
                    Clear
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
            </div>

            {rows.length > 0 ? (
                <div
                    className={cssClass(styles.tableWrapper)}
                    role="grid"
                    aria-label="Function table"
                >
                    <div className={cssClass(styles.tableRow)} role="row">
                        <span className={cssClass(styles.headCell)}>x</span>
                        <span className={cssClass(styles.headCell)}>f(x)</span>
                        {secondFunctionText.trim() !== "" ? (
                            <span className={cssClass(styles.headCell)}>g(x)</span>
                        ) : null}
                    </div>
                    {rows.map((row, index) => (
                        <div key={index} className={cssClass(styles.tableRow)} role="row">
                            <span className={cssClass(styles.bodyCell)}>{row.x}</span>
                            <span className={cssClass(styles.bodyCell)}>
                                {row.fx === null ? "—" : row.fx}
                            </span>
                            {secondFunctionText.trim() !== "" ? (
                                <span className={cssClass(styles.bodyCell)}>
                                    {row.gx === null ? "—" : row.gx}
                                </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
