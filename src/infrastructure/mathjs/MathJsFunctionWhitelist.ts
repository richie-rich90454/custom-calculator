export class MathJsFunctionWhitelist {
    private readonly allowedFunctionNames: ReadonlySet<string>;

    public constructor(allowedFunctionNames: readonly string[]) {
        this.allowedFunctionNames = new Set(allowedFunctionNames);
    }

    public isFunctionAllowed(functionName: string): boolean {
        return this.allowedFunctionNames.has(functionName);
    }

    public getAllowedFunctionNames(): readonly string[] {
        return [...this.allowedFunctionNames];
    }
}
