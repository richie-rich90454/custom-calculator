import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Input, Label, TextField } from "react-aria-components";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import styles from "../styles/CalculatorDisplayComponent.module.css";

export function CalculatorDisplayComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;

    if (input === null) {
      return;
    }

    input.setSelectionRange(
      viewModel.selectionStart,
      viewModel.selectionEnd
    );
  }, [
    viewModel.selectionStart,
    viewModel.selectionEnd,
    viewModel.expressionText,
  ]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.currentTarget;

    store.getState().onExpressionTextChanged(
      input.value,
      input.selectionStart ?? input.value.length,
      input.selectionStart ?? input.value.length,
      input.selectionEnd ?? input.value.length
    );
  };

  const handleInputSelect = (): void => {
    const input = inputRef.current;

    if (input === null) {
      return;
    }

    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? input.value.length;

    if (
      selectionStart === viewModel.selectionStart &&
      selectionEnd === viewModel.selectionEnd
    ) {
      return;
    }

    store.getState().onExpressionTextChanged(
      input.value,
      selectionEnd,
      selectionStart,
      selectionEnd
    );
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      store.getState().onEvaluatePressed();
      return;
    }

    if (event.key === "Backspace" && event.ctrlKey) {
      event.preventDefault();
      store.getState().onDeleteWordBackwardPressed();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      store.getState().onDeleteBackwardPressed();
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      store.getState().onDeleteForwardPressed();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      store.getState().onClearPressed();
    }
  };

  return (
    <div className={styles.display}>
      <TextField className={styles.textField}>
        <Label className={styles.visuallyHidden}>
          Calculator expression input
        </Label>
        <Input
          ref={inputRef}
          className={styles.input}
          value={viewModel.expressionText}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={viewModel.errorText !== null ? "error-text" : undefined}
          onChange={handleInputChange}
          onSelect={handleInputSelect}
          onKeyDown={handleInputKeyDown}
        />
      </TextField>

      <div className={styles.resultRow}>
        {viewModel.resultText !== null ? (
          <output className={styles.result} aria-live="polite">
            = {viewModel.resultText}
          </output>
        ) : null}
      </div>

      {viewModel.errorText !== null ? (
        <p id="error-text" className={styles.error} role="alert">
          {viewModel.errorText}
        </p>
      ) : null}
    </div>
  );
}
