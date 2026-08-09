import type { ReactNode } from "react";

interface CalculatorAppIconComponentProperties {
    readonly iconId: string;
}

/**
 * Original inline SVG line artwork for the ten app icons.
 *
 * Every icon is drawn from scratch as 24x24 stroke geometry so no
 * third-party artwork or branding is used.
 */
export function CalculatorAppIconComponent(props: CalculatorAppIconComponentProperties) {
    const { iconId } = props;

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {resolveIconPath(iconId)}
        </svg>
    );
}

function resolveIconPath(iconId: string): ReactNode {
    switch (iconId) {
        case "calculate":
            return (
                <g>
                    <line x1="9" y1="9" x2="15" y2="9" />
                    <circle cx="12" cy="6" r="0.4" />
                    <circle cx="12" cy="12" r="0.4" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                    <line x1="4" y1="20" x2="20" y2="20" />
                </g>
            );
        case "complex":
            return (
                <g>
                    <circle cx="12" cy="12" r="7" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <circle cx="12" cy="6" r="0.5" />
                </g>
            );
        case "base-n":
            return (
                <g>
                    <circle cx="8" cy="12" r="3" />
                    <line x1="16" y1="6" x2="16" y2="18" />
                    <line x1="13" y1="10" x2="19" y2="10" />
                    <line x1="13" y1="14" x2="19" y2="14" />
                </g>
            );
        case "matrix":
            return (
                <g>
                    <line x1="5" y1="3" x2="5" y2="21" />
                    <line x1="19" y1="3" x2="19" y2="21" />
                    <circle cx="10" cy="8" r="0.5" />
                    <circle cx="14" cy="8" r="0.5" />
                    <circle cx="10" cy="12" r="0.5" />
                    <circle cx="14" cy="12" r="0.5" />
                    <circle cx="10" cy="16" r="0.5" />
                    <circle cx="14" cy="16" r="0.5" />
                </g>
            );
        case "vector":
            return (
                <g>
                    <line x1="4" y1="20" x2="18" y2="6" />
                    <path d="M18 6 L11 6 M18 6 L18 13" />
                </g>
            );
        case "statistics":
            return (
                <g>
                    <line x1="4" y1="20" x2="20" y2="20" />
                    <line x1="7" y1="20" x2="7" y2="14" />
                    <line x1="12" y1="20" x2="12" y2="9" />
                    <line x1="17" y1="20" x2="17" y2="5" />
                </g>
            );
        case "table":
            return (
                <g>
                    <rect x="4" y="5" width="16" height="14" rx="1" />
                    <line x1="4" y1="10" x2="20" y2="10" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="5" x2="10" y2="19" />
                    <line x1="15" y1="5" x2="15" y2="19" />
                </g>
            );
        case "equation":
            return (
                <g>
                    <path d="M4 17 C8 17 8 7 12 7 C16 7 16 17 20 17" />
                    <line x1="12" y1="7" x2="12" y2="17" />
                </g>
            );
        case "calculus":
            return <path d="M6 4 C12 4 8 8 12 12 C16 16 12 20 18 20" />;
        case "ratio":
            return (
                <g>
                    <circle cx="9" cy="9" r="3" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                    <line x1="12" y1="20" x2="12" y2="20" />
                    <circle cx="15" cy="17" r="3" />
                </g>
            );
        default:
            return <circle cx="12" cy="12" r="7" />;
    }
}
