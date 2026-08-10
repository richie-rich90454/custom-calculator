import { renderToString } from "katex";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKaTeXPreviewComponent.module.css";

export function CalculatorKaTeXPreviewComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    if (!viewModel.isKaTeXPreviewEnabled || viewModel.expressionText.trim().length === 0) {
        return null;
    }

    const conversion = compositionRoot.expressionTexConverter.convertToTex(
        viewModel.expressionText,
    );
    const fallbackText = escapeLatex(viewModel.expressionText);
    const renderedMath = renderToString(conversion.tex ?? fallbackText, {
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

function escapeLatex(text: string): string {
    return text.replace(/([\\{}_$#%&^])/g, "\\$1");
}
