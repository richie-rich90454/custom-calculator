import { HistoryEntry } from "../../domain/model/HistoryEntry";
import type { HistoryRepository } from "../../domain/repositories/HistoryRepository";
import { CalculatorDexieDatabase } from "./CalculatorDexieDatabase";

export class IndexedDbHistoryRepository implements HistoryRepository {
  public constructor(private readonly database: CalculatorDexieDatabase) {}

  public async loadHistoryEntries(): Promise<readonly HistoryEntry[]> {
    const records = await this.database.history
      .orderBy("createdAt")
      .reverse()
      .toArray();

    return records.map((record) =>
      this.database.fromHistoryEntryRecord(record)
    );
  }

  public async saveHistoryEntry(entry: HistoryEntry): Promise<void> {
    await this.database.history.put(
      this.database.toHistoryEntryRecord(entry)
    );
  }

  public async deleteHistoryEntry(
    historyEntryId: string
  ): Promise<void> {
    await this.database.history.delete(historyEntryId);
  }

  public async clearHistory(): Promise<void> {
    await this.database.history.clear();
  }
}
