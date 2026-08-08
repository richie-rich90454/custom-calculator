import type { StoreApi, UseBoundStore } from "zustand";
import type { CalculatorUiActions } from "./CalculatorUiActions";
import type { CalculatorUiState } from "./CalculatorUiState";

export type CalculatorUiStore = CalculatorUiState & CalculatorUiActions;

export type CalculatorUiStoreApi = UseBoundStore<StoreApi<CalculatorUiStore>>;
