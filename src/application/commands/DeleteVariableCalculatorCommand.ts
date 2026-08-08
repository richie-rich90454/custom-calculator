import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class DeleteVariableCalculatorCommand extends AbstractCalculatorCommand {
  public constructor(private readonly variableName: string) {
    super();
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    const updatedVariables = currentState.variables.filter(
      (variable) => variable.name !== this.variableName
    );

    return currentState.copyWith({
      variables: updatedVariables,
    });
  }
}
