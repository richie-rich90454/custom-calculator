import { useCalculatorViewModel } from "../../hooks/useCalculatorViewModel";
import { CalculatorDisplayComponent } from "../CalculatorDisplayComponent";
import { CalculatorKeypadComponent } from "../CalculatorKeypadComponent";
import { ComplexAppComponent } from "./ComplexAppComponent";
import { BaseNAppComponent } from "./BaseNAppComponent";
import { MatrixAppComponent } from "./MatrixAppComponent";
import { VectorAppComponent } from "./VectorAppComponent";

/**
 * Renders the active app: the calculate app shows the classic display and
 * keypad, while every other app renders its dedicated app component.
 */
export function CalculatorAppViewComponent() {
    const viewModel = useCalculatorViewModel();

    switch (viewModel.activeAppMode) {
        case "calculate":
            return (
                <>
                    <CalculatorDisplayComponent />
                    <CalculatorKeypadComponent />
                </>
            );
        case "complex":
            return <ComplexAppComponent />;
        case "base-n":
            return <BaseNAppComponent />;
        case "matrix":
            return <MatrixAppComponent />;
        case "vector":
            return <VectorAppComponent />;
        default:
            return <p>App not available.</p>;
    }
}
