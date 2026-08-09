import { useState, type ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { cssClass } from "../../utils/classNames";
import type { MatrixValue } from "../../../domain/model/MatrixValue";
import styles from "../../styles/MatrixAppComponent.module.css";

const STORED_MATRIX_NAMES = ["A", "B", "C"] as const;
type StoredMatrixName = (typeof STORED_MATRIX_NAMES)[number];

type MatrixOperationId =
    | "add"
    | "subtract"
    | "multiply"
    | "transpose"
    | "determinant"
    | "inverse"
    | "identity";

interface MatrixEditorState {
    readonly rows: number;
    readonly columns: number;
    readonly cells: readonly (readonly string[])[];
}

function createMatrixState(): MatrixEditorState {
    const rows = 2;
    const columns = 2;

    return {
        rows,
        columns,
        cells: Array.from({ length: rows }, () => Array.from({ length: columns }, () => "")),
    };
}

export function MatrixAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [matrices, setMatrices] = useState<Record<StoredMatrixName, MatrixEditorState>>({
        A: createMatrixState(),
        B: createMatrixState(),
        C: createMatrixState(),
    });
    const [selectedOperation, setSelectedOperation] = useState<MatrixOperationId>("add");
    const [resultText, setResultText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const gateway = compositionRoot.matrixOperationsGateway;

    const toNumericMatrix = (state: MatrixEditorState): MatrixValue => {
        const numeric: number[][] = [];

        for (let row = 0; row < state.rows; row += 1) {
            const rowValues: number[] = [];

            for (let column = 0; column < state.columns; column += 1) {
                const value = Number((state.cells[row] as string[])[column]!);
                rowValues.push(value);
            }

            numeric.push(rowValues);
        }

        return numeric;
    };

    const updateCell = (
        name: StoredMatrixName,
        row: number,
        column: number,
        value: string,
    ): void => {
        setMatrices((current) => {
            const state = current[name];
            const cells = state.cells.map((rowCells, rowIndex) =>
                rowCells.map((cell, columnIndex) =>
                    rowIndex === row && columnIndex === column ? value : cell,
                ),
            );

            return { ...current, [name]: { ...state, cells } };
        });
    };

    const resizeMatrix = (name: StoredMatrixName, rows: number, columns: number): void => {
        setMatrices((current) => {
            const cells = Array.from({ length: rows }, (_, row) =>
                Array.from(
                    { length: columns },
                    (_, column) =>
                        (current[name].cells[row] as string[] | undefined)?.[column] ?? "",
                ),
            );

            return { ...current, [name]: { rows, columns, cells } };
        });
    };

    const renderMatrix = (name: StoredMatrixName): ReactNode => {
        const state = matrices[name];
        const rowOptions = [1, 2, 3, 4]
            .filter((value) => value >= 1)
            .map((value) => ({ id: String(value), label: `${value} rows` }));
        const columnOptions = [1, 2, 3, 4].map((value) => ({
            id: String(value),
            label: `${value} columns`,
        }));

        return (
            <section className={cssClass(styles.matrixSection)}>
                <h3 className={cssClass(styles.matrixHeading)}>Mat{name}</h3>
                <div className={cssClass(styles.matrixControls)}>
                    <AccessibleSelectComponent
                        label={`Mat${name} rows`}
                        selectedKey={String(state.rows)}
                        options={rowOptions}
                        onSelectionChange={(key) => resizeMatrix(name, Number(key), state.columns)}
                    />
                    <AccessibleSelectComponent
                        label={`Mat${name} columns`}
                        selectedKey={String(state.columns)}
                        options={columnOptions}
                        onSelectionChange={(key) => resizeMatrix(name, state.rows, Number(key))}
                    />
                </div>
                <div className={cssClass(styles.grid)} role="grid" aria-label={`Mat${name} cells`}>
                    {state.cells.map((row, rowIndex) => (
                        <div key={rowIndex} role="row">
                            {row.map((cell, columnIndex) => (
                                <input
                                    key={columnIndex}
                                    role="gridcell"
                                    className={cssClass(styles.cell)}
                                    aria-label={`Mat${name} row ${rowIndex + 1} column ${columnIndex + 1}`}
                                    inputMode="decimal"
                                    value={cell}
                                    onChange={(event) =>
                                        updateCell(name, rowIndex, columnIndex, event.target.value)
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const runSelectedOperation = (): void => {
        const a = toNumericMatrix(matrices.A);
        const b = toNumericMatrix(matrices.B);

        let result: { value: MatrixValue | null; errorMessage: string | null };
        let label = "";

        switch (selectedOperation) {
            case "add":
                result = gateway.add(a, b);
                label = "A + B";
                break;
            case "subtract":
                result = gateway.subtract(a, b);
                label = "A − B";
                break;
            case "multiply":
                result = gateway.multiply(a, b);
                label = "A × B";
                break;
            case "transpose":
                result = { value: gateway.transpose(a), errorMessage: null };
                label = "Aᵀ";
                break;
            case "determinant":
                result = { value: null, errorMessage: null };
                {
                    const determinant = gateway.determinant(a);
                    if (determinant.value === null) {
                        result = { value: null, errorMessage: determinant.errorMessage };
                    } else {
                        result = { value: [[determinant.value]], errorMessage: null };
                    }
                }
                label = "det(A)";
                break;
            case "inverse":
                result = gateway.inverse(a);
                label = "A⁻¹";
                break;
            case "identity":
                result = { value: gateway.identity(3), errorMessage: null };
                label = "I₃";
                break;
        }

        if (result.errorMessage !== null) {
            setResultText(null);
            setErrorText(result.errorMessage);
            return;
        }

        setErrorText(null);
        setResultText(`${label} = ${formatMatrix(result.value as MatrixValue)}`);
    };

    const clearMatrix = (name: StoredMatrixName): void => {
        setMatrices((current) => {
            const rows = current[name].rows;
            const columns = current[name].columns;

            return {
                ...current,
                [name]: {
                    rows,
                    columns,
                    cells: Array.from({ length: rows }, () =>
                        Array.from({ length: columns }, () => ""),
                    ),
                },
            };
        });
    };

    return (
        <div className={cssClass(styles.app)}>
            {STORED_MATRIX_NAMES.map((name) => renderMatrix(name))}

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleSelectComponent
                    label="Matrix operation"
                    selectedKey={selectedOperation}
                    options={[
                        { id: "add", label: "A + B" },
                        { id: "subtract", label: "A − B" },
                        { id: "multiply", label: "A × B" },
                        { id: "transpose", label: "Transpose A" },
                        { id: "determinant", label: "Determinant of A" },
                        { id: "inverse", label: "Inverse of A" },
                        { id: "identity", label: "Identity (3×3)" },
                    ]}
                    onSelectionChange={(key) => setSelectedOperation(key as MatrixOperationId)}
                />
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Run the selected matrix operation"
                    onPress={runSelectedOperation}
                >
                    Compute
                </AccessibleButtonComponent>
                {STORED_MATRIX_NAMES.map((name) => (
                    <AccessibleButtonComponent
                        key={name}
                        customClassName={cssClass(styles.actionButton)}
                        aria-label={`Clear Mat${name}`}
                        onPress={() => clearMatrix(name)}
                    >
                        Clear Mat{name}
                    </AccessibleButtonComponent>
                ))}
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

function formatMatrix(matrix: MatrixValue): string {
    return `[${matrix.map((row) => `[${row.join(", ")}]`).join(", ")}]`;
}
