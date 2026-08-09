import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { katex as markdownItKatex } from "@mdit/plugin-katex";

const siteDescription =
    "Documentation hub for a custom expression-based scientific calculator with calculus, CAS, keyboard-first editing, and professional math notation.";

export default withMermaid(
    defineConfig({
        lang: "en-US",
        title: "Scientific Calculator Docs",
        description: siteDescription,
        lastUpdated: true,
        cleanUrls: true,

        markdown: {
            config: (markdownIt) => {
                markdownIt.use(markdownItKatex, {
                    output: "html",
                    throwOnError: false,
                });
            },
        },

        themeConfig: {
            nav: [
                {
                    text: "Guide",
                    items: [
                        { text: "Getting Started", link: "/getting-started/introduction" },
                        { text: "User Guide", link: "/user-guide/expression-editing" },
                        {
                            text: "Scientific Reference",
                            link: "/scientific-reference/function-catalog",
                        },
                        { text: "Calculus Reference", link: "/calculus/overview" },
                        { text: "CAS Reference", link: "/cas/overview" },
                        { text: "Notation Guide", link: "/scientific-reference/notation-guide" },
                    ],
                },
                {
                    text: "Develop",
                    items: [
                        { text: "Developer Guide", link: "/developer/repository-structure" },
                        { text: "Architecture", link: "/architecture/layers" },
                        { text: "Design System", link: "/design-system/color-tokens" },
                        { text: "API Reference", link: "/api/api-reference-index" },
                    ],
                },
                {
                    text: "Project",
                    items: [
                        { text: "About", link: "/project/about" },
                        { text: "Roadmap", link: "/project/roadmap" },
                        { text: "Changelog", link: "/project/changelog" },
                        { text: "Glossary", link: "/project/glossary" },
                        { text: "License", link: "/project/license" },
                        { text: "Support", link: "/project/support" },
                    ],
                },
            ],

            sidebar: {
                "/getting-started/": [
                    {
                        text: "Getting Started",
                        items: [
                            { text: "Introduction", link: "/getting-started/introduction" },
                            { text: "Installation", link: "/getting-started/installation" },
                            { text: "Quick Start", link: "/getting-started/quick-start" },
                            {
                                text: "First Calculation",
                                link: "/getting-started/first-calculation",
                            },
                            { text: "Interface Tour", link: "/getting-started/interface-tour" },
                            {
                                text: "Keyboard First Usage",
                                link: "/getting-started/keyboard-first-usage",
                            },
                        ],
                    },
                ],

                "/user-guide/": [
                    {
                        text: "User Guide",
                        items: [
                            {
                                text: "Interface Overview",
                                link: "/user-guide/interface-overview",
                            },
                            { text: "Keymap Reference", link: "/user-guide/keymap-reference" },
                            { text: "Expression Editing", link: "/user-guide/expression-editing" },
                            { text: "Smart Backspace", link: "/user-guide/smart-backspace" },
                            { text: "Parentheses", link: "/user-guide/parentheses" },
                            {
                                text: "Implicit Multiplication",
                                link: "/user-guide/implicit-multiplication",
                            },
                            {
                                text: "Operator Precedence",
                                link: "/user-guide/operator-precedence",
                            },
                            { text: "Angle Modes", link: "/user-guide/angle-modes" },
                            { text: "Numeric Modes", link: "/user-guide/numeric-modes" },
                            { text: "Complex Numbers", link: "/user-guide/complex-numbers" },
                            { text: "BigInt Mode", link: "/user-guide/bigint-mode" },
                            { text: "Fractions", link: "/user-guide/fractions" },
                            { text: "Exact Decimal", link: "/user-guide/exact-decimal" },
                            { text: "Constants", link: "/user-guide/constants" },
                            { text: "Variables", link: "/user-guide/variables" },
                            { text: "Memory", link: "/user-guide/memory" },
                            { text: "History", link: "/user-guide/history" },
                            { text: "Themes", link: "/user-guide/themes" },
                            { text: "Settings", link: "/user-guide/settings" },
                            { text: "Mobile Usage", link: "/user-guide/mobile-usage" },
                            { text: "Keyboard Shortcuts", link: "/user-guide/keyboard-shortcuts" },
                            { text: "Troubleshooting", link: "/user-guide/troubleshooting" },
                            { text: "FAQ", link: "/user-guide/faq" },
                        ],
                    },
                ],

                "/scientific-reference/": [
                    {
                        text: "Scientific Reference",
                        items: [
                            {
                                text: "Function Catalog",
                                link: "/scientific-reference/function-catalog",
                            },
                            {
                                text: "Math Constants",
                                link: "/scientific-reference/constants-math",
                            },
                            {
                                text: "Physics Constants",
                                link: "/scientific-reference/constants-physics",
                            },
                            {
                                text: "Chemistry Constants",
                                link: "/scientific-reference/constants-chemistry",
                            },
                            {
                                text: "Atomic Constants",
                                link: "/scientific-reference/constants-atomic",
                            },
                            {
                                text: "Notation Guide",
                                link: "/scientific-reference/notation-guide",
                            },
                        ],
                    },
                ],

                "/calculus/": [
                    {
                        text: "Calculus Reference",
                        items: [
                            { text: "Overview", link: "/calculus/overview" },
                            { text: "Derivatives", link: "/calculus/derivatives" },
                            { text: "Numeric Derivatives", link: "/calculus/numeric-derivatives" },
                            { text: "Integrals", link: "/calculus/integrals" },
                            {
                                text: "Symbolic Integration",
                                link: "/calculus/symbolic-integration",
                            },
                            { text: "Limits", link: "/calculus/limits" },
                            { text: "Taylor Series", link: "/calculus/taylor-series" },
                            { text: "Summations", link: "/calculus/summations" },
                            { text: "Products", link: "/calculus/products" },
                            { text: "Angle Mode Policy", link: "/calculus/angle-mode-policy" },
                            { text: "Examples", link: "/calculus/examples" },
                        ],
                    },
                ],

                "/cas/": [
                    {
                        text: "CAS Reference",
                        items: [
                            { text: "Overview", link: "/cas/overview" },
                            { text: "Enabling CAS", link: "/cas/enabling-cas" },
                            { text: "CAS Block", link: "/cas/cas-block" },
                            { text: "Simplify", link: "/cas/simplify" },
                            { text: "Expand", link: "/cas/expand" },
                            { text: "Derivative", link: "/cas/derivative" },
                            { text: "Limitations", link: "/cas/limitations" },
                            { text: "Examples", link: "/cas/examples" },
                        ],
                    },
                ],

                "/developer/": [
                    {
                        text: "Developer Guide",
                        items: [
                            {
                                text: "Repository Structure",
                                link: "/developer/repository-structure",
                            },
                            {
                                text: "Architecture Overview",
                                link: "/developer/architecture-overview",
                            },
                            { text: "Domain Layer", link: "/developer/domain-layer" },
                            { text: "Application Layer", link: "/developer/application-layer" },
                            {
                                text: "Infrastructure Layer",
                                link: "/developer/infrastructure-layer",
                            },
                            { text: "Presentation Layer", link: "/developer/presentation-layer" },
                            { text: "State Management", link: "/developer/state-management" },
                            { text: "Composition Root", link: "/developer/composition-root" },
                            { text: "Command Pattern", link: "/developer/command-pattern" },
                            { text: "Adding a Function", link: "/developer/adding-a-function" },
                            { text: "Adding a Constant", link: "/developer/adding-a-constant" },
                            { text: "Adding a Panel", link: "/developer/adding-a-panel" },
                            {
                                text: "Adding a CAS Operation",
                                link: "/developer/adding-a-cas-operation",
                            },
                            {
                                text: "Adding a Numeric Mode",
                                link: "/developer/adding-a-numeric-mode",
                            },
                            { text: "Testing Guide", link: "/developer/testing-guide" },
                            { text: "Coverage Policy", link: "/developer/coverage-policy" },
                            { text: "Commit Policy", link: "/developer/commit-policy" },
                            { text: "Code Style Guide", link: "/developer/code-style-guide" },
                            { text: "Naming Conventions", link: "/developer/naming-conventions" },
                            { text: "Security Policy", link: "/developer/security-policy" },
                            { text: "Performance", link: "/developer/performance" },
                            { text: "Browser Support", link: "/developer/browser-support" },
                            { text: "Accessibility Guide", link: "/developer/accessibility-guide" },
                            { text: "Theming Guide", link: "/developer/theming-guide" },
                            { text: "Contributing", link: "/developer/contributing" },
                        ],
                    },
                ],

                "/architecture/": [
                    {
                        text: "Architecture",
                        items: [
                            { text: "App Shell", link: "/architecture/app-shell" },
                            { text: "Layers", link: "/architecture/layers" },
                            {
                                text: "Evaluation Pipeline",
                                link: "/architecture/evaluation-pipeline",
                            },
                            { text: "CAS Routing", link: "/architecture/cas-routing" },
                            { text: "State Machine", link: "/architecture/state-machine" },
                            { text: "Persistence", link: "/architecture/persistence" },
                            { text: "Keyboard Handling", link: "/architecture/keyboard-handling" },
                            {
                                text: "Expression Editing Model",
                                link: "/architecture/expression-editing-model",
                            },
                            { text: "Cursor Management", link: "/architecture/cursor-management" },
                            { text: "Diagrams", link: "/architecture/diagrams" },
                        ],
                    },
                ],

                "/design-system/": [
                    {
                        text: "Design System",
                        items: [
                            { text: "Visual Language", link: "/design-system/visual-language" },
                            { text: "Color Tokens", link: "/design-system/color-tokens" },
                            { text: "Typography", link: "/design-system/typography" },
                            { text: "Spacing", link: "/design-system/spacing" },
                            { text: "Components", link: "/design-system/components" },
                            { text: "Panels", link: "/design-system/panels" },
                            { text: "Buttons", link: "/design-system/buttons" },
                            { text: "Display", link: "/design-system/display" },
                            { text: "Themes", link: "/design-system/themes" },
                        ],
                    },
                ],

                "/project/": [
                    {
                        text: "Project",
                        items: [
                            { text: "About", link: "/project/about" },
                            { text: "Roadmap", link: "/project/roadmap" },
                            { text: "Changelog", link: "/project/changelog" },
                            { text: "Glossary", link: "/project/glossary" },
                            { text: "License", link: "/project/license" },
                            { text: "Security", link: "/project/security" },
                            { text: "Support", link: "/project/support" },
                        ],
                    },
                ],

                "/api/": [
                    {
                        text: "API Reference",
                        items: [{ text: "API Reference Index", link: "/api/api-reference-index" }],
                    },
                ],
            },

            search: {
                provider: "local",
                options: {
                    detailedView: true,
                },
            },

            outline: {
                level: [2, 3],
                label: "On this page",
            },

            socialLinks: [],
        },

        head: [
            ["meta", { name: "description", content: siteDescription }],
            ["meta", { name: "theme-color", content: "#1e3a5f" }],
        ],
    }),
);
