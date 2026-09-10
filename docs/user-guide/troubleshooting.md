---
title: Troubleshooting
description: Solutions to common problems when using the calculator.
---

# Troubleshooting

This page covers common problems and their solutions.

## An expression evaluates with an error

The error line shows a message describing the problem. Common causes:

- Division by zero: `1/0`.
- Unknown function or variable name.
- Invalid syntax such as a trailing operator: `2+`.
- A non-real result with complex numbers disabled, such as `sqrt(-1)`.

Fix the expression and evaluate again. See [Parentheses](/user-guide/parentheses) for grouping help.

## The result looks wrong

Check the operator precedence. See [Operator precedence](/user-guide/operator-precedence). If the expression involves trigonometric functions, check the angle mode. See [Angle modes](/user-guide/angle-modes).

## The caret is not where I expect it

Every button press places the caret at the logically correct position: after a digit or operator, inside a function call, and at the first placeholder for a template. If the caret appears to jump, try clicking the expression editor to focus it. See [Expression editing](/user-guide/expression-editing).

## BigInt mode is not available

BigInt mode requires browser support for `BigInt`. If the browser does not support it, the mode is hidden and the calculator falls back to standard behavior. See [BigInt mode](/user-guide/bigint-mode).

## History is missing

History is stored in IndexedDB. If the browser blocks storage, history may not persist. Check that storage is not disabled in private browsing or by browser settings.

## Settings do not persist

Settings are stored in local storage. If storage is unavailable, settings reset on reload.

## The keypad does not respond to the mouse

The keypad never requires a mouse, but it also fully supports one. If buttons appear unresponsive, press `Tab` to reach the keypad toolbar and use the arrow keys plus `Enter` to activate a button.

## An app shows an error or an empty result

Each app reports clear errors for invalid input:

- **Matrix** rejects dimension mismatches and non-square determinants or inverses.
- **Vector** requires three-component vectors for the cross product and rejects the zero vector's unit.
- **Statistics** needs enough paired data and rejects zero-variance input.
- **Equation** reports singular or under-determined systems instead of guessing.
- **Ratio** requires exactly one missing term with positive values.
- **Table** rejects ranges with a non-positive step, an end below the start, or more than 200 rows.

If an app shows a message that a feature is unavailable, check the status strip for the reason.

## Unit conversion reports an error

The unit conversion tab converts between compatible units within a category. A non-numeric value, an empty value, or units that cannot be converted to each other report a clear error. Temperature uses its own affine formulas. See [Unit conversion](/user-guide/unit-conversion).

## A calculus result mentions angle conversion

When a numeric calculus operation runs under DEG or GON, the status strip notes that trig input is converted from the active mode. This is expected: numeric calculus interprets trig in radians and applies the conversion factor. See [Angle mode policy](/calculus/angle-mode-policy).

## Related documentation

- [FAQ](/user-guide/faq) answers common questions.
- [Security policy](/project/security) explains how to report issues.
