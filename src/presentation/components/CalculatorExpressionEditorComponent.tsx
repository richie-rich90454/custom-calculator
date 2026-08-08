import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { Input, Label, TextField } from "react-aria-components";
import type { CalculatorUiActions } from "../../state/CalculatorUiActions";
import { DefaultExpressionEditorCaretRenderingService } from "../services/DefaultExpressionEditorCaretRenderingService";
import { DefaultExpressionEditorScrollService } from "../services/DefaultExpressionEditorScrollService";
import { defaultFocusPreservationService } from "../services/DefaultFocusPreservationService";
import { DefaultExpressionEditorSelectionService } from "../services/DefaultExpressionEditorSelectionService";
import { ExpressionEditorKeyboardService } from "../services/ExpressionEditorKeyboardService";
import { CalculatorCaretIndicatorComponent } from "./CalculatorCaretIndicatorComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorExpressionEditorComponent.module.css";

interface CalculatorExpressionEditorComponentProperties {
  readonly expressionText: string;
  readonly selectionStart: number;
  readonly selectionEnd: number;
  readonly errorText: string | null;
  readonly actions: CalculatorUiActions;
}

const caretRenderingService = new DefaultExpressionEditorCaretRenderingService();
const keyboardService = new ExpressionEditorKeyboardService();
const scrollService = new DefaultExpressionEditorScrollService();
const selectionService = new DefaultExpressionEditorSelectionService();

export function CalculatorExpressionEditorComponent(
  props: CalculatorExpressionEditorComponentProperties
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caretMeasureRef = useRef<HTMLSpanElement>(null);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const { actions, expressionText, selectionStart, selectionEnd, errorText } =
    props;

  useEffect(() => {
    // The input is mounted before effects run, so the ref is always set.
    inputRef.current!.setSelectionRange(selectionStart, selectionEnd);
  }, [selectionStart, selectionEnd, expressionText]);

  useEffect(() => {
    defaultFocusPreservationService.registerEditor({
      focus: () => inputRef.current?.focus(),
    });

    return () => {
      defaultFocusPreservationService.unregisterEditor();
    };
  }, []);

  const [caretOffsetX, setCaretOffsetX] = useState<number>(0);

  useEffect(() => {
    // The measure span is mounted before effects run, so the ref is set.
    setCaretOffsetX(caretMeasureRef.current!.offsetWidth);
  }, [selectionStart, expressionText]);

  useEffect(() => {
    const input = inputRef.current!;
    scrollService.scrollCaretIntoView({
      input: input,
      caretOffsetX: caretOffsetX,
      scrollPadding: 8,
    });
  }, [caretOffsetX, selectionStart, selectionEnd, expressionText]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.currentTarget;
    const selection = selectionService.resolveSelection(input);

    actions.onExpressionTextChanged(
      input.value,
      selection.start,
      selection.start,
      selection.end
    );
  };

  const handleInputSelect = (): void => {
    const input = inputRef.current!;
    const selection = selectionService.resolveSelection(input);

    if (selection.start === selectionStart && selection.end === selectionEnd) {
      return;
    }

    actions.onExpressionTextChanged(input.value, selection.end, selection.start, selection.end);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    const resolution = keyboardService.handleKeyDown(event, actions);

    if (resolution.handled) {
      event.preventDefault();
    }
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>): void => {
    const input = event.currentTarget;
    const selection = selectionService.resolveSelection(input);

    setHasFocus(true);
    actions.onExpressionTextChanged(input.value, selection.end, selection.start, selection.end);
  };

  const handleInputBlur = (): void => {
    setHasFocus(false);
  };

  const caretState = caretRenderingService.getCaretRenderingState(
    hasFocus,
    caretOffsetX
  );

  return (
    <TextField className={cssClass(styles.textField)}>
      <Label className={cssClass(styles.visuallyHidden)}>
        Calculator expression input
      </Label>
      <div className={cssClass(styles.editorRow)}>
        <Input
          ref={inputRef}
          className={cssClass(styles.input)}
          value={expressionText}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          /* Keyboard-first calculator: land focus in the editor on load. */
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- Focus on load enables immediate keyboard entry. */
          autoFocus
          {...(errorText !== null
            ? { "aria-describedby": "error-text" }
            : {})}
          onChange={handleInputChange}
          onSelect={handleInputSelect}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <span
          ref={caretMeasureRef}
          className={cssClass(styles.caretMeasure)}
          aria-hidden="true"
        >
          {expressionText.slice(0, selectionStart)}
        </span>
        {caretState.showIndicator ? (
          <CalculatorCaretIndicatorComponent offsetX={caretState.offsetX} />
        ) : null}
      </div>
    </TextField>
  );
}
