import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import type { CasService } from "../../domain/services/CasService";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import type { ExpressionValidationService } from "../../domain/services/ExpressionValidationService";
import type { NumericModePolicyService } from "../../domain/services/NumericModePolicyService";
import type { ScientificFunctionCatalogService } from "../../domain/services/ScientificFunctionCatalogService";
import { ChangeNumericModeCalculatorCommand } from "../commands/ChangeNumericModeCalculatorCommand";
import { ClearSessionCalculatorCommand } from "../commands/ClearSessionCalculatorCommand";
import { CycleAngleModeCalculatorCommand } from "../commands/CycleAngleModeCalculatorCommand";
import { DeleteBackwardCalculatorCommand } from "../commands/DeleteBackwardCalculatorCommand";
import { DeleteForwardCalculatorCommand } from "../commands/DeleteForwardCalculatorCommand";
import { DeleteVariableCalculatorCommand } from "../commands/DeleteVariableCalculatorCommand";
import { DeleteWordBackwardCalculatorCommand } from "../commands/DeleteWordBackwardCalculatorCommand";
import { DifferentiateExpressionCalculatorCommand } from "../commands/DifferentiateExpressionCalculatorCommand";
import { EvaluateExpressionCalculatorCommand } from "../commands/EvaluateExpressionCalculatorCommand";
import { ExpandExpressionCalculatorCommand } from "../commands/ExpandExpressionCalculatorCommand";
import { InsertConstantCalculatorCommand } from "../commands/InsertConstantCalculatorCommand";
import { InsertDigitCalculatorCommand } from "../commands/InsertDigitCalculatorCommand";
import { InsertFunctionCalculatorCommand } from "../commands/InsertFunctionCalculatorCommand";
import { InsertOperatorCalculatorCommand } from "../commands/InsertOperatorCalculatorCommand";
import { InsertParenthesisCalculatorCommand } from "../commands/InsertParenthesisCalculatorCommand";
import { InsertVariableCalculatorCommand } from "../commands/InsertVariableCalculatorCommand";
import { MemoryAddCalculatorCommand } from "../commands/MemoryAddCalculatorCommand";
import { MemoryClearCalculatorCommand } from "../commands/MemoryClearCalculatorCommand";
import { MemoryRecallCalculatorCommand } from "../commands/MemoryRecallCalculatorCommand";
import { MemorySubtractCalculatorCommand } from "../commands/MemorySubtractCalculatorCommand";
import { SaveVariableCalculatorCommand } from "../commands/SaveVariableCalculatorCommand";
import { SetExpressionTextCalculatorCommand } from "../commands/SetExpressionTextCalculatorCommand";
import { SimplifyExpressionCalculatorCommand } from "../commands/SimplifyExpressionCalculatorCommand";
import { ToggleCasModeCalculatorCommand } from "../commands/ToggleCasModeCalculatorCommand";
import { ToggleComplexNumbersCalculatorCommand } from "../commands/ToggleComplexNumbersCalculatorCommand";
import type { CalculatorApplicationController } from "./CalculatorApplicationController";

export class DefaultCalculatorApplicationController
  implements CalculatorApplicationController
{
  public constructor(
    private readonly expressionEditingService: ExpressionEditingService,
    private readonly expressionValidationService: ExpressionValidationService,
    private readonly expressionEvaluationGateway: ExpressionEvaluationGateway,
    private readonly numericModePolicyService: NumericModePolicyService,
    private readonly functionCatalogService: ScientificFunctionCatalogService,
    private readonly constantCatalogService: ConstantCatalogService,
    private readonly casService: CasService
  ) {}

  public insertDigit(
    currentState: CalculatorSessionState,
    digit: string
  ): CalculatorSessionState {
    return new InsertDigitCalculatorCommand(
      this.expressionEditingService,
      digit
    ).execute(currentState);
  }

  public insertOperator(
    currentState: CalculatorSessionState,
    operator: string
  ): CalculatorSessionState {
    return new InsertOperatorCalculatorCommand(
      this.expressionEditingService,
      operator
    ).execute(currentState);
  }

  public insertFunction(
    currentState: CalculatorSessionState,
    functionName: string
  ): CalculatorSessionState {
    return new InsertFunctionCalculatorCommand(
      this.expressionEditingService,
      functionName
    ).execute(currentState);
  }

  public insertConstant(
    currentState: CalculatorSessionState,
    constantId: string
  ): CalculatorSessionState {
    return new InsertConstantCalculatorCommand(
      this.expressionEditingService,
      this.constantCatalogService,
      constantId
    ).execute(currentState);
  }

  public insertVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState {
    return new InsertVariableCalculatorCommand(
      this.expressionEditingService,
      variableName
    ).execute(currentState);
  }

  public insertParenthesis(
    currentState: CalculatorSessionState,
    parenthesis: string
  ): CalculatorSessionState {
    return new InsertParenthesisCalculatorCommand(
      this.expressionEditingService,
      parenthesis
    ).execute(currentState);
  }

  public deleteBackward(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new DeleteBackwardCalculatorCommand(
      this.expressionEditingService
    ).execute(currentState);
  }

  public deleteForward(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new DeleteForwardCalculatorCommand(
      this.expressionEditingService
    ).execute(currentState);
  }

  public deleteWordBackward(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new DeleteWordBackwardCalculatorCommand(
      this.expressionEditingService
    ).execute(currentState);
  }

  public clearSession(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new ClearSessionCalculatorCommand().execute(currentState);
  }

  public setExpressionText(
    currentState: CalculatorSessionState,
    expressionText: string
  ): CalculatorSessionState {
    return new SetExpressionTextCalculatorCommand(
      expressionText
    ).execute(currentState);
  }

  public evaluateExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new EvaluateExpressionCalculatorCommand(
      this.expressionEditingService,
      this.expressionValidationService,
      this.expressionEvaluationGateway
    ).execute(currentState);
  }

  public cycleAngleMode(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new CycleAngleModeCalculatorCommand().execute(currentState);
  }

  public changeNumericMode(
    currentState: CalculatorSessionState,
    numericMode: NumericMode
  ): CalculatorSessionState {
    return new ChangeNumericModeCalculatorCommand(
      this.numericModePolicyService,
      numericMode
    ).execute(currentState);
  }

  public toggleComplexNumbers(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new ToggleComplexNumbersCalculatorCommand().execute(currentState);
  }

  public toggleCasMode(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new ToggleCasModeCalculatorCommand().execute(currentState);
  }

  public saveVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState {
    return new SaveVariableCalculatorCommand(
      this.functionCatalogService,
      this.constantCatalogService,
      variableName
    ).execute(currentState);
  }

  public deleteVariable(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState {
    return new DeleteVariableCalculatorCommand(
      variableName
    ).execute(currentState);
  }

  public memoryAdd(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new MemoryAddCalculatorCommand(
      this.expressionEvaluationGateway
    ).execute(currentState);
  }

  public memorySubtract(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new MemorySubtractCalculatorCommand(
      this.expressionEvaluationGateway
    ).execute(currentState);
  }

  public memoryRecall(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new MemoryRecallCalculatorCommand(
      this.expressionEditingService
    ).execute(currentState);
  }

  public memoryClear(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new MemoryClearCalculatorCommand().execute(currentState);
  }

  public simplifyExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new SimplifyExpressionCalculatorCommand(
      this.casService
    ).execute(currentState);
  }

  public expandExpression(
    currentState: CalculatorSessionState
  ): CalculatorSessionState {
    return new ExpandExpressionCalculatorCommand(
      this.casService
    ).execute(currentState);
  }

  public differentiateExpression(
    currentState: CalculatorSessionState,
    variableName: string
  ): CalculatorSessionState {
    return new DifferentiateExpressionCalculatorCommand(
      this.casService,
      variableName
    ).execute(currentState);
  }
}
