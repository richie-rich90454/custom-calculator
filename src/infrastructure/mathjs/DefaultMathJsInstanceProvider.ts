import { create, all, type MathJsInstance } from "mathjs";
import { MathJsInstanceProvider } from "./MathJsInstanceProvider";

export class DefaultMathJsInstanceProvider implements MathJsInstanceProvider {
  private readonly instance: MathJsInstance;

  public constructor() {
    this.instance = create(all, {});
  }

  public getInstance(): MathJsInstance {
    return this.instance;
  }
}
