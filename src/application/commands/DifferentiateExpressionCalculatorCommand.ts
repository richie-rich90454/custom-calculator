import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { CasService } from "../../domain/services/CasService";
import { AbstractCasCalculatorCommand } from "./AbstractCasCalculatorCommand";

export class DifferentiateExpressionCalculatorCommand extends AbstractCasCalculatorCommand {
  public constructor(
    casService: CasService,
    private readonly variableName: string
  ) {
    super(casService);
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return this.executeCasOperation(currentState, (casService) =>
      casService.differentiateExpression(
        currentState.expressionText,
        this.variableName
      )
    );
  }
}
