import { CalculatorKeyKind, type CalculatorKeyDefinition } from "./CalculatorKeyDefinition";
import type { CasOperationCatalogService } from "../../application/cas/CasOperationCatalogService";
import type { KeypadDefinitionRepository } from "./KeypadDefinitionRepository";

/**
 * Supplies the data driven key definitions for every keypad region.
 *
 * Scientific, core, and CAS keys are declared here instead of inside TSX so
 * the layout stays data driven and the definitions remain unit testable.
 */
export class DefaultKeypadDefinitionRepository
  implements KeypadDefinitionRepository
{
  private static readonly SCIENTIFIC_FUNCTION_KEYS: readonly CalculatorKeyDefinition[] = [
    { id: "sin", label: "sin", ariaLabel: "Sine function", kind: CalculatorKeyKind.FUNCTION, value: "sin" },
    { id: "cos", label: "cos", ariaLabel: "Cosine function", kind: CalculatorKeyKind.FUNCTION, value: "cos" },
    { id: "tan", label: "tan", ariaLabel: "Tangent function", kind: CalculatorKeyKind.FUNCTION, value: "tan" },
    { id: "asin", label: "asin", ariaLabel: "Inverse sine function", kind: CalculatorKeyKind.FUNCTION, value: "asin" },
    { id: "acos", label: "acos", ariaLabel: "Inverse cosine function", kind: CalculatorKeyKind.FUNCTION, value: "acos" },
    { id: "atan", label: "atan", ariaLabel: "Inverse tangent function", kind: CalculatorKeyKind.FUNCTION, value: "atan" },
    { id: "sinh", label: "sinh", ariaLabel: "Hyperbolic sine function", kind: CalculatorKeyKind.FUNCTION, value: "sinh" },
    { id: "cosh", label: "cosh", ariaLabel: "Hyperbolic cosine function", kind: CalculatorKeyKind.FUNCTION, value: "cosh" },
    { id: "tanh", label: "tanh", ariaLabel: "Hyperbolic tangent function", kind: CalculatorKeyKind.FUNCTION, value: "tanh" },
    { id: "asinh", label: "asinh", ariaLabel: "Inverse hyperbolic sine function", kind: CalculatorKeyKind.FUNCTION, value: "asinh" },
    { id: "acosh", label: "acosh", ariaLabel: "Inverse hyperbolic cosine function", kind: CalculatorKeyKind.FUNCTION, value: "acosh" },
    { id: "atanh", label: "atanh", ariaLabel: "Inverse hyperbolic tangent function", kind: CalculatorKeyKind.FUNCTION, value: "atanh" },
    { id: "ln", label: "ln", ariaLabel: "Natural logarithm", kind: CalculatorKeyKind.FUNCTION, value: "ln" },
    { id: "log", label: "log", ariaLabel: "Logarithm base ten", kind: CalculatorKeyKind.FUNCTION, value: "log" },
    { id: "log10", label: "log10", ariaLabel: "Logarithm base ten", kind: CalculatorKeyKind.FUNCTION, value: "log10" },
    { id: "log2", label: "log2", ariaLabel: "Logarithm base two", kind: CalculatorKeyKind.FUNCTION, value: "log2" },
    { id: "exp", label: "exp", ariaLabel: "Exponential function", kind: CalculatorKeyKind.FUNCTION, value: "exp" },
    { id: "sqrt", label: "√", ariaLabel: "Square root", kind: CalculatorKeyKind.FUNCTION, value: "sqrt" },
    { id: "cbrt", label: "∛", ariaLabel: "Cube root", kind: CalculatorKeyKind.FUNCTION, value: "cbrt" },
    { id: "nthRoot", label: "nth√", ariaLabel: "Nth root", kind: CalculatorKeyKind.FUNCTION, value: "nthRoot" },
    { id: "square", label: "x²", ariaLabel: "Square", kind: CalculatorKeyKind.FUNCTION, value: "square" },
    { id: "cube", label: "x³", ariaLabel: "Cube", kind: CalculatorKeyKind.FUNCTION, value: "cube" },
    { id: "inv", label: "1/x", ariaLabel: "Reciprocal", kind: CalculatorKeyKind.FUNCTION, value: "inv" },
    { id: "abs", label: "abs", ariaLabel: "Absolute value", kind: CalculatorKeyKind.FUNCTION, value: "abs" },
    { id: "sign", label: "sign", ariaLabel: "Sign", kind: CalculatorKeyKind.FUNCTION, value: "sign" },
    { id: "floor", label: "floor", ariaLabel: "Floor", kind: CalculatorKeyKind.FUNCTION, value: "floor" },
    { id: "ceil", label: "ceil", ariaLabel: "Ceiling", kind: CalculatorKeyKind.FUNCTION, value: "ceil" },
    { id: "round", label: "round", ariaLabel: "Round", kind: CalculatorKeyKind.FUNCTION, value: "round" },
    { id: "trunc", label: "trunc", ariaLabel: "Truncate", kind: CalculatorKeyKind.FUNCTION, value: "trunc" },
    { id: "mod", label: "mod", ariaLabel: "Modulo", kind: CalculatorKeyKind.FUNCTION, value: "mod" },
    { id: "gcd", label: "gcd", ariaLabel: "Greatest common divisor", kind: CalculatorKeyKind.FUNCTION, value: "gcd" },
    { id: "lcm", label: "lcm", ariaLabel: "Least common multiple", kind: CalculatorKeyKind.FUNCTION, value: "lcm" },
    { id: "min", label: "min", ariaLabel: "Minimum", kind: CalculatorKeyKind.FUNCTION, value: "min" },
    { id: "max", label: "max", ariaLabel: "Maximum", kind: CalculatorKeyKind.FUNCTION, value: "max" },
  ];

  private static readonly CORE_KEYS: readonly CalculatorKeyDefinition[] = [
    { id: "clear", label: "AC", ariaLabel: "Clear expression", kind: CalculatorKeyKind.CLEAR, value: "" },
    { id: "backspace", label: "⌫", ariaLabel: "Backspace", kind: CalculatorKeyKind.DELETE_BACKWARD, value: "" },
    { id: "paren-open", label: "(", ariaLabel: "Open parenthesis", kind: CalculatorKeyKind.PARENTHESIS, value: "(" },
    { id: "paren-close", label: ")", ariaLabel: "Close parenthesis", kind: CalculatorKeyKind.PARENTHESIS, value: ")" },
    { id: "percent", label: "%", ariaLabel: "Percent", kind: CalculatorKeyKind.OPERATOR, value: "%" },
    { id: "factorial", label: "!", ariaLabel: "Factorial", kind: CalculatorKeyKind.OPERATOR, value: "!" },
    { id: "7", label: "7", ariaLabel: "Digit seven", kind: CalculatorKeyKind.DIGIT, value: "7" },
    { id: "8", label: "8", ariaLabel: "Digit eight", kind: CalculatorKeyKind.DIGIT, value: "8" },
    { id: "9", label: "9", ariaLabel: "Digit nine", kind: CalculatorKeyKind.DIGIT, value: "9" },
    { id: "divide", label: "÷", ariaLabel: "Division", kind: CalculatorKeyKind.OPERATOR, value: "/" },
    { id: "power", label: "^", ariaLabel: "Exponentiation", kind: CalculatorKeyKind.OPERATOR, value: "^" },
    { id: "4", label: "4", ariaLabel: "Digit four", kind: CalculatorKeyKind.DIGIT, value: "4" },
    { id: "5", label: "5", ariaLabel: "Digit five", kind: CalculatorKeyKind.DIGIT, value: "5" },
    { id: "6", label: "6", ariaLabel: "Digit six", kind: CalculatorKeyKind.DIGIT, value: "6" },
    { id: "multiply", label: "×", ariaLabel: "Multiplication", kind: CalculatorKeyKind.OPERATOR, value: "*" },
    { id: "pi", label: "π", ariaLabel: "Pi constant", kind: CalculatorKeyKind.CONSTANT, value: "pi" },
    { id: "1", label: "1", ariaLabel: "Digit one", kind: CalculatorKeyKind.DIGIT, value: "1" },
    { id: "2", label: "2", ariaLabel: "Digit two", kind: CalculatorKeyKind.DIGIT, value: "2" },
    { id: "3", label: "3", ariaLabel: "Digit three", kind: CalculatorKeyKind.DIGIT, value: "3" },
    { id: "subtract", label: "−", ariaLabel: "Subtraction", kind: CalculatorKeyKind.OPERATOR, value: "-" },
    { id: "e-constant", label: "e", ariaLabel: "Euler's number", kind: CalculatorKeyKind.CONSTANT, value: "e" },
    { id: "0", label: "0", ariaLabel: "Digit zero", kind: CalculatorKeyKind.DIGIT, value: "0" },
    { id: "decimal", label: ".", ariaLabel: "Decimal point", kind: CalculatorKeyKind.DIGIT, value: "." },
    { id: "comma", label: ",", ariaLabel: "Argument separator", kind: CalculatorKeyKind.OPERATOR, value: "," },
    { id: "add", label: "+", ariaLabel: "Addition", kind: CalculatorKeyKind.OPERATOR, value: "+" },
    { id: "ans", label: "Ans", ariaLabel: "Previous answer", kind: CalculatorKeyKind.ANS, value: "ans" },
    { id: "memory-recall", label: "MR", ariaLabel: "Memory recall", kind: CalculatorKeyKind.MEMORY_RECALL, value: "" },
    { id: "equals", label: "=", ariaLabel: "Evaluate", kind: CalculatorKeyKind.EVALUATE, value: "" },
  ];

  public constructor(
    private readonly casOperationCatalogService: CasOperationCatalogService
  ) {}

  public getScientificFunctionKeys(): readonly CalculatorKeyDefinition[] {
    return DefaultKeypadDefinitionRepository.SCIENTIFIC_FUNCTION_KEYS;
  }

  public getCoreKeys(): readonly CalculatorKeyDefinition[] {
    return DefaultKeypadDefinitionRepository.CORE_KEYS;
  }

  public getCasOperationKeys(): readonly CalculatorKeyDefinition[] {
    return this.casOperationCatalogService.getOperations().map((operation) => ({
      id: operation.functionName,
      label: operation.label,
      ariaLabel: operation.ariaLabel,
      kind: CalculatorKeyKind.CAS_OPERATION,
      value: operation.functionName,
    }));
  }
}
