import { useState, type ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { AccessibleTextFieldComponent } from "../../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../../utils/classNames";
import type { VectorValue } from "../../../domain/model/VectorValue";
import styles from "../../styles/VectorAppComponent.module.css";

const VECTOR_NAMES = ["A", "B"] as const;
type VectorName = (typeof VECTOR_NAMES)[number];

type VectorOperationId = "dot" | "cross" | "magnitude" | "angle" | "unit";

interface VectorEditorState {
    readonly dimension: number;
    readonly components: readonly string[];
}

function createVectorState(): VectorEditorState {
    return { dimension: 3, components: ["", "", ""] };
}

export function VectorAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [vectors, setVectors] = useState<Record<VectorName, VectorEditorState>>({
        A: createVectorState(),
        B: createVectorState(),
    });
    const [selectedOperation, setSelectedOperation] = useState<VectorOperationId>("dot");
    const [resultText, setResultText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const gateway = compositionRoot.vectorOperationsGateway;

    const toNumericVector = (state: VectorEditorState): VectorValue => {
        const values: number[] = [];

        for (let index = 0; index < state.dimension; index += 1) {
            values.push(Number(state.components[index]!));
        }

        return values;
    };

    const updateComponent = (name: VectorName, index: number, value: string): void => {
        setVectors((current) => {
            const components = current[name].components.map((component, componentIndex) =>
                componentIndex === index ? value : component,
            );

            return { ...current, [name]: { ...current[name], components } };
        });
    };

    const resizeVector = (name: VectorName, dimension: number): void => {
        setVectors((current) => {
            const components = Array.from(
                { length: dimension },
                (_, index) => current[name].components[index] ?? "",
            );

            return { ...current, [name]: { dimension, components } };
        });
    };

    const renderVector = (name: VectorName): ReactNode => {
        const state = vectors[name];

        return (
            <section className={cssClass(styles.vectorSection)}>
                <h3 className={cssClass(styles.vectorHeading)}>Vec{name}</h3>
                <AccessibleSelectComponent
                    label={`Vec${name} dimension`}
                    selectedKey={String(state.dimension)}
                    options={[
                        { id: "2", label: "2 components" },
                        { id: "3", label: "3 components" },
                    ]}
                    onSelectionChange={(key) => resizeVector(name, Number(key))}
                />
                <div className={cssClass(styles.componentsRow)}>
                    {state.components.map((component, index) => (
                        <AccessibleTextFieldComponent
                            key={index}
                            label={`Vec${name} component ${index + 1}`}
                            value={component}
                            inputMode="decimal"
                            onChange={(value) => updateComponent(name, index, value)}
                        />
                    ))}
                </div>
            </section>
        );
    };

    const runSelectedOperation = (): void => {
        const a = toNumericVector(vectors.A);
        const b = toNumericVector(vectors.B);

        let result: { value: VectorValue | null; errorMessage: string | null };

        switch (selectedOperation) {
            case "dot":
                result = gateway.dot(a, b);
                break;
            case "cross":
                result = gateway.cross(a, b);
                break;
            case "magnitude":
                result = { value: [gateway.magnitude(a)], errorMessage: null };
                break;
            case "angle":
                result = gateway.angleBetween(a, b);
                break;
            case "unit":
                result = gateway.unit(a);
                break;
        }

        if (result.errorMessage !== null) {
            setResultText(null);
            setErrorText(result.errorMessage);
            return;
        }

        setErrorText(null);
        setResultText(formatVectorResult(selectedOperation, result.value as VectorValue));
    };

    return (
        <div className={cssClass(styles.app)}>
            {VECTOR_NAMES.map((name) => renderVector(name))}

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleSelectComponent
                    label="Vector operation"
                    selectedKey={selectedOperation}
                    options={[
                        { id: "dot", label: "Dot product" },
                        { id: "cross", label: "Cross product" },
                        { id: "magnitude", label: "Magnitude of A" },
                        { id: "angle", label: "Angle between A and B" },
                        { id: "unit", label: "Unit vector of A" },
                    ]}
                    onSelectionChange={(key) => setSelectedOperation(key as VectorOperationId)}
                />
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Run the selected vector operation"
                    onPress={runSelectedOperation}
                >
                    Compute
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

function formatVectorResult(operation: VectorOperationId, value: VectorValue): string {
    switch (operation) {
        case "dot":
            return `A · B = ${value[0]}`;
        case "cross":
            return `A × B = [${value.join(", ")}]`;
        case "magnitude":
            return `|A| = ${value[0]}`;
        case "angle":
            return `angle = ${value[0]} rad`;
        case "unit":
            return `Â = [${value.map((component) => round(component)).join(", ")}]`;
    }
}

function round(value: number): number {
    return Math.round(value * 1e10) / 1e10;
}
