import { describe, expect, it } from "vitest";
import { DefaultUniqueIdentifierFactory } from "./DefaultUniqueIdentifierFactory";

describe("DefaultUniqueIdentifierFactory", () => {
  it("creates a UUID when the crypto API supports it", () => {
    const originalCrypto = globalThis.crypto;

    Object.defineProperty(globalThis, "crypto", {
      value: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
      configurable: true,
    });

    try {
      const factory = new DefaultUniqueIdentifierFactory();

      expect(factory.createUniqueIdentifier()).toBe(
        "00000000-0000-4000-8000-000000000000"
      );
    } finally {
      Object.defineProperty(globalThis, "crypto", {
        value: originalCrypto,
        configurable: true,
      });
    }
  });

  it("falls back to a timestamp based identifier without randomUUID", () => {
    const originalCrypto = globalThis.crypto;

    Object.defineProperty(globalThis, "crypto", {
      value: {},
      configurable: true,
    });

    try {
      const factory = new DefaultUniqueIdentifierFactory();

      expect(factory.createUniqueIdentifier()).toMatch(/^id-\d+-[a-z0-9]+$/);
    } finally {
      Object.defineProperty(globalThis, "crypto", {
        value: originalCrypto,
        configurable: true,
      });
    }
  });
});
