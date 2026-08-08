import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "../../domain/services/ScientificFunctionDefinition";

export const arithmeticFunctionDefinitions: readonly ScientificFunctionDefinition[] = [
  new ScientificFunctionDefinition(
    "min",
    "min",
    "Minimum of a list of values",
    ScientificFunctionCategory.ARITHMETIC,
    1,
    999
  ),
  new ScientificFunctionDefinition(
    "max",
    "max",
    "Maximum of a list of values",
    ScientificFunctionCategory.ARITHMETIC,
    1,
    999
  ),
  new ScientificFunctionDefinition(
    "gcd",
    "gcd",
    "Greatest common divisor",
    ScientificFunctionCategory.ARITHMETIC,
    2,
    999
  ),
  new ScientificFunctionDefinition(
    "lcm",
    "lcm",
    "Least common multiple",
    ScientificFunctionCategory.ARITHMETIC,
    2,
    999
  ),
  new ScientificFunctionDefinition(
    "mod",
    "mod",
    "Remainder of a division",
    ScientificFunctionCategory.ARITHMETIC,
    2,
    2
  ),
  new ScientificFunctionDefinition(
    "factorial",
    "factorial",
    "Factorial of an integer",
    ScientificFunctionCategory.ARITHMETIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "percent",
    "percent",
    "Percent of a value",
    ScientificFunctionCategory.ARITHMETIC,
    1,
    1
  ),
];
