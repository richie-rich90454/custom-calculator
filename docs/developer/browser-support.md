---
title: Browser Support
description: The browser environments the calculator supports.
---

# Browser Support

The calculator targets modern evergreen browsers.

## Supported environments

- Chrome and Chromium-based browsers
- Edge
- Firefox
- Safari

## Requirements

- A browser that supports ES2022.
- `BigInt` support is detected at runtime; where absent, BigInt mode falls back
  gracefully. See [BigInt mode](/user-guide/bigint-mode).
- IndexedDB is used for history and variables, with an in-memory fallback.

## Modern APIs used

- CSS variables and `prefers-color-scheme` for theming.
- `matchMedia` for system theme resolution.
- IndexedDB via Dexie.
- React 19 and React Aria primitives.

## Feature detection

`BrowserFeatureDetectionService` detects `BigInt` support at startup. See
[Feature detection](/developer/infrastructure-layer).

## Mobile

The interface is touch friendly and remains usable on mobile browsers. See
[Mobile usage](/user-guide/mobile-usage).

## Next steps

- [Performance](/developer/performance)
- [Accessibility guide](/developer/accessibility-guide)
