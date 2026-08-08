import { useRef, useState, type KeyboardEvent } from "react";

export interface KeypadGridNavigationController {
  readonly focusedItemId: string | null;
  readonly registerItemRef: (
    itemId: string,
    element: HTMLButtonElement | null
  ) => void;
  readonly getTabIndex: (itemId: string) => number;
  readonly handleItemFocus: (itemId: string) => void;
  readonly handleGridKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export function useKeypadGridNavigation(
  itemIds: readonly string[],
  columnCount: number
): KeypadGridNavigationController {
  const [focusedItemId, setFocusedItemId] = useState<string | null>(
    itemIds[0] ?? null
  );
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const registerItemRef = (
    itemId: string,
    element: HTMLButtonElement | null
  ): void => {
    itemRefs.current[itemId] = element;
  };

  const focusItem = (itemId: string): void => {
    setFocusedItemId(itemId);

    itemRefs.current[itemId]?.focus();
  };

  const getTabIndex = (itemId: string): number => {
    return focusedItemId === itemId ? 0 : -1;
  };

  const handleItemFocus = (itemId: string): void => {
    setFocusedItemId(itemId);
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    const currentIndex =
      focusedItemId === null ? -1 : itemIds.indexOf(focusedItemId);

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = -1;

    if (event.key === "ArrowRight") {
      const currentColumn = currentIndex % columnCount;

      if (currentColumn < columnCount - 1) {
        nextIndex = currentIndex + 1;
      }
    } else if (event.key === "ArrowLeft") {
      const currentColumn = currentIndex % columnCount;

      if (currentColumn > 0) {
        nextIndex = currentIndex - 1;
      }
    } else if (event.key === "ArrowDown") {
      if (currentIndex + columnCount < itemIds.length) {
        nextIndex = currentIndex + columnCount;
      }
    } else if (event.key === "ArrowUp") {
      if (currentIndex - columnCount >= 0) {
        nextIndex = currentIndex - columnCount;
      }
    }

    if (nextIndex < 0 || nextIndex >= itemIds.length) {
      return;
    }

    const nextItemId = itemIds[nextIndex];

    if (nextItemId === undefined) {
      return;
    }

    event.preventDefault();
    focusItem(nextItemId);
  };

  return {
    focusedItemId: focusedItemId,
    registerItemRef: registerItemRef,
    getTabIndex: getTabIndex,
    handleItemFocus: handleItemFocus,
    handleGridKeyDown: handleGridKeyDown,
  };
}
