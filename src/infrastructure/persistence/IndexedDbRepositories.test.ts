import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { CalculatorDexieDatabase } from "./CalculatorDexieDatabase";
import { IndexedDbHistoryRepository } from "./IndexedDbHistoryRepository";
import { IndexedDbVariablesRepository } from "./IndexedDbVariablesRepository";

let databaseSequence = 0;

function buildDatabase(): CalculatorDexieDatabase {
  databaseSequence += 1;

  return new CalculatorDexieDatabase(`calculator-test-${databaseSequence}`);
}

function buildHistoryEntry(id: string, expressionText: string): HistoryEntry {
  return new HistoryEntry(
    id,
    expressionText,
    "4",
    AngleMode.DEG,
    NumericMode.STANDARD,
    false,
    `2026-01-01T00:00:0${id}.000Z`
  );
}

function buildVariable(name: string, valueText: string): VariableAssignment {
  return new VariableAssignment(
    name,
    valueText,
    NumericMode.STANDARD,
    "2026-01-01T00:00:00.000Z"
  );
}

describe("IndexedDbHistoryRepository", () => {
  afterEach(async () => {
    await DexieDeleteAll();
  });

  it("round trips a history entry", async () => {
    const repository = new IndexedDbHistoryRepository(buildDatabase());

    await repository.saveHistoryEntry(buildHistoryEntry("1", "2+2"));

    const entries = await repository.loadHistoryEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.expressionText).toBe("2+2");
    expect(entries[0]?.resultText).toBe("4");
  });

  it("loads entries newest first by creation time", async () => {
    const repository = new IndexedDbHistoryRepository(buildDatabase());

    await repository.saveHistoryEntry(buildHistoryEntry("1", "1+1"));
    await repository.saveHistoryEntry(buildHistoryEntry("2", "2+2"));

    const entries = await repository.loadHistoryEntries();

    expect(entries.map((entry) => entry.id)).toEqual(["2", "1"]);
  });

  it("deletes a history entry", async () => {
    const repository = new IndexedDbHistoryRepository(buildDatabase());

    await repository.saveHistoryEntry(buildHistoryEntry("1", "2+2"));
    await repository.deleteHistoryEntry("1");

    expect(await repository.loadHistoryEntries()).toHaveLength(0);
  });

  it("clears all history entries", async () => {
    const repository = new IndexedDbHistoryRepository(buildDatabase());

    await repository.saveHistoryEntry(buildHistoryEntry("1", "2+2"));
    await repository.clearHistory();

    expect(await repository.loadHistoryEntries()).toHaveLength(0);
  });
});

describe("IndexedDbVariablesRepository", () => {
  afterEach(async () => {
    await DexieDeleteAll();
  });

  it("round trips a variable assignment", async () => {
    const repository = new IndexedDbVariablesRepository(buildDatabase());

    await repository.saveVariable(buildVariable("x", "4"));

    const variables = await repository.loadVariables();

    expect(variables).toHaveLength(1);
    expect(variables[0]?.name).toBe("x");
    expect(variables[0]?.valueText).toBe("4");
  });

  it("replaces an existing variable with the same name", async () => {
    const repository = new IndexedDbVariablesRepository(buildDatabase());

    await repository.saveVariable(buildVariable("x", "4"));
    await repository.saveVariable(buildVariable("x", "9"));

    const variables = await repository.loadVariables();

    expect(variables).toHaveLength(1);
    expect(variables[0]?.valueText).toBe("9");
  });

  it("deletes a variable", async () => {
    const repository = new IndexedDbVariablesRepository(buildDatabase());

    await repository.saveVariable(buildVariable("x", "4"));
    await repository.deleteVariable("x");

    expect(await repository.loadVariables()).toHaveLength(0);
  });

  it("clears all variables", async () => {
    const repository = new IndexedDbVariablesRepository(buildDatabase());

    await repository.saveVariable(buildVariable("x", "4"));
    await repository.clearVariables();

    expect(await repository.loadVariables()).toHaveLength(0);
  });
});

async function DexieDeleteAll(): Promise<void> {
  const databases = await indexedDB.databases();
  const databaseNames = databases
    .map((database) => database.name)
    .filter((name): name is string => name !== undefined);

  await Promise.all(
    databaseNames.map(
      (name) =>
        new Promise<void>((resolve) => {
          const request = indexedDB.deleteDatabase(name);
          request.onsuccess = () => resolve();
          request.onerror = () => resolve();
          request.onblocked = () => resolve();
        })
    )
  );
}
