import { HistoryEntry } from "../model/HistoryEntry";

export interface HistoryRepository {
  loadHistoryEntries(): Promise<readonly HistoryEntry[]>;
  saveHistoryEntry(entry: HistoryEntry): Promise<void>;
  deleteHistoryEntry(historyEntryId: string): Promise<void>;
  clearHistory(): Promise<void>;
}
