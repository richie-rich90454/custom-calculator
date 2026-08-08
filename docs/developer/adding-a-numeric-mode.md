---
title: Adding a Numeric Mode
description: How to add a new numeric mode and integrate it with the mode policy.
---

# Adding a Numeric Mode

Numeric modes control how results are computed and displayed. Adding one
touches the mode policy, the settings model, and the evaluation gateway.

## Step one: add the mode value

Extend `NumericMode`:

```ts
export enum NumericMode {
  STANDARD = "STANDARD",
  EXACT_DECIMAL = "EXACT_DECIMAL",
  FRACTION = "FRACTION",
  BIGINT = "BIGINT",
  // add your mode
}
```

## Step two: extend the mode policy

`DefaultNumericModePolicyService` decides which modes are supported and how a
requested mode resolves when unsupported.

```ts
public getSupportedNumericModes(): readonly NumericMode[] {
  const supportedModes: NumericMode[] = [
    NumericMode.STANDARD,
    NumericMode.EXACT_DECIMAL,
    NumericMode.FRACTION,
  ];

  if (this.bigIntSupportDetector.isBigIntSupported()) {
    supportedModes.push(NumericMode.BIGINT);
  }

  return supportedModes;
}
```

- Add the mode to the supported list.
- Add feature detection if the mode depends on a browser capability.

## Step three: wire evaluation

The evaluation gateway maps the effective numeric mode to math.js behavior.
See the math.js gateway in `src/infrastructure/mathjs`.

## Step four: settings

`CalculatorSettings` carries the numeric mode and persists it. Ensure the new
mode is round-tripped through `LocalStorageSettingsRepository` and the
bootstrap BigInt fallback logic.

## Step five: test

- Add a policy test for supported modes.
- Add a settings round-trip test.
- Add a coverage test for the new branches.

## Next steps

- [Numeric modes](/user-guide/numeric-modes)
- [BigInt fallback flow](/architecture/diagrams)
