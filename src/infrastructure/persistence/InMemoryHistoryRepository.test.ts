import { describe, expect, it } from "vitest";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { InMemoryHistoryRepository } from "./InMemoryHistoryRepository";

function buildEntry(id: string, expressionText: string): HistoryEntry {
  return new HistoryEntry(
    id,
    expressionText,
    "4",
    AngleMode.DEG,
    NumericMode.STANDARD,
    false,
    "2026-01-01T00:00:00.000Z"
  );
}

describe("InMemoryHistoryRepository", () => {
  it("loads entries newest first", async () => {
    const repository = new InMemoryHistoryRepository();

    await repository.saveHistoryEntry(buildEntry("a", "1+1"));
    await repository.saveHistoryEntry(buildEntry("b", "2+2"));

    const entries = await repository.loadHistoryEntries();

    expect(entries.map((entry) => entry.id)).toEqual(["b", "a"]);
  });

  it("deletes an existing entry", async () => {
    const repository = new InMemoryHistoryRepository();

    await repository.saveHistoryEntry(buildEntry("a", "1+1"));
    await repository.saveHistoryEntry(buildEntry("b", "2+2"));
    await repository.deleteHistoryEntry("a");

    const entries = await repository.loadHistoryEntries();

    expect(entries.map((entry) => entry.id)).toEqual(["b"]);
  });

  it("ignores deleting an unknown entry", async () => {
    const repository = new InMemoryHistoryRepository();

    await repository.saveHistoryEntry(buildEntry("a", "1+1"));
    await repository.deleteHistoryEntry("missing");

    expect(await repository.loadHistoryEntries()).toHaveLength(1);
  });

  it("clears all entries", async () => {
    const repository = new InMemoryHistoryRepository();

    await repository.saveHistoryEntry(buildEntry("a", "1+1"));
    await repository.clearHistory();

    expect(await repository.loadHistoryEntries()).toHaveLength(0);
  });
});
