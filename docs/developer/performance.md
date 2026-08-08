---
title: Performance
description: Performance considerations and the behavior of the evaluation pipeline.
---

# Performance

The calculator is a client-side application. This page documents performance considerations.

## Rendering

- Components subscribe to a thin Zustand store.
- Re-renders are scoped to the components that read changed state.
- The keypad is data-driven, so layout and definitions are cheap to rebuild.

## Evaluation

- Evaluation runs synchronously through the math.js gateway.
- Expressions are parsed once per evaluation.
- CAS and calculus routing happens before numeric evaluation, so symbolic blocks do not pass through the numeric gateway.

## Cursor and editing

- Editing services operate on strings and are O(n) in expression length.
- The expression editor is a single-line input, which keeps native editing fast.

## Persistence

- History and variables load asynchronously from IndexedDB.
- Settings load from local storage synchronously at bootstrap.

## What to watch

- Extremely long expressions are rare; the editor is single-line.
- Symbolic calculus on large expressions can be slow in the engine.
- The `MathJsCalculusExpressionEvaluator` evaluates at sample points; keep iteration counts reasonable.

## Measuring

Use the browser performance tools to profile evaluation and rendering. See the browser support page for supported environments.

## Next steps

- [Browser support](/developer/browser-support)
- [Evaluation pipeline](/architecture/evaluation-pipeline)
