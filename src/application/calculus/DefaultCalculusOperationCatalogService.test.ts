import { describe, expect, it } from "vitest";
import { CalculusOperationKind } from "./CalculusOperationKind";
import { DefaultCalculusOperationCatalogService } from "./DefaultCalculusOperationCatalogService";

describe("DefaultCalculusOperationCatalogService", () => {
  const service = new DefaultCalculusOperationCatalogService();

  it("exposes every supported operation name", () => {
    expect(service.getOperationNames()).toEqual([
      "derivative",
      "numericDerivative",
      "integral",
      "integrate",
      "limit",
      "taylor",
      "sum",
      "product",
    ]);
  });

  it("recognizes a supported operation", () => {
    expect(service.hasOperation("taylor")).toBe(true);
  });

  it("rejects an unknown operation", () => {
    expect(service.hasOperation("nope")).toBe(false);
  });

  it("describes each operation with its kind and invocation", () => {
    const operations = service.getOperations();
    const derivative = operations.find(
      (operation) => operation.functionName === "derivative"
    );

    expect(derivative?.operationKind).toBe(CalculusOperationKind.DERIVATIVE);
    expect(derivative?.invocationText).toBe("derivative(");
    expect(derivative?.ariaLabel).toContain("derivative");
    expect(derivative?.description.length).toBeGreaterThan(0);
  });
});
