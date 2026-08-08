import { describe, expect, it } from "vitest";
import { DefaultCasOperationCatalogService } from "../../application/cas/DefaultCasOperationCatalogService";
import { CalculatorKeyKind } from "./CalculatorKeyDefinition";
import { DefaultKeypadDefinitionRepository } from "./DefaultKeypadDefinitionRepository";

function buildRepository(): DefaultKeypadDefinitionRepository {
  return new DefaultKeypadDefinitionRepository(
    new DefaultCasOperationCatalogService()
  );
}

describe("DefaultKeypadDefinitionRepository", () => {
  it("exposes scientific function keys", () => {
    const repository = buildRepository();
    const keys = repository.getScientificFunctionKeys();

    expect(keys.length).toBeGreaterThan(0);
    expect(keys.some((key) => key.id === "sin")).toBe(true);
    expect(keys.some((key) => key.id === "sqrt")).toBe(true);
  });

  it("exposes core calculator keys", () => {
    const repository = buildRepository();
    const keys = repository.getCoreKeys();

    expect(keys.some((key) => key.id === "0")).toBe(true);
    expect(keys.some((key) => key.id === "equals")).toBe(true);
    expect(keys.some((key) => key.id === "add")).toBe(true);
  });

  it("exposes CAS operation keys derived from the catalog", () => {
    const repository = buildRepository();
    const keys = repository.getCasOperationKeys();

    expect(keys).toHaveLength(4);
    expect(keys.every((key) => key.kind === CalculatorKeyKind.CAS_OPERATION)).toBe(
      true
    );
    expect(keys.map((key) => key.value)).toEqual([
      "cas",
      "casSimplify",
      "casExpand",
      "casDerivative",
    ]);
  });
});
