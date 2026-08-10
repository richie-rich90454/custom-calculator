import { useState, type ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { cssClass } from "../../utils/classNames";
import styles from "../../styles/EquationAppComponent.module.css";

type EquationMode = "polynomial" | "simultaneous";

function createCoefficientState(degree: number): readonly string[] {
    return Array.from({ length: degree + 1 }, () => "");
}

export function EquationAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [mode, setMode] = useState<EquationMode>("polynomial");
    const [degree, setDegree] = useState<number>(2);
    const [coefficients, setCoefficients] = useState<readonly string[]>(() =>
        createCoefficientState(2),
    );
    const [unknownCount, setUnknownCount] = useState<number>(2);
    const [coefficientMatrix, setCoefficientMatrix] = useState<readonly (readonly string[])[]>(() =>
        createSimultaneousState(2),
    );
    const [constants, setConstants] = useState<readonly string[]>(() =>
        Array.from({ length: 2 }, () => ""),
    );
    const [resultLines, setResultLines] = useState<readonly string[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    const polynomialService = compositionRoot.polynomialRootService;
    const simultaneousService = compositionRoot.simultaneousEquationService;

    const changeDegree = (nextDegree: number): void => {
        setDegree(nextDegree);
        setCoefficients(createCoefficientState(nextDegree));
    };

    const updateCoefficient = (index: number, value: string): void => {
        setCoefficients((current) =>
            current.map((coefficient, coefficientIndex) =>
                coefficientIndex === index ? value : coefficient,
            ),
        );
    };

    const changeUnknownCount = (nextCount: number): void => {
        setUnknownCount(nextCount);
        setCoefficientMatrix(createSimultaneousState(nextCount));
        setConstants(Array.from({ length: nextCount }, () => ""));
    };

    const updateCell = (row: number, column: number, value: string): void => {
        setCoefficientMatrix((current) =>
            current.map((currentRow, rowIndex) =>
                currentRow.map((cell, columnIndex) =>
                    rowIndex === row && columnIndex === column ? value : cell,
                ),
            ),
        );
    };

    const updateConstant = (index: number, value: string): void => {
        setConstants((current) =>
            current.map((constant, constantIndex) => (constantIndex === index ? value : constant)),
        );
    };

    const runPolynomial = (): void => {
        if (coefficients.some((coefficient) => coefficient.trim() === "")) {
            setResultLines([]);
            setErrorText("Fill every coefficient field with a number.");
            return;
        }

        const numeric = coefficients.map((coefficient) => Number(coefficient));

        if (numeric.some((coefficient) => Number.isNaN(coefficient))) {
            setResultLines([]);
            setErrorText("Fill every coefficient field with a number.");
            return;
        }

        const result = polynomialService.solve(numeric);

        if (result.errorMessage !== null) {
            setResultLines([]);
            setErrorText(result.errorMessage);
            return;
        }

        setErrorText(null);
        const sortedRoots = [...result.roots].sort((a, b) => a.re - b.re || a.im - b.im);
        setResultLines(
            sortedRoots.map((root, index) => {
                const rootText =
                    Math.abs(root.im) < 1e-9
                        ? `x${index + 1} = ${round(root.re)}`
                        : `x${index + 1} = ${round(root.re)} ${root.im < 0 ? "-" : "+"} ${round(Math.abs(root.im))}i`;
                return rootText;
            }),
        );
    };

    const runSimultaneous = (): void => {
        if (
            coefficientMatrix.some((row) => row.some((cell) => cell.trim() === "")) ||
            constants.some((constant) => constant.trim() === "")
        ) {
            setResultLines([]);
            setErrorText("Fill every equation field with a number.");
            return;
        }

        const matrix = coefficientMatrix.map((row) => row.map((cell) => Number(cell)));
        const constantValues = constants.map((constant) => Number(constant));

        if (
            matrix.some((row) => row.some((cell) => Number.isNaN(cell))) ||
            constantValues.some((constant) => Number.isNaN(constant))
        ) {
            setResultLines([]);
            setErrorText("Fill every equation field with a number.");
            return;
        }

        const result = simultaneousService.solve(matrix, constantValues);

        if (result.errorMessage !== null) {
            setResultLines([]);
            setErrorText(result.errorMessage);
            return;
        }

        setErrorText(null);
        setResultLines(
            (result.solution as readonly number[]).map(
                (value, index) => `x${index + 1} = ${round(value)}`,
            ),
        );
    };

    const renderPolynomialEditor = (): ReactNode => {
        return (
            <div className={cssClass(styles.editor)}>
                <AccessibleSelectComponent
                    label="Polynomial degree"
                    selectedKey={String(degree)}
                    options={[
                        { id: "2", label: "Degree 2" },
                        { id: "3", label: "Degree 3" },
                        { id: "4", label: "Degree 4" },
                    ]}
                    onSelectionChange={(key) => changeDegree(Number(key))}
                />
                <div className={cssClass(styles.coefficientRow)}>
                    {coefficients.map((coefficient, index) => (
                        <input
                            key={index}
                            className={cssClass(styles.cell)}
                            aria-label={`Coefficient of x^${degree - index}`}
                            inputMode="decimal"
                            value={coefficient}
                            onChange={(event) => updateCoefficient(index, event.target.value)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderSimultaneousEditor = (): ReactNode => {
        return (
            <div className={cssClass(styles.editor)}>
                <AccessibleSelectComponent
                    label="Unknown count"
                    selectedKey={String(unknownCount)}
                    options={[
                        { id: "2", label: "2 unknowns" },
                        { id: "3", label: "3 unknowns" },
                    ]}
                    onSelectionChange={(key) => changeUnknownCount(Number(key))}
                />
                <div
                    className={cssClass(styles.simultaneousGrid)}
                    role="grid"
                    aria-label="Equation coefficients"
                >
                    {coefficientMatrix.map((row, rowIndex) => (
                        <div key={rowIndex} className={cssClass(styles.simultaneousRow)} role="row">
                            {row.map((cell, columnIndex) => (
                                <input
                                    key={columnIndex}
                                    className={cssClass(styles.cell)}
                                    role="gridcell"
                                    aria-label={`Equation ${rowIndex + 1} coefficient ${columnIndex + 1}`}
                                    inputMode="decimal"
                                    value={cell}
                                    onChange={(event) =>
                                        updateCell(rowIndex, columnIndex, event.target.value)
                                    }
                                />
                            ))}
                            <span className={cssClass(styles.equationLabel)}>=</span>
                            <input
                                className={cssClass(styles.cell)}
                                aria-label={`Equation ${rowIndex + 1} constant`}
                                inputMode="decimal"
                                value={constants[rowIndex]!}
                                onChange={(event) => updateConstant(rowIndex, event.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={cssClass(styles.app)}>
            <AccessibleSelectComponent
                label="Equation mode"
                selectedKey={mode}
                options={[
                    { id: "polynomial", label: "Polynomial" },
                    { id: "simultaneous", label: "Simultaneous" },
                ]}
                onSelectionChange={(key) => setMode(key as EquationMode)}
            />

            {mode === "polynomial" ? renderPolynomialEditor() : renderSimultaneousEditor()}

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Solve the equation"
                    onPress={mode === "polynomial" ? runPolynomial : runSimultaneous}
                >
                    Solve
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {resultLines.map((line) => (
                    <p key={line} className={cssClass(styles.resultLine)}>
                        {line}
                    </p>
                ))}
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
            </div>
        </div>
    );
}

function createSimultaneousState(unknownCount: number): readonly (readonly string[])[] {
    return Array.from({ length: unknownCount }, () =>
        Array.from({ length: unknownCount }, () => ""),
    );
}

function round(value: number): number {
    return Math.round(value * 1e9) / 1e9;
}
