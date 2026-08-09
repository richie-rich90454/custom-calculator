import { renderToString } from "katex";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKaTeXPreviewComponent.module.css";

export function CalculatorKaTeXPreviewComponent() {
    const viewModel = useCalculatorViewModel();

    if (!viewModel.isKaTeXPreviewEnabled || viewModel.expressionText.trim().length === 0) {
        return null;
    }

    const renderedMath = renderToString(viewModel.expressionText, {
        throwOnError: false,
        displayMode: false,
    });

    return (
        <div className={cssClass(styles.preview)} aria-label="Pretty preview">
            <span
                className={cssClass(styles.math)}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: renderedMath }}
            />
        </div>
    );
}
