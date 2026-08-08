import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "../../domain/services/ScientificFunctionDefinition";

export const roundingFunctionDefinitions: readonly ScientificFunctionDefinition[] = [
  new ScientificFunctionDefinition(
    "abs",
    "abs",
    "Absolute value",
    ScientificFunctionCategory.ROUNDING,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "sign",
    "sign",
    "Sign of a value",
    ScientificFunctionCategory.ROUNDING,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "floor",
    "floor",
    "Greatest integer less than or equal to a value",
    ScientificFunctionCategory.ROUNDING,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "ceil",
    "ceil",
    "Smallest integer greater than or equal to a value",
    ScientificFunctionCategory.ROUNDING,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "round",
    "round",
    "Rounds a value to a given precision",
    ScientificFunctionCategory.ROUNDING,
    1,
    2
  ),
  new ScientificFunctionDefinition(
    "trunc",
    "trunc",
    "Truncates a value toward zero",
    ScientificFunctionCategory.ROUNDING,
    1,
    1
  ),
];
