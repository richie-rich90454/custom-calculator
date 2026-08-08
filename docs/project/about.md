---
title: About
description: About the scientific calculator project, its goals, and its architecture.
---

# About

The Scientific Calculator is a production-minded, expression-based scientific calculator built for the web. It is designed as a calm, precise scientific instrument.

## Goals

- Provide a keyboard-first expression calculator that never requires a mouse.
- Keep the cursor and editing behavior predictable and precise.
- Cover a broad scientific surface: functions, constants, numeric modes, calculus, and enableable CAS.
- Stay accessible and screen reader friendly.
- Keep the architecture clean, testable, and layered.

## History

The project grew from a standard calculator into a full expression calculator with calculus and CAS layers, always preserving strict separation between logic and presentation.

## Guiding principles

- **Cursor correctness** — the caret always lands where the user expects.
- **Logic in services** — JSX stays thin; TypeScript owns the behavior.
- **Security by construction** — no `eval`, no arbitrary execution.
- **Accessibility** — every feature reachable from the keyboard.

## Technology

- React, React Aria, and Vite
- math.js behind an infrastructure gateway
- Zustand for thin UI state
- Dexie for IndexedDB persistence
- CSS Modules and CSS variables for styling

## Related pages

- [Roadmap](/project/roadmap)
- [Changelog](/project/changelog)
- [Glossary](/project/glossary)
