import type { ScientificFunctionDefinition } from "../../domain/services/ScientificFunctionDefinition";
import { trigonometricFunctionDefinitions } from "./trigonometricFunctionDefinitions";
import { logarithmicFunctionDefinitions } from "./logarithmicFunctionDefinitions";
import { powerAndRootFunctionDefinitions } from "./powerAndRootFunctionDefinitions";
import { roundingFunctionDefinitions } from "./roundingFunctionDefinitions";
import { arithmeticFunctionDefinitions } from "./arithmeticFunctionDefinitions";

/**
 * Aggregates every scientific function definition into a single ordered list.
 *
 * Data modules are grouped by category so new functions can be added without
 * touching the catalog service itself.
 */
export const scientificFunctionDefinitionRegistry: readonly ScientificFunctionDefinition[] = [
  ...trigonometricFunctionDefinitions,
  ...logarithmicFunctionDefinitions,
  ...powerAndRootFunctionDefinitions,
  ...roundingFunctionDefinitions,
  ...arithmeticFunctionDefinitions,
];
