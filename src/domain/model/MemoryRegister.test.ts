import { describe, expect, it } from "vitest";
import { MemoryRegister } from "./MemoryRegister";

describe("MemoryRegister", () => {
  it("reports a value as non empty", () => {
    const register = new MemoryRegister("42", "2026-01-01T00:00:00.000Z");

    expect(register.valueText).toBe("42");
    expect(register.updatedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(register.isEmpty).toBe(false);
  });

  it("creates an empty register", () => {
    const register = MemoryRegister.createEmpty();

    expect(register.isEmpty).toBe(true);
    expect(register.valueText).toBe("");
  });
});
