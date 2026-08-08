---
title: Adding a Constant
description: How to add a new scientific constant to the catalog.
---

# Adding a Constant

Constants are data. Adding one requires a definition entry and a catalog
aggregation.

## Step one: create the constant

Constants live in `src/infrastructure/constants`. Add a new `ScientificConstant`
to the appropriate category file.

```ts
new ScientificConstant(
  "solarConstant",
  "S",
  "Solar constant",
  ScientificConstantCategory.UNIVERSAL_PHYSICS,
  "1361",
  "W/m²",
  "The average irradiance of the Sun at Earth's orbit.",
  "CODATA 2018",
  ["solar"]
)
```

The constructor takes:

1. `id` — the unique identifier.
2. `displaySymbol` — the symbol shown in the panel, such as `c`.
3. `name` — the full name.
4. `category` — one of the `ScientificConstantCategory` values.
5. `valueText` — the numeric value as text.
6. `unit` — the SI unit, or `null`.
7. `description` — a description.
8. `source` — the reference source.
9. `aliases` — additional names accepted in expressions.

## Step two: register the constant

The registry aggregates all category modules:

```ts
export class ScientificConstantRegistry {
  public static createAllConstants(): readonly ScientificConstant[] {
    return [
      ...mathConstants,
      ...physicsConstants,
      ...atomicParticleConstants,
      ...chemistryConstants,
    ];
  }
}
```

Add your category module to the list.

## Step three: test

- Add a repository test asserting the constant is returned.
- Add a catalog test asserting insertion text resolves.
- Add a scope builder test if the constant needs a math.js scope value.

## Insertion behavior

Inserting a constant inserts its insertion text (usually the id or the first
alias) and places the cursor after the token.

## Next steps

- [Adding a function](/developer/adding-a-function)
- [Constants usage](/user-guide/constants)
