import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { CalculatorSettings } from "../../domain/model/CalculatorSettings";
import type { CalculatorUiState } from "../../state/CalculatorUiState";

export class CalculatorViewModelMapper {
  public mapUiStateToSessionState(
    uiState: CalculatorUiState
  ): CalculatorSessionState {
    return new CalculatorSessionState(
      uiState.expressionText,
      uiState.cursorPosition,
      uiState.selectionStart,
      uiState.selectionEnd,
      uiState.resultText,
      uiState.errorText,
      uiState.lastResultText,
      uiState.lastResultValue,
      uiState.angleMode,
      uiState.numericMode,
      uiState.complexNumbersEnabled,
      uiState.casEnabled,
      uiState.variables,
      uiState.memoryValueText
    );
  }

  public mapSessionStateToUiState(
    sessionState: CalculatorSessionState,
    currentUiState: CalculatorUiState
  ): CalculatorUiState {
    return {
      ...currentUiState,
      expressionText: sessionState.expressionText,
      cursorPosition: sessionState.cursorPosition,
      selectionStart: sessionState.selectionStart,
      selectionEnd: sessionState.selectionEnd,
      resultText: sessionState.resultText,
      errorText: sessionState.errorText,
      lastResultText: sessionState.lastResultText,
      lastResultValue: sessionState.lastResultValue,
      angleMode: sessionState.angleMode,
      numericMode: sessionState.numericMode,
      complexNumbersEnabled: sessionState.complexNumbersEnabled,
      casEnabled: sessionState.casEnabled,
      variables: sessionState.variables,
      memoryValueText: sessionState.memoryValueText,
    };
  }

  public mapUiStateToSettings(uiState: CalculatorUiState): CalculatorSettings {
    return new CalculatorSettings(
      uiState.angleMode,
      uiState.numericMode,
      uiState.complexNumbersEnabled,
      uiState.casEnabled,
      uiState.themePreference
    );
  }
}
