---
title: Vector
description: How to enter vectors and compute dot, cross, magnitude, angle, and unit operations.
---

# Vector

The **Vector** app (5) stores two vectors — VecA and VecB — with two or three
components each, and computes the standard vector operations.

## Opening the app

Open the home menu and select **Vector**.

## Entering vectors

Each vector has a dimension selector (2 or 3 components). Type a value into
each component field; empty fields count as zero.

## Operations

Choose an operation from the **Vector operation** selector, then press
**Compute**:

| Operation               | Description                          |
| ----------------------- | ------------------------------------ |
| Dot product             | scalar product of A and B            |
| Cross product           | cross product of A and B (3D only)   |
| Magnitude of A          | length of VecA                       |
| Angle between A and B   | angle in radians                     |
| Unit vector of A        | A normalized to length one           |

## Errors

Operations surface clear error messages instead of fake results:

- Cross product on vectors that are not three-dimensional.
- Dot product or angle on vectors of different dimensions.
- Unit vector of a zero vector.

## Example

```
VecA = [3, 4]
unit(A)      ->  [0.6, 0.8]
|A|          ->  5
VecA × VecB  with VecB = [1, 0, 0], VecA = [0, 1, 0]
A × B        ->  [0, 0, 1]
```

## Related documentation

- [Matrix](/user-guide/matrix) covers matrix operations.
- [Complex numbers](/user-guide/complex-numbers) covers complex arithmetic.
- [Base-N](/user-guide/base-n) covers integer arithmetic in other bases.
