---
title: Architecture Overview
description: The layered architecture of the calculator and the dependency rules that keep it maintainable.
---

# Architecture Overview

The calculator follows a strict layered architecture. Each layer has a clear
responsibility, and dependencies flow in one direction only.

## The layers

| Layer | Responsibility | Dependencies |
| ----- | -------------- | ------------ |
| Presentation | React components, React Aria usage, styles, view models | State |
| State | Thin Zustand store mapping UI state to session state | Application |
| Application | Commands, the application controller, orchestration | Domain |
| Domain | Pure TypeScript models and services | None |
| Infrastructure | math.js gateway, persistence, feature detection, data | Domain |

## Core rules

- `.tsx` files render UI and forward events only. Logic lives in discrete
  `.ts` classes.
- math.js is only reachable through `src/infrastructure/mathjs`.
- React Aria is only used in the presentation layer.
- The domain layer never imports React, math.js, or the browser.

## Why the strictness

The separation makes the core testable:

- Domain services are pure TypeScript and test in milliseconds.
- Infrastructure gateways isolate the math engine so it can be replaced.
- Presentation services keep cursor and insertion logic out of JSX.
- The Zustand store stays thin because orchestration lives in services.

## The evaluation pipeline

When the user evaluates an expression, the flow is:

1. The expression editor raises a keyboard event.
2. The keyboard service maps it to an action.
3. The store invokes the application controller.
4. The command validates, parses CAS or calculus blocks, and routes.
5. The result flows back through the view model into the display.

See [Evaluation pipeline](/architecture/evaluation-pipeline).

## The composition root

Every service is constructed in a single composition root and injected via
constructor injection. See [Composition root](/developer/composition-root).

## Diagrams

See [Diagrams](/architecture/diagrams) for visual renderings of the
architecture.

## Next steps

- [Domain layer](/developer/domain-layer)
- [Application layer](/developer/application-layer)
- [Infrastructure layer](/developer/infrastructure-layer)
- [Presentation layer](/developer/presentation-layer)
