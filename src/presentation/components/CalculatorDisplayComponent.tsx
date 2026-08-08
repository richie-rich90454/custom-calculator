import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { CalculatorErrorLineComponent } from "./CalculatorErrorLineComponent";
import { CalculatorExpressionEditorComponent } from "./CalculatorExpressionEditorComponent";
import { CalculatorResultLineComponent } from "./CalculatorResultLineComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorDisplayComponent.module.css";

export function CalculatorDisplayComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  return (
    <div className={cssClass(styles.display)}>
      <CalculatorExpressionEditorComponent
        expressionText={viewModel.expressionText}
        selectionStart={viewModel.selectionStart}
        selectionEnd={viewModel.selectionEnd}
        errorText={viewModel.errorText}
        actions={store.getState()}
      />
      <CalculatorResultLineComponent resultText={viewModel.resultText} />
      <CalculatorErrorLineComponent errorText={viewModel.errorText} />
    </div>
  );
}
