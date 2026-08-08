---
title: History
description: How calculation history works, including persistence, reusing, and clearing.
---

# History

Every successful evaluation is recorded in the history list. History persists across sessions.

## Opening history

Press `Ctrl+H` or open **History** from the status bar.

## What history stores

Each history entry records:

- The expression text
- The result text
- The angle mode at evaluation time
- The numeric mode at evaluation time
- Complex number support at evaluation time
- A timestamp

## Reusing a history entry

Selecting a history entry restores its expression into the editor. The cursor is placed at the end of the expression, ready for editing. The panel closes.

## Deleting entries

- Delete a single entry from the panel.
- Clear all history with the clear action.

## Persistence

History is stored in the browser through IndexedDB. See [Persistence](/architecture/persistence) for implementation details.

## History and evaluation

History is recorded only for successful evaluations with a result. Failed evaluations are not recorded.

## Next steps

- [Keyboard shortcuts](/user-guide/keyboard-shortcuts) lists the shortcuts.
- [Persistence architecture](/architecture/persistence) explains storage.
