---
title: Installation
description: How to install, run, and verify the scientific calculator from source.
---

# Installation

The calculator is a standard Vite + React project. This page covers installing dependencies, running the development server, and running the verification commands.

## Prerequisites

- Node.js 18 or newer with npm
- A modern browser (Chrome, Edge, Firefox, or Safari)

## Install dependencies

From the repository root, install the project dependencies:

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`. Open it in your browser to use the calculator.

## Build for production

```bash
npm run build
```

The build type-checks the project and then produces the production bundle in the `dist` directory.

## Preview the production build

```bash
npm run preview
```

## Verification commands

The project includes type checking, linting, and an exhaustive test suite.

```bash
npm run typecheck
npm run lint
npm run test
```

The test suite runs Vitest with strict 100 percent coverage thresholds across statements, branches, functions, and lines.

## Running the documentation site

The documentation is an isolated VitePress package inside the `docs` directory. It has its own dependencies and scripts.

```bash
cd docs
npm install
npm run dev
```

See [the documentation guide](/developer/repository-structure) for the full repository layout.

## Next steps

- [Quick start](/getting-started/quick-start) walks through your first session.
- [First calculation](/getting-started/first-calculation) explains entering and evaluating an expression.
