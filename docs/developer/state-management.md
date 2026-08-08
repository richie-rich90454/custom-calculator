---
title: State Management
description: How Zustand is used as a thin UI state layer.
---

# State Management

The calculator uses Zustand as a thin UI state layer. All real logic stays in the application and domain layers.

## The store

`createCalculatorUiStore` creates the Zustand store. The store combines UI state with UI actions:

```ts
export type CalculatorUiStore = CalculatorUiState & CalculatorUiActions;
```

## The actions

UI actions map directly to controller calls. For example:

```ts
onDigitPressed: (digit) => {
  const sessionState = viewModelMapper.mapUiStateToSessionState(get());
  const nextSessionState = controller.insertDigit(sessionState, digit);
  set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
},
```

The store never contains domain logic. It:

1. Maps UI state to session state.
2. Invokes the application controller.
3. Maps the new session state back to UI state.

## Why thin

Keeping the store thin keeps the architecture clean:

- Domain logic is tested without React.
- The controller is the single orchestrator.
- The store is a mechanical adapter.

## View model mapping

`CalculatorViewModelMapper` converts between the two shapes:

- `mapUiStateToSessionState` — builds a `CalculatorSessionState`.
- `mapSessionStateToUiState` — spreads the session values back into UI state.
- `mapUiStateToSettings` — builds persisted settings.

## Theme and settings

Settings changes flow through the store to the orchestration service, which persists them. See [Persistence](/architecture/persistence).

## Next steps

- [Application layer](/developer/application-layer) explains the controller.
- [View models](/developer/presentation-layer) explains mapping.
