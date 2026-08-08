---
title: Security
description: How to report security issues in the scientific calculator.
---

# Security

Security is important to this project. If you believe you have found a security issue, please report it responsibly.

## Security posture

- Expressions are parsed through the math.js parser, never through `eval` or `new Function`.
- A function whitelist limits which functions the engine may call.
- User input is treated as untrusted.

See the [Security policy](/developer/security-policy) for details.

## Reporting a vulnerability

Do not open a public issue for a security vulnerability. Instead, report it privately through the project maintainers. Include:

- A description of the issue.
- Steps to reproduce.
- The affected version.
- Any suggested fix, if available.

## What to include

- Proof-of-concept input where applicable.
- Impact assessment.
- Whether the issue affects evaluation, persistence, or rendering.

## Response

Reported issues are acknowledged and triaged. A fix and disclosure are coordinated before public announcement where appropriate.

## Related pages

- [Security policy](/developer/security-policy)
- [Support](/project/support)
