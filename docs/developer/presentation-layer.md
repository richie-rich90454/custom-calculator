---
title: Presentation Layer
description: "The presentation layer: React components, view models, services, hooks, and styles."
---

# Presentation Layer

The presentation layer renders the interface and forwards events. It is
deliberately thin: complex logic lives in TypeScript services, and JSX
components orchestrate the primitives.

## Location

```
src/presentation/
├── components/      React components for the interface
├── hooks/           React hooks for keyboard, theme, and view model
├── primitives/      Accessible building blocks (React Aria)
├── services/        Keypad, keyboard, caret, and selection services
├── styles/          CSS Modules and CSS variables
├── utils/           Small helpers
└── viewmodels/      View model mapping for the components
```

## The thin component rule

Components render UI and forward events. Cursor math, insertion templates, and
keyboard decisions live in services under `src/presentation/services` so they
are unit testable without a DOM.

## View models

`CalculatorViewModel` reads the UI state and exposes prepared values to
components. `CalculatorViewModelMapper` converts between UI state and session
state.

## Primitives

The primitives wrap React Aria components:

- `AccessibleButtonComponent`
- `AccessibleTextFieldComponent`
- `AccessibleSelectComponent`
- `AccessibleSwitchComponent`
- `AccessibleDialogComponent`

## Hooks

- `useCalculatorViewModel` — subscribes the component tree to the store.
- `useCalculatorTheme` — applies the theme to the document.
- `useCalculatorKeyboardBindings` — global shortcuts.
- `useKeypadGridNavigation` — arrow-key grid navigation.

## Styles

Styling uses CSS Modules and CSS variables. There is no Tailwind. The design
tokens live in `themes.css`.

## Next steps

- [State management](/developer/state-management) explains the store.
- [Keyboard handling](/architecture/keyboard-handling) explains input flow.
- [Design system](/design-system/color-tokens) covers the tokens.
