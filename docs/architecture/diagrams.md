---
title: Diagrams
description: The full collection of architecture diagrams for the calculator.
---

# Diagrams

This page collects the architecture diagrams of the calculator.

## Layer architecture

```mermaid
flowchart TB
    subgraph Presentation
        P1[Components]
        P2[View Models]
        P3[Services]
    end
    subgraph State
        S1[Zustand Store]
    end
    subgraph Application
        A1[Controller]
        A2[Commands]
    end
    subgraph Domain
        D1[Models]
        D2[Services]
    end
    subgraph Infrastructure
        I1[math.js Gateway]
        I2[Persistence]
    end

    Presentation --> State
    State --> Application
    Application --> Domain
    Infrastructure --> Domain
```

## Evaluation pipeline

```mermaid
flowchart LR
    A[Enter] --> B[Keyboard service]
    B --> C[Store action]
    C --> D[Evaluate command]
    D --> E[Auto-close]
    E --> F{CAS block?}
    F -- Yes --> G[CAS router]
    F -- No --> H{Calculus block?}
    H -- Yes --> I[Calculus router]
    H -- No --> J[Validate]
    J --> K[Math.js gateway]
    K --> L[Format]
    L --> M[Result]
```

## CAS routing

```mermaid
flowchart LR
    A[Expression] --> B[Parser]
    B -- cas block --> C[Descriptor]
    C --> D[Router]
    D --> E[CAS service]
    E --> F[Symbolic result]
    B -- other --> G[Numeric evaluation]
```

## Calculus routing

```mermaid
flowchart LR
    A[Expression] --> B[Calculus parser]
    B -- block --> C[Descriptor]
    C --> D[Router]
    D --> E[Numeric services]
    D --> F[Symbolic services]
    E --> G[Result]
    F --> G
```

## State transitions

```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> Editing: insert
    Editing --> Editing: edit
    Editing --> Evaluated: evaluate
    Evaluated --> Editing: digit or operator
    Editing --> Empty: clear
```

## Persistence flow

```mermaid
flowchart LR
    A[UI action] --> B[Store]
    B --> C[Orchestration]
    C --> D[Repositories]
    D --> E[Local storage]
    D --> F[IndexedDB]
```

## Keyboard command flow

```mermaid
flowchart LR
    A[Key event] --> B[Editor keyboard service]
    B --> C[Editor actions]
    A --> D[Global shortcut registry]
    D --> E[Panel and mode actions]
```

## Composition root wiring

```mermaid
flowchart LR
    A[Composition root] --> B[Domain services]
    A --> C[math.js gateway]
    A --> D[CAS and calculus]
    A --> E[Persistence]
    A --> F[Controller]
    F --> B
    F --> C
    F --> D
```

## Expression editing model

```mermaid
flowchart TB
    A[Insert] --> B[Text edit]
    A --> C[Delete backward]
    C --> D{Selection?}
    D -- Yes --> E[Delete selection]
    D -- No --> F[Smart rules]
    A --> G[Auto-close]
```

## Cursor management model

```mermaid
flowchart LR
    A[Button press] --> B[Insertion service]
    B --> C[Cursor placement]
    C --> D[Caret rendering]
    C --> E[Scroll to caret]
    C --> F[Focus preservation]
```

## Numeric mode policy

```mermaid
flowchart TB
    A[Requested mode] --> B{Supported?}
    B -- Yes --> C[Effective mode]
    B -- No --> D[Fallback mode]
```

## BigInt fallback flow

```mermaid
flowchart LR
    A[Startup] --> B[Detect BigInt]
    B -- supported --> C[BigInt mode available]
    B -- unsupported --> D[Exclude BigInt mode]
    D --> E[Fallback to exact decimal]
    E --> F[Status message]
```

## Next steps

- [Layers](/architecture/layers)
- [Cursor management](/architecture/cursor-management)
