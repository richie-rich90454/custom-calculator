---
title: Matrix
description: How to enter and operate on matrices in the Matrix app.
---

# Matrix

The **Matrix** app (4) stores three matrices — MatA, MatB, and MatC — and
computes the common matrix operations on them.

## Opening the app

Open the home menu and select **Matrix**.

## Entering matrices

Each matrix has a row and column selector (1 to 4 each). Type a value into
every cell; empty cells count as zero.

## Operations

Choose an operation from the **Matrix operation** selector, then press
**Compute**:

| Operation      | Description                          |
| -------------- | ------------------------------------ |
| A + B          | matrix addition                      |
| A − B          | matrix subtraction                   |
| A × B          | matrix multiplication                |
| Transpose A    | transpose of MatA                    |
| Determinant of A | determinant of MatA (square only)   |
| Inverse of A   | inverse of MatA (square, non-singular) |
| Identity (3×3) | the 3×3 identity matrix              |

## Errors

Operations surface clear error messages instead of fake results:

- Adding or subtracting matrices of different dimensions.
- Multiplying matrices whose dimensions do not match.
- Determinant or inverse of a non-square matrix.
- Inverse of a singular matrix.

## Example

With MatA and MatB both `[[1, 2], [3, 4]]`:

```
A × B  ->  [[7, 10], [15, 22]]
det(A) ->  -2
A⁻¹    ->  [[-2, 1], [1.5, -0.5]]
```

## Related documentation

- [Vector](/user-guide/vector) covers vector operations.
- [Complex numbers](/user-guide/complex-numbers) covers complex arithmetic.
- [Base-N](/user-guide/base-n) covers integer arithmetic in other bases.
