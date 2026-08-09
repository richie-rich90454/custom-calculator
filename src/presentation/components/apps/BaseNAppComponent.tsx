import { useState } from "react";
import { useCalculatorApplicationContext } from "../../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../../primitives/AccessibleSelectComponent";
import { AccessibleTextFieldComponent } from "../../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../../utils/classNames";
import type {
    BaseNBase,
    BaseNWordSize,
} from "../../../application/services/BigIntBaseNArithmeticService";
import styles from "../../styles/BaseNAppComponent.module.css";

const BASES: readonly BaseNBase[] = [10, 16, 2, 8];
const WORD_SIZES: readonly BaseNWordSize[] = [8, 16, 32, 64];

export function BaseNAppComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();
    const [base, setBase] = useState<BaseNBase>(10);
    const [wordSize, setWordSize] = useState<BaseNWordSize>(32);
    const [valueText, setValueText] = useState<string>("0");
    const [operandText, setOperandText] = useState<string>("0");
    const [resultLines, setResultLines] = useState<readonly string[]>([]);

    const bigIntSupported = viewModel.bigIntSupported;

    const service = compositionRoot.bigIntBaseNArithmeticService;

    const renderAllBases = (value: bigint): readonly string[] =>
        BASES.map(
            (displayBase) =>
                `${displayBase === 10 ? "DEC" : displayBase === 16 ? "HEX" : displayBase === 2 ? "BIN" : "OCT"}: ${service.toBase(value, displayBase, wordSize)}`,
        );

    const runBinaryOperation = (
        operation: (a: bigint, b: bigint) => bigint,
        label: string,
    ): void => {
        const a = service.parse(valueText, base, wordSize);
        const b = service.parse(operandText, base, wordSize);
        const result = operation(a, b);
        setResultLines([`${label}:`, ...renderAllBases(result)]);
    };

    const runUnaryOperation = (operation: (a: bigint) => bigint, label: string): void => {
        const a = service.parse(valueText, base, wordSize);
        const result = operation(a);
        setResultLines([`${label}:`, ...renderAllBases(result)]);
    };

    if (!bigIntSupported) {
        return (
            <div className={cssClass(styles.app)} role="status">
                <p className={cssClass(styles.unavailableMessage)}>
                    BigInt is not supported in this browser, so base-n arithmetic is unavailable.
                </p>
            </div>
        );
    }

    return (
        <div className={cssClass(styles.app)}>
            <div className={cssClass(styles.controlsRow)}>
                <AccessibleSelectComponent
                    label="Number base"
                    selectedKey={String(base)}
                    options={BASES.map((value) => ({
                        id: String(value),
                        label: resolveBaseName(value),
                    }))}
                    onSelectionChange={(key) => setBase(Number(key) as BaseNBase)}
                />
                <AccessibleSelectComponent
                    label="Word size"
                    selectedKey={String(wordSize)}
                    options={WORD_SIZES.map((value) => ({
                        id: String(value),
                        label: `${value} bits`,
                    }))}
                    onSelectionChange={(key) => setWordSize(Number(key) as BaseNWordSize)}
                />
            </div>

            <div className={cssClass(styles.fieldsRow)}>
                <AccessibleTextFieldComponent
                    label="Value"
                    value={valueText}
                    onChange={setValueText}
                />
                <AccessibleTextFieldComponent
                    label="Second operand"
                    value={operandText}
                    onChange={setOperandText}
                />
            </div>

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Bitwise and base-n values"
                    onPress={() =>
                        runBinaryOperation((a, b) => service.and(a, b, wordSize), "A AND B")
                    }
                >
                    AND
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Bitwise or base-n values"
                    onPress={() =>
                        runBinaryOperation((a, b) => service.or(a, b, wordSize), "A OR B")
                    }
                >
                    OR
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Bitwise exclusive or base-n values"
                    onPress={() =>
                        runBinaryOperation((a, b) => service.xor(a, b, wordSize), "A XOR B")
                    }
                >
                    XOR
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Bitwise not of the value"
                    onPress={() => runUnaryOperation((a) => service.not(a, wordSize), "NOT A")}
                >
                    NOT
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Negate the value"
                    onPress={() => runUnaryOperation((a) => service.neg(a, wordSize), "NEG A")}
                >
                    NEG
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Add base-n values"
                    onPress={() =>
                        runBinaryOperation((a, b) => service.add(a, b, wordSize), "A + B")
                    }
                >
                    ADD
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {resultLines.map((line) => (
                    <p key={line} className={cssClass(styles.resultLine)}>
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}

function resolveBaseName(base: BaseNBase): string {
    switch (base) {
        case 2:
            return "BIN";
        case 8:
            return "OCT";
        case 16:
            return "HEX";
        default:
            return "DEC";
    }
}
