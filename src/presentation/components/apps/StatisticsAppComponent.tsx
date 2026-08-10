import { useState, type ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { cssClass } from "../../utils/classNames";
import styles from "../../styles/StatisticsAppComponent.module.css";

type RegressionMode = "linear" | "quadratic";

const MAX_ROWS = 8;

export function StatisticsAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [xs, setXs] = useState<readonly string[]>(["", "", "", ""]);
    const [ys, setYs] = useState<readonly string[]>(["", "", "", ""]);
    const [mode, setMode] = useState<RegressionMode>("linear");
    const [predictInput, setPredictInput] = useState<string>("");
    const [summaryText, setSummaryText] = useState<string | null>(null);
    const [regressionText, setRegressionText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const statisticsService = compositionRoot.statisticsSummaryService;
    const regressionService = compositionRoot.regressionAnalysisService;

    const toNumbers = (values: readonly string[]): number[] => {
        const numbers: number[] = [];

        for (const value of values) {
            const trimmed = value.trim();

            if (trimmed !== "") {
                numbers.push(Number(trimmed));
            }
        }

        return numbers;
    };

    const runStatistics = (): void => {
        const data = toNumbers(xs);

        if (data.length === 0) {
            setSummaryText(null);
            setRegressionText(null);
            setErrorText("Enter at least one data value in the x column.");
            return;
        }

        const result = statisticsService.summarize(data);

        if (result.summary === null) {
            setSummaryText(null);
            setErrorText(result.errorMessage);
            return;
        }

        const summary = result.summary;
        setSummaryText(
            `n = ${summary.count}, Σx = ${summary.sumX}, Σx² = ${summary.sumX2}, ` +
                `mean = ${round(summary.mean)}, population σ = ${round(summary.populationSigma)}, ` +
                `sample s = ${round(summary.sampleSigma)}, min = ${summary.min}, max = ${summary.max}`,
        );
        setErrorText(null);
    };

    const runRegression = (): void => {
        const xData = toNumbers(xs);
        const yData = toNumbers(ys);

        if (xData.length < 2 || yData.length < 2) {
            setRegressionText(null);
            setErrorText("Enter paired data in both the x and y columns.");
            return;
        }

        const result =
            mode === "linear"
                ? regressionService.linear(xData, yData)
                : regressionService.quadratic(xData, yData);

        if (result.errorMessage !== null) {
            setRegressionText(null);
            setErrorText(result.errorMessage);
            return;
        }

        setErrorText(null);

        if (result.linear !== null) {
            const predicted =
                predictInput.trim() !== ""
                    ? `, f(${predictInput}) = ${round(result.linear.slope * Number(predictInput) + result.linear.intercept)}`
                    : "";
            setRegressionText(
                `y = ${round(result.linear.slope)}x + ${round(result.linear.intercept)}, ` +
                    `r = ${round(result.linear.r)}, r² = ${round(result.linear.r2)}${predicted}`,
            );
            return;
        }

        const quadratic = result.quadratic!;
        const predicted =
            predictInput.trim() !== ""
                ? `, f(${predictInput}) = ${round(
                      quadratic.a * Number(predictInput) ** 2 +
                          quadratic.b * Number(predictInput) +
                          quadratic.c,
                  )}`
                : "";
        setRegressionText(
            `y = ${round(quadratic.a)}x² + ${round(quadratic.b)}x + ` +
                `${round(quadratic.c)}, r² = ${round(quadratic.r2)}${predicted}`,
        );
    };

    const renderColumnEditor = (
        label: string,
        values: readonly string[],
        onChange: (next: readonly string[]) => void,
    ): ReactNode => {
        return (
            <div className={cssClass(styles.column)}>
                <h3 className={cssClass(styles.columnHeading)}>{label}</h3>
                {values.map((value, index) => (
                    <input
                        key={index}
                        className={cssClass(styles.cell)}
                        aria-label={`${label} value ${index + 1}`}
                        inputMode="decimal"
                        value={value}
                        onChange={(event) => {
                            const next = values.map((cell, cellIndex) =>
                                cellIndex === index ? event.target.value : cell,
                            );
                            onChange(next);
                        }}
                    />
                ))}
            </div>
        );
    };

    const addRow = (): void => {
        if (xs.length >= MAX_ROWS) {
            return;
        }

        setXs((current) => [...current, ""]);
        setYs((current) => [...current, ""]);
    };

    return (
        <div className={cssClass(styles.app)}>
            <div className={cssClass(styles.editor)}>
                {renderColumnEditor("x", xs, setXs)}
                {renderColumnEditor("y", ys, setYs)}
            </div>

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Add a data row"
                    onPress={addRow}
                >
                    Add row
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Compute statistics"
                    onPress={runStatistics}
                >
                    Statistics
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.regressionGroup)}>
                <AccessibleSelectComponent
                    label="Regression mode"
                    selectedKey={mode}
                    options={[
                        { id: "linear", label: "Linear" },
                        { id: "quadratic", label: "Quadratic" },
                    ]}
                    onSelectionChange={(key) => setMode(key as RegressionMode)}
                />
                <input
                    className={cssClass(styles.cell)}
                    aria-label="Prediction x value"
                    inputMode="decimal"
                    value={predictInput}
                    onChange={(event) => setPredictInput(event.target.value)}
                />
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Compute regression"
                    onPress={runRegression}
                >
                    Regression
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {summaryText !== null ? (
                    <p className={cssClass(styles.resultLine)}>{summaryText}</p>
                ) : null}
                {regressionText !== null ? (
                    <p className={cssClass(styles.resultLine)}>{regressionText}</p>
                ) : null}
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
            </div>
        </div>
    );
}

function round(value: number): number {
    return Math.round(value * 1e6) / 1e6;
}
