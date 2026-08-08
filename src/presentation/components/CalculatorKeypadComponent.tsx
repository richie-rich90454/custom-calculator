import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

enum KeyKind {
  DIGIT = "DIGIT",
  OPERATOR = "OPERATOR",
  FUNCTION = "FUNCTION",
  CONSTANT = "CONSTANT",
  PARENTHESIS = "PARENTHESIS",
  CLEAR = "CLEAR",
  DELETE_BACKWARD = "DELETE_BACKWARD",
  DELETE_FORWARD = "DELETE_FORWARD",
  EVALUATE = "EVALUATE",
  ANS = "ANS",
  MEMORY_RECALL = "MEMORY_RECALL",
}

interface KeySpec {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly kind: KeyKind;
  readonly value: string;
}

const FUNCTION_KEYS: readonly KeySpec[] = [
  { id: "sin", label: "sin", ariaLabel: "Sine function", kind: KeyKind.FUNCTION, value: "sin" },
  { id: "cos", label: "cos", ariaLabel: "Cosine function", kind: KeyKind.FUNCTION, value: "cos" },
  { id: "tan", label: "tan", ariaLabel: "Tangent function", kind: KeyKind.FUNCTION, value: "tan" },
  { id: "asin", label: "asin", ariaLabel: "Inverse sine function", kind: KeyKind.FUNCTION, value: "asin" },
  { id: "acos", label: "acos", ariaLabel: "Inverse cosine function", kind: KeyKind.FUNCTION, value: "acos" },
  { id: "atan", label: "atan", ariaLabel: "Inverse tangent function", kind: KeyKind.FUNCTION, value: "atan" },
  { id: "sinh", label: "sinh", ariaLabel: "Hyperbolic sine function", kind: KeyKind.FUNCTION, value: "sinh" },
  { id: "cosh", label: "cosh", ariaLabel: "Hyperbolic cosine function", kind: KeyKind.FUNCTION, value: "cosh" },
  { id: "tanh", label: "tanh", ariaLabel: "Hyperbolic tangent function", kind: KeyKind.FUNCTION, value: "tanh" },
  { id: "asinh", label: "asinh", ariaLabel: "Inverse hyperbolic sine function", kind: KeyKind.FUNCTION, value: "asinh" },
  { id: "acosh", label: "acosh", ariaLabel: "Inverse hyperbolic cosine function", kind: KeyKind.FUNCTION, value: "acosh" },
  { id: "atanh", label: "atanh", ariaLabel: "Inverse hyperbolic tangent function", kind: KeyKind.FUNCTION, value: "atanh" },
  { id: "ln", label: "ln", ariaLabel: "Natural logarithm", kind: KeyKind.FUNCTION, value: "ln" },
  { id: "log", label: "log", ariaLabel: "Logarithm base ten", kind: KeyKind.FUNCTION, value: "log" },
  { id: "log10", label: "log10", ariaLabel: "Logarithm base ten", kind: KeyKind.FUNCTION, value: "log10" },
  { id: "log2", label: "log2", ariaLabel: "Logarithm base two", kind: KeyKind.FUNCTION, value: "log2" },
  { id: "exp", label: "exp", ariaLabel: "Exponential function", kind: KeyKind.FUNCTION, value: "exp" },
  { id: "sqrt", label: "√", ariaLabel: "Square root", kind: KeyKind.FUNCTION, value: "sqrt" },
  { id: "cbrt", label: "∛", ariaLabel: "Cube root", kind: KeyKind.FUNCTION, value: "cbrt" },
  { id: "nthRoot", label: "nth√", ariaLabel: "Nth root", kind: KeyKind.FUNCTION, value: "nthRoot" },
  { id: "square", label: "x²", ariaLabel: "Square", kind: KeyKind.FUNCTION, value: "square" },
  { id: "cube", label: "x³", ariaLabel: "Cube", kind: KeyKind.FUNCTION, value: "cube" },
  { id: "inv", label: "1/x", ariaLabel: "Reciprocal", kind: KeyKind.FUNCTION, value: "inv" },
  { id: "abs", label: "abs", ariaLabel: "Absolute value", kind: KeyKind.FUNCTION, value: "abs" },
  { id: "sign", label: "sign", ariaLabel: "Sign", kind: KeyKind.FUNCTION, value: "sign" },
  { id: "floor", label: "floor", ariaLabel: "Floor", kind: KeyKind.FUNCTION, value: "floor" },
  { id: "ceil", label: "ceil", ariaLabel: "Ceiling", kind: KeyKind.FUNCTION, value: "ceil" },
  { id: "round", label: "round", ariaLabel: "Round", kind: KeyKind.FUNCTION, value: "round" },
  { id: "trunc", label: "trunc", ariaLabel: "Truncate", kind: KeyKind.FUNCTION, value: "trunc" },
  { id: "mod", label: "mod", ariaLabel: "Modulo", kind: KeyKind.FUNCTION, value: "mod" },
  { id: "gcd", label: "gcd", ariaLabel: "Greatest common divisor", kind: KeyKind.FUNCTION, value: "gcd" },
  { id: "lcm", label: "lcm", ariaLabel: "Least common multiple", kind: KeyKind.FUNCTION, value: "lcm" },
  { id: "min", label: "min", ariaLabel: "Minimum", kind: KeyKind.FUNCTION, value: "min" },
  { id: "max", label: "max", ariaLabel: "Maximum", kind: KeyKind.FUNCTION, value: "max" },
];

const CORE_KEYS: readonly KeySpec[] = [
  { id: "clear", label: "AC", ariaLabel: "Clear expression", kind: KeyKind.CLEAR, value: "" },
  { id: "backspace", label: "⌫", ariaLabel: "Backspace", kind: KeyKind.DELETE_BACKWARD, value: "" },
  { id: "paren-open", label: "(", ariaLabel: "Open parenthesis", kind: KeyKind.PARENTHESIS, value: "(" },
  { id: "paren-close", label: ")", ariaLabel: "Close parenthesis", kind: KeyKind.PARENTHESIS, value: ")" },
  { id: "percent", label: "%", ariaLabel: "Percent", kind: KeyKind.OPERATOR, value: "%" },
  { id: "factorial", label: "!", ariaLabel: "Factorial", kind: KeyKind.OPERATOR, value: "!" },
  { id: "7", label: "7", ariaLabel: "Digit seven", kind: KeyKind.DIGIT, value: "7" },
  { id: "8", label: "8", ariaLabel: "Digit eight", kind: KeyKind.DIGIT, value: "8" },
  { id: "9", label: "9", ariaLabel: "Digit nine", kind: KeyKind.DIGIT, value: "9" },
  { id: "divide", label: "÷", ariaLabel: "Division", kind: KeyKind.OPERATOR, value: "/" },
  { id: "power", label: "^", ariaLabel: "Exponentiation", kind: KeyKind.OPERATOR, value: "^" },
  { id: "4", label: "4", ariaLabel: "Digit four", kind: KeyKind.DIGIT, value: "4" },
  { id: "5", label: "5", ariaLabel: "Digit five", kind: KeyKind.DIGIT, value: "5" },
  { id: "6", label: "6", ariaLabel: "Digit six", kind: KeyKind.DIGIT, value: "6" },
  { id: "multiply", label: "×", ariaLabel: "Multiplication", kind: KeyKind.OPERATOR, value: "*" },
  { id: "pi", label: "π", ariaLabel: "Pi constant", kind: KeyKind.CONSTANT, value: "pi" },
  { id: "1", label: "1", ariaLabel: "Digit one", kind: KeyKind.DIGIT, value: "1" },
  { id: "2", label: "2", ariaLabel: "Digit two", kind: KeyKind.DIGIT, value: "2" },
  { id: "3", label: "3", ariaLabel: "Digit three", kind: KeyKind.DIGIT, value: "3" },
  { id: "subtract", label: "−", ariaLabel: "Subtraction", kind: KeyKind.OPERATOR, value: "-" },
  { id: "e-constant", label: "e", ariaLabel: "Euler's number", kind: KeyKind.CONSTANT, value: "e" },
  { id: "0", label: "0", ariaLabel: "Digit zero", kind: KeyKind.DIGIT, value: "0" },
  { id: "decimal", label: ".", ariaLabel: "Decimal point", kind: KeyKind.DIGIT, value: "." },
  { id: "comma", label: ",", ariaLabel: "Argument separator", kind: KeyKind.OPERATOR, value: "," },
  { id: "add", label: "+", ariaLabel: "Addition", kind: KeyKind.OPERATOR, value: "+" },
  { id: "ans", label: "Ans", ariaLabel: "Previous answer", kind: KeyKind.ANS, value: "ans" },
  { id: "memory-recall", label: "MR", ariaLabel: "Memory recall", kind: KeyKind.MEMORY_RECALL, value: "" },
  { id: "equals", label: "=", ariaLabel: "Evaluate", kind: KeyKind.EVALUATE, value: "" },
];

export function CalculatorKeypadComponent() {
  const { store } = useCalculatorApplicationContext();

  const handleKeyPressed = (key: KeySpec): void => {
    const actions = store.getState();

    switch (key.kind) {
      case KeyKind.DIGIT:
        actions.onDigitPressed(key.value);
        break;
      case KeyKind.OPERATOR:
        actions.onOperatorPressed(key.value);
        break;
      case KeyKind.FUNCTION:
        actions.onFunctionPressed(key.value);
        break;
      case KeyKind.CONSTANT:
        actions.onConstantPressed(key.value);
        break;
      case KeyKind.PARENTHESIS:
        actions.onParenthesisPressed(key.value);
        break;
      case KeyKind.CLEAR:
        actions.onClearPressed();
        break;
      case KeyKind.DELETE_BACKWARD:
        actions.onDeleteBackwardPressed();
        break;
      case KeyKind.DELETE_FORWARD:
        actions.onDeleteForwardPressed();
        break;
      case KeyKind.EVALUATE:
        actions.onEvaluatePressed();
        break;
      case KeyKind.ANS:
        actions.onVariablePressed("ans");
        break;
      case KeyKind.MEMORY_RECALL:
        actions.onMemoryRecallPressed();
        break;
    }
  };

  return (
    <div className={cssClass(styles.keypad)}>
      <div className={cssClass(styles.functionArea)} aria-label="Scientific functions">
        {FUNCTION_KEYS.map((key) => (
          <AccessibleButtonComponent
            key={key.id}
            customClassName={cssClass(styles.functionKey)}
            aria-label={key.ariaLabel}
            onPress={() => handleKeyPressed(key)}
          >
            {key.label}
          </AccessibleButtonComponent>
        ))}
      </div>
      <div className={cssClass(styles.coreArea)} aria-label="Calculator keypad">
        {CORE_KEYS.map((key) => (
          <AccessibleButtonComponent
            key={key.id}
            customClassName={resolveCoreKeyClassName(key)}
            aria-label={key.ariaLabel}
            onPress={() => handleKeyPressed(key)}
          >
            {key.label}
          </AccessibleButtonComponent>
        ))}
      </div>
    </div>
  );
}

function resolveCoreKeyClassName(key: KeySpec): string {
  if (key.kind === KeyKind.EVALUATE) {
    return cssClass(styles.equalsKey);
  }

  if (
    key.kind === KeyKind.CLEAR ||
    key.kind === KeyKind.DELETE_BACKWARD ||
    key.kind === KeyKind.MEMORY_RECALL
  ) {
    return cssClass(styles.utilityKey);
  }

  if (key.kind === KeyKind.OPERATOR) {
    return cssClass(styles.operatorKey);
  }

  if (key.kind === KeyKind.CONSTANT || key.kind === KeyKind.ANS) {
    return cssClass(styles.symbolKey);
  }

  return cssClass(styles.digitKey);
}
