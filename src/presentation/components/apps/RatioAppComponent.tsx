import { useState } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../../utils/classNames";
import styles from "../../styles/RatioAppComponent.module.css";

export function RatioAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [aText, setAText] = useState<string>("");
    const [bText, setBText] = useState<string>("");
    const [cText, setCText] = useState<string>("");
    const [dText, setDText] = useState<string>("");
    const [resultText, setResultText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const solveRatio = (): void => {
        const texts = [aText, bText, cText, dText];

        if (texts.some((text) => text.trim() !== "" && Number.isNaN(Number(text)))) {
            setResultText(null);
            setErrorText("Ratio terms must be valid numbers.");
            return;
        }

        const result = compositionRoot.ratioSolverService.solve(
            parseOptional(aText),
            parseOptional(bText),
            parseOptional(cText),
            parseOptional(dText),
        );

        if (result.value === null) {
            setResultText(null);
            setErrorText(result.errorMessage);
            return;
        }

        setResultText(`missing term = ${round(result.value)}`);
        setErrorText(null);
    };

    return (
        <div className={cssClass(styles.app)}>
            <div className={cssClass(styles.ratioRow)}>
                <AccessibleTextFieldComponent
                    label="First term"
                    value={aText}
                    inputMode="decimal"
                    onChange={setAText}
                />
                <span className={cssClass(styles.ratioSymbol)}>:</span>
                <AccessibleTextFieldComponent
                    label="Second term"
                    value={bText}
                    inputMode="decimal"
                    onChange={setBText}
                />
                <span className={cssClass(styles.ratioSymbol)}>=</span>
                <AccessibleTextFieldComponent
                    label="Third term"
                    value={cText}
                    inputMode="decimal"
                    onChange={setCText}
                />
                <span className={cssClass(styles.ratioSymbol)}>:</span>
                <AccessibleTextFieldComponent
                    label="Fourth term"
                    value={dText}
                    inputMode="decimal"
                    onChange={setDText}
                />
            </div>

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Solve the ratio"
                    onPress={solveRatio}
                >
                    Solve
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {resultText !== null ? (
                    <p className={cssClass(styles.resultLine)}>{resultText}</p>
                ) : null}
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
            </div>
        </div>
    );
}

function parseOptional(text: string): number | null {
    return text.trim() === "" ? null : Number(text);
}

function round(value: number): number {
    return Math.round(value * 1e9) / 1e9;
}
