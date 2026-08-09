import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { ResultFormatMode } from "../../domain/model/ResultFormatMode";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../primitives/AccessibleSelectComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorFixSciMenuComponent.module.css";

const FORMAT_DIGIT_CHOICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * FIX/SCI display format menu.
 *
 * The user picks standard, fixed-decimal, or scientific display for results,
 * with an optional digit count applied immediately to the current result.
 */
export function CalculatorFixSciMenuComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();
    const [digitCount, setDigitCount] = useState<number>(viewModel.resultFormatDigits);

    const applyFormat = (mode: ResultFormatMode): void => {
        store.getState().onResultFormatChanged(mode, digitCount);
    };

    return (
        <div className={cssClass(styles.menu)}>
            <div className={cssClass(styles.optionGroup)}>
                <AccessibleButtonComponent
                    customClassName={joinClassNames(
                        styles.optionButton,
                        viewModel.resultFormatMode === ResultFormatMode.STANDARD
                            ? styles.optionButtonActive
                            : undefined,
                    )}
                    aria-pressed={viewModel.resultFormatMode === ResultFormatMode.STANDARD}
                    onPress={() => applyFormat(ResultFormatMode.STANDARD)}
                >
                    Standard
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={joinClassNames(
                        styles.optionButton,
                        viewModel.resultFormatMode === ResultFormatMode.FIX
                            ? styles.optionButtonActive
                            : undefined,
                    )}
                    aria-pressed={viewModel.resultFormatMode === ResultFormatMode.FIX}
                    onPress={() => applyFormat(ResultFormatMode.FIX)}
                >
                    Fix decimal places
                </AccessibleButtonComponent>
                <AccessibleButtonComponent
                    customClassName={joinClassNames(
                        styles.optionButton,
                        viewModel.resultFormatMode === ResultFormatMode.SCI
                            ? styles.optionButtonActive
                            : undefined,
                    )}
                    aria-pressed={viewModel.resultFormatMode === ResultFormatMode.SCI}
                    onPress={() => applyFormat(ResultFormatMode.SCI)}
                >
                    Significant figures
                </AccessibleButtonComponent>
            </div>
            <div className={cssClass(styles.digitsRow)}>
                <span className={cssClass(styles.digitsLabel)}>Digits</span>
                <AccessibleSelectComponent
                    label="Result format digits"
                    selectedKey={String(digitCount)}
                    options={FORMAT_DIGIT_CHOICES.map((digits) => ({
                        id: String(digits),
                        label: String(digits),
                    }))}
                    onSelectionChange={(key) => {
                        const digits = Number(key);
                        setDigitCount(digits);
                        if (viewModel.resultFormatMode !== ResultFormatMode.STANDARD) {
                            store
                                .getState()
                                .onResultFormatChanged(viewModel.resultFormatMode, digits);
                        }
                    }}
                />
            </div>
        </div>
    );
}
