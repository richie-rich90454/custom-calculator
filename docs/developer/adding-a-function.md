---
title: Adding a Function
description: How to add a new scientific function to the calculator.
---

# Adding a Function

Adding a function involves a data definition, a math.js whitelist check, and optional keypad placement.

## Step one: add the definition

Function definitions live in data modules under `src/infrastructure/functions`. Pick the file for the matching category or create a new one.

```ts
new ScientificFunctionDefinition(
    "cot",
    "cot",
    "Cotangent of an angle",
    ScientificFunctionCategory.TRIGONOMETRIC,
    1,
    1,
);
```

The constructor takes:

1. `name` — the name used in expressions, such as `cot`.
2. `displayLabel` — the label shown on the keypad.
3. `description` — a human-readable description.
4. `category` — one of the `ScientificFunctionCategory` values.
5. `minimumArgumentCount` — the minimum number of arguments.
6. `maximumArgumentCount` — the maximum number of arguments.

## Step two: register the data module

Add the module to `scientificFunctionDefinitionRegistry` so the catalog service picks it up.

```ts
export const scientificFunctionDefinitionRegistry: readonly ScientificFunctionDefinition[] = [
    ...trigonometricFunctionDefinitions,
    // ...
];
```

## Step three: add the key

Add a key definition in `DefaultKeypadDefinitionRepository` for the scientific pad:

```ts
{
  id: "cot",
  label: "cot",
  ariaLabel: "Cotangent function",
  kind: CalculatorKeyKind.FUNCTION,
  value: "cot",
}
```

## Step four: whitelist the function

The math.js whitelist is built from the function catalog, so registering the definition automatically allows the function through the gateway. Verify the whitelist behavior with a test.

## Step five: test

- Add a catalog test asserting the function is present.
- Add a keypad test asserting the key inserts correctly.
- Add a whitelist test if behavior changes.

See [Testing guide](/developer/testing-guide).

## Evaluation security

Every function must be parseable by math.js and allowed by the whitelist. User input is never executed as code. See [Security policy](/developer/security-policy).

## Next steps

- [Adding a constant](/developer/adding-a-constant)
- [Adding a panel](/developer/adding-a-panel)
