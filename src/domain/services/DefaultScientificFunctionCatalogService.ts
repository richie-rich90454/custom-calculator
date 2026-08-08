import type { ScientificFunctionCatalogService } from "./ScientificFunctionCatalogService";
import type { ScientificFunctionDefinition } from "./ScientificFunctionDefinition";
import { scientificFunctionDefinitionRegistry } from "../../infrastructure/functions/scientificFunctionDefinitionRegistry";

/**
 * Supplies the catalog of supported scientific functions.
 *
 * The definitions themselves live in data modules under the infrastructure
 * layer; this service exposes query helpers over that data.
 */
export class DefaultScientificFunctionCatalogService
  implements ScientificFunctionCatalogService
{
  private readonly functionNames: readonly string[];

  public constructor() {
    this.functionNames = scientificFunctionDefinitionRegistry.map(
      (definition) => definition.name
    );
  }

  public getAllFunctions(): readonly ScientificFunctionDefinition[] {
    return scientificFunctionDefinitionRegistry;
  }

  public getFunction(
    functionName: string
  ): ScientificFunctionDefinition | null {
    const definition = scientificFunctionDefinitionRegistry.find(
      (candidate) => candidate.name === functionName
    );

    return definition ?? null;
  }

  public hasFunction(functionName: string): boolean {
    return this.getFunction(functionName) !== null;
  }

  public getFunctionNames(): readonly string[] {
    return this.functionNames;
  }
}
