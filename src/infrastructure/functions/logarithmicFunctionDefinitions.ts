import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "../../domain/services/ScientificFunctionDefinition";

export const logarithmicFunctionDefinitions: readonly ScientificFunctionDefinition[] = [
  new ScientificFunctionDefinition(
    "log",
    "log",
    "Common logarithm with a configurable base",
    ScientificFunctionCategory.LOGARITHMIC,
    1,
    2
  ),
  new ScientificFunctionDefinition(
    "log10",
    "log10",
    "Base ten logarithm",
    ScientificFunctionCategory.LOGARITHMIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "log2",
    "log2",
    "Base two logarithm",
    ScientificFunctionCategory.LOGARITHMIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "ln",
    "ln",
    "Natural logarithm",
    ScientificFunctionCategory.LOGARITHMIC,
    1,
    1
  ),
  new ScientificFunctionDefinition(
    "exp",
    "exp",
    "Exponential function",
    ScientificFunctionCategory.LOGARITHMIC,
    1,
    1
  ),
];
