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

Each entry also offers **Insert expression** and **Insert result** actions that put the entry's text into the editor without closing the panel.

## Replaying history with the arrow keys

The replay arrows step through previous calculations without opening the panel:

- **PageUp** (or the up replay key) steps back to older entries.
- **PageDown** (or the down replay key) steps forward to newer entries.

History is ordered newest first. The first back press restores the newest
entry; each further back press moves one entry older.

Once you reach the oldest (or newest) entry, pressing the same direction again
inserts that boundary entry's text into the current expression instead of
replacing it. This lets you build a new calculation that reuses an old one —
multi-replay:

```
expression  2+2
up          2+2   (oldest entry inserted)
up          2+22+2
```

Type a fresh edit into the expression to leave replay mode; the editor returns
to the live expression.

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
