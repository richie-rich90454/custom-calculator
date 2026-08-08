---
title: Repository Structure
description: The layout of the repository and where every layer lives.
---

# Repository Structure

The repository is organized into a root application and an isolated
documentation package.

```
custom-calculator/
├── docs/                  Isolated VitePress documentation package
├── src/
│   ├── app/               Bootstrap, composition root, application context
│   ├── application/       Commands, controller, orchestration, CAS and calculus
│   ├── domain/            Pure models and services, no external dependencies
│   ├── infrastructure/    math.js gateway, persistence, feature detection, data
│   ├── presentation/      React components, services, view models, styles, hooks
│   ├── state/             Thin Zustand store and UI actions
│   ├── test/              Test harness and setup
│   └── main.tsx           Application entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Root files

| File | Purpose |
| ---- | ------- |
| `package.json` | Root dependencies and scripts |
| `vite.config.ts` | Vite and Vitest configuration |
| `tsconfig.json` | Strict TypeScript configuration |
| `index.html` | HTML entry point |
| `.prettierrc.json` | Prettier formatting rules |
| `eslint.config.js` | ESLint configuration |

## Documentation package

The `docs` directory is a fully isolated package with its own `package.json`,
dependencies, and scripts. It never shares dependencies with the root.

```
cd docs
npm install
npm run dev
```

See the [installation](/getting-started/installation) page.

## The source tree

Each layer has a single responsibility. The dependency direction is strict:
presentation -> state -> application -> domain, with infrastructure at the
bottom.

- `src/domain` — pure TypeScript, no React, no math.js.
- `src/application` — commands and controllers that orchestrate the domain.
- `src/infrastructure` — math.js gateway, persistence, feature detection, and
  static constant data.
- `src/presentation` — React components, view models, services, and styles.
- `src/state` — the thin Zustand store that connects UI actions to the
  application controller.

## Layer documentation

- [Domain layer](/developer/domain-layer)
- [Application layer](/developer/application-layer)
- [Infrastructure layer](/developer/infrastructure-layer)
- [Presentation layer](/developer/presentation-layer)
- [State management](/developer/state-management)

## Next steps

- [Architecture overview](/developer/architecture-overview) explains the
  layering.
- [Composition root](/developer/composition-root) explains dependency wiring.
