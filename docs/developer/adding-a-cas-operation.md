---
title: Adding a CAS Operation
description: How to add a new CAS operation to the calculator.
---

# Adding a CAS Operation

CAS operations are symbolic operations exposed as `cas(...)` blocks. Adding
one involves an operation kind, a catalog entry, and routing.

## Step one: add the operation kind

Extend `CasOperationKind`:

```ts
export enum CasOperationKind {
  SIMPLIFY = "SIMPLIFY",
  EXPAND = "EXPAND",
  DERIVATIVE = "DERIVATIVE",
  // add your kind
}
```

## Step two: add the catalog entry

Add an entry to `DefaultCasOperationCatalogService`:

```ts
{
  functionName: "casFactor",
  operationKind: CasOperationKind.FACTOR,
  label: "factor",
  ariaLabel: "Insert CAS factor block",
  invocationText: "casFactor(",
  description: "Factors the wrapped symbolic expression.",
}
```

## Step three: extend the parser

Extend `DefaultCasBlockParser` so `casFactor(...)` resolves to the new kind
and produces the correct descriptor.

## Step four: extend the service

Extend `CasService` with the new operation and implement it in
`MathJsCasService`.

## Step five: extend the router

Extend `DefaultCasExpressionRouterService` to route the new kind to the
service.

## Step six: test

- Add a catalog test for the new function name.
- Add a parser test for the new block form.
- Add a service test for the symbolic result.
- Add a keypad test for the new key.

## Next steps

- [CAS overview](/cas/overview)
- [Adding a function](/developer/adding-a-function)
