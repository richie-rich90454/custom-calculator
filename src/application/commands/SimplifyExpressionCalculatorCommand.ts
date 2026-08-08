import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { CasService } from "../../domain/services/CasService";
import { AbstractCasCalculatorCommand } from "./AbstractCasCalculatorCommand";

export class SimplifyExpressionCalculatorCommand extends AbstractCasCalculatorCommand {
  public constructor(casService: CasService) {
    super(casService);
  }

  public override execute(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return this.executeCasOperation(currentState, (casService) =>
      casService.simplifyExpression(currentState.expressionText)
    );
  }
}
