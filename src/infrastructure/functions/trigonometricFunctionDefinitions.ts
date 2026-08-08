import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "../../domain/services/ScientificFunctionDefinition";

export const trigonometricFunctionDefinitions: readonly ScientificFunctionDefinition[] = [
  new ScientificFunctionDefinition(
    "sin",
    "sin",
    "Sine of an angle",
    ScientificFunctionCategory.TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "cos",
    "cos",
    "Cosine of an angle",
    ScientificFunctionCategory.TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "tan",
    "tan",
    "Tangent of an angle",
    ScientificFunctionCategory.TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "asin",
    "asin",
    "Inverse sine",
    ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "acos",
    "acos",
    "Inverse cosine",
    ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "atan",
    "atan",
    "Inverse tangent",
    ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "sinh",
    "sinh",
    "Hyperbolic sine",
    ScientificFunctionCategory.HYPERBOLIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "cosh",
    "cosh",
    "Hyperbolic cosine",
    ScientificFunctionCategory.HYPERBOLIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "tanh",
    "tanh",
    "Hyperbolic tangent",
    ScientificFunctionCategory.HYPERBOLIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "asinh",
    "asinh",
    "Inverse hyperbolic sine",
    ScientificFunctionCategory.INVERSE_HYPERBOLIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "acosh",
    "acosh",
    "Inverse hyperbolic cosine",
    ScientificFunctionCategory.INVERSE_HYPERBOLIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "atanh",
    "atanh",
    "Inverse hyperbolic tangent",
    ScientificFunctionCategory.INVERSE_HYPERBOLIC,
    1,
    1
  ),
];
