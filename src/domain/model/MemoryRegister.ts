export class MemoryRegister {
  public constructor(
    public readonly valueText: string,
    public readonly updatedAt: string
  ) {}

  public static createEmpty(): MemoryRegister {
    return new MemoryRegister("", "");
  }

  public get isEmpty(): boolean {
    return this.valueText.length === 0;
  }
}
