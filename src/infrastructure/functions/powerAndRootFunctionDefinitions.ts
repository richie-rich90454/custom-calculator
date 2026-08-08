import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "../../domain/services/ScientificFunctionDefinition";

export const powerAndRootFunctionDefinitions: readonly ScientificFunctionDefinition[] = [
  new ScientificFunctionDefinition(
    "sqrt",
    "sqrt",
    "Square root",
    ScientificFunctionCategory.POWER_AND_ROOT,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "cbrt",
    "cbrt",
    "Cube root",
    ScientificFunctionCategory.POWER_AND_ROOT,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "nthRoot",
    "nthRoot",
    "Nth root of a value",
    ScientificFunctionCategory.POWER_AND_ROOT,
    2,
    2
  ),
  new ScientificFunctionDefinition(
    "square",
    "square",
    "Square of a value",
    ScientificFunctionCategory.POWER_AND_ROOT,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "cube",
    "cube",
    "Cube of a value",
    ScientificFunctionCategory.POWER_AND_ROOT,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "pow",
    "pow",
    "Exponentiation",
    ScientificFunctionCategory.POWER_AND_ROOT,
    2,
    2
  ),
  new ScientificFunctionDefinition(
    "inv",
    "1/x",
    "Reciprocal of a value",
    ScientificFunctionCategory.POWER_AND_ROOT,
    1,
    1
  ),
];
