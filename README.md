# Custom Scientific Calculator

A production-minded, DOM-based scientific calculator built as an expression
calculator with full keyboard navigation and accessible React Aria controls.

The application is designed as a calm, precise scientific instrument: a
multi-line expression editor, a broad scientific function set, angle modes,
numeric modes, constants, variables, memory, history, themes, and
enableable CAS-style operations.

## Features

- Expression-based entry with full cursor editing, selection, and
  context-aware smart delete.
- Broad scientific function set: trigonometric, inverse trigonometric,
  hyperbolic, logarithmic, exponential, root, rounding, and arithmetic
  functions.
- Angle modes: DEG, RAD, GON.
- Numeric modes: STANDARD, EXACT_DECIMAL, FRACTION, and BIGINT (with
  browser feature detection and graceful fallback).
- Configurable complex number support.
- Scientific constant catalog: mathematics, universal physics, atomic and
  particle, and chemistry constants.
- User variables with persistence.
- Classic memory register: M+, M−, MR, MC.
- Persistent calculation history stored in IndexedDB.
- Light, dark, and system themes using CSS variables.
- Enableable CAS-style symbolic operations: simplify, expand, and
  differentiate.
- Calculus operations: symbolic and numeric differentiation, definite
  integrals, symbolic antiderivatives, limits, Taylor series, and finite
  summations and products.
- Full keyboard navigation and visible focus states.
- Mouse support that is never required.

## Technology stack

- TypeScript with strict compiler settings
- React with Vite
- React Aria (`react-aria-components`) for accessible primitives
- math.js as the isolated math engine
- Zustand for thin UI state
- Dexie for IndexedDB persistence
- CSS Modules and CSS variables for styling
- Vitest, Testing Library, and fast-check for testing

## Architecture

The codebase follows a layered architecture with strong separation between
logic and presentation.

| Layer | Responsibility | Location |
| ----- | -------------- | -------- |
| Presentation | React components, React Aria usage, styles, and view models | `src/presentation` |
| State | Thin Zustand store mapping UI state to session state | `src/state` |
| Application | Commands, the application controller, and orchestration services | `src/application` |
| Domain | Pure TypeScript models and services with no external dependencies | `src/domain` |
| Infrastructure | math.js gateway, persistence, feature detection, and constant data | `src/infrastructure` |

Key rules:

- `.tsx` files render UI and forward events only.
- math.js is only reachable through `src/infrastructure/mathjs`.
- React Aria is only used in the presentation layer.
- All meaningful logic lives in discrete TypeScript classes.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Keyboard shortcuts

- `Enter` — evaluate the expression
- `Backspace` — smart delete backward
- `Delete` — delete forward
- `Ctrl+Backspace` — delete a token or word
- `Escape` — clear the expression or close the active panel
- `Ctrl+D` — cycle the angle mode
- `Ctrl+H` — open the history panel
- `Ctrl+M` — open the memory panel
- `Ctrl+E` — open the constants panel
- `Ctrl+L` — open the calculus panel
- `Ctrl+,` — open the settings panel

Digits, operators, parentheses, and function names can be typed directly
into the expression input.

## Security

- The expression is parsed through the math.js parser, never through
  `eval` or `new Function`.
- math.js is wrapped behind an infrastructure gateway with a function
  allowlist and a controlled scope.
- User input is treated as untrusted.

## License

MIT
