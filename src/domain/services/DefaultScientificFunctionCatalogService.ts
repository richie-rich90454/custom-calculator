import {
  ScientificFunctionCategory,
  ScientificFunctionDefinition,
} from "./ScientificFunctionDefinition";
import { ScientificFunctionCatalogService } from "./ScientificFunctionCatalogService";

export class DefaultScientificFunctionCatalogService
  implements ScientificFunctionCatalogService
{
  private static readonly FUNCTION_DEFINITIONS: readonly ScientificFunctionDefinition[] =
    [
      new ScientificFunctionDefinition(
        "sin",
        "sin",
        "Sine of an angle",
        ScientificFunctionCategory.TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "cos",
        "cos",
        "Cosine of an angle",
        ScientificFunctionCategory.TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "tan",
        "tan",
        "Tangent of an angle",
        ScientificFunctionCategory.TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "asin",
        "asin",
        "Inverse sine",
        ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "acos",
        "acos",
        "Inverse cosine",
        ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "atan",
        "atan",
        "Inverse tangent",
        ScientificFunctionCategory.INVERSE_TRIGONOMETRIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "sinh",
        "sinh",
        "Hyperbolic sine",
        ScientificFunctionCategory.HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "cosh",
        "cosh",
        "Hyperbolic cosine",
        ScientificFunctionCategory.HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "tanh",
        "tanh",
        "Hyperbolic tangent",
        ScientificFunctionCategory.HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "asinh",
        "asinh",
        "Inverse hyperbolic sine",
        ScientificFunctionCategory.INVERSE_HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "acosh",
        "acosh",
        "Inverse hyperbolic cosine",
        ScientificFunctionCategory.INVERSE_HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "atanh",
        "atanh",
        "Inverse hyperbolic tangent",
        ScientificFunctionCategory.INVERSE_HYPERBOLIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "log",
        "log",
        "Common logarithm with a configurable base",
        ScientificFunctionCategory.LOGARITHMIC,
        1,
        2
      ),
      new ScientificFunctionDefinition(
        "log10",
        "log10",
        "Base ten logarithm",
        ScientificFunctionCategory.LOGARITHMIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "log2",
        "log2",
        "Base two logarithm",
        ScientificFunctionCategory.LOGARITHMIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "ln",
        "ln",
        "Natural logarithm",
        ScientificFunctionCategory.LOGARITHMIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "exp",
        "exp",
        "Exponential function",
        ScientificFunctionCategory.LOGARITHMIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "sqrt",
        "sqrt",
        "Square root",
        ScientificFunctionCategory.POWER_AND_ROOT,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "cbrt",
        "cbrt",
        "Cube root",
        ScientificFunctionCategory.POWER_AND_ROOT,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "nthRoot",
        "nthRoot",
        "Nth root of a value",
        ScientificFunctionCategory.POWER_AND_ROOT,
        2,
        2
      ),
      new ScientificFunctionDefinition(
        "square",
        "square",
        "Square of a value",
        ScientificFunctionCategory.POWER_AND_ROOT,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "cube",
        "cube",
        "Cube of a value",
        ScientificFunctionCategory.POWER_AND_ROOT,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "pow",
        "pow",
        "Exponentiation",
        ScientificFunctionCategory.POWER_AND_ROOT,
        2,
        2
      ),
      new ScientificFunctionDefinition(
        "abs",
        "abs",
        "Absolute value",
        ScientificFunctionCategory.ROUNDING,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "sign",
        "sign",
        "Sign of a value",
        ScientificFunctionCategory.ROUNDING,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "floor",
        "floor",
        "Greatest integer less than or equal to a value",
        ScientificFunctionCategory.ROUNDING,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "ceil",
        "ceil",
        "Smallest integer greater than or equal to a value",
        ScientificFunctionCategory.ROUNDING,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "round",
        "round",
        "Rounds a value to a given precision",
        ScientificFunctionCategory.ROUNDING,
        1,
        2
      ),
      new ScientificFunctionDefinition(
        "trunc",
        "trunc",
        "Truncates a value toward zero",
        ScientificFunctionCategory.ROUNDING,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "min",
        "min",
        "Minimum of a list of values",
        ScientificFunctionCategory.ARITHMETIC,
        1,
        999
      ),
      new ScientificFunctionDefinition(
        "max",
        "max",
        "Maximum of a list of values",
        ScientificFunctionCategory.ARITHMETIC,
        1,
        999
      ),
      new ScientificFunctionDefinition(
        "gcd",
        "gcd",
        "Greatest common divisor",
        ScientificFunctionCategory.ARITHMETIC,
        2,
        999
      ),
      new ScientificFunctionDefinition(
        "lcm",
        "lcm",
        "Least common multiple",
        ScientificFunctionCategory.ARITHMETIC,
        2,
        999
      ),
      new ScientificFunctionDefinition(
        "mod",
        "mod",
        "Remainder of a division",
        ScientificFunctionCategory.ARITHMETIC,
        2,
        2
      ),
      new ScientificFunctionDefinition(
        "factorial",
        "factorial",
        "Factorial of an integer",
        ScientificFunctionCategory.ARITHMETIC,
        1,
        1
      ),
      new ScientificFunctionDefinition(
        "percent",
        "percent",
        "Percent of a value",
        ScientificFunctionCategory.ARITHMETIC,
        1,
        1
      ),
    ];

  private readonly functionNames: readonly string[];

  public constructor() {
    this.functionNames = DefaultScientificFunctionCatalogService.FUNCTION_DEFINITIONS.map(
      (definition) => definition.name
    );
  }

  public getAllFunctions(): readonly ScientificFunctionDefinition[] {
    return DefaultScientificFunctionCatalogService.FUNCTION_DEFINITIONS;
  }

  public getFunction(
    functionName: string
  ): ScientificFunctionDefinition | null {
    const definition =
      DefaultScientificFunctionCatalogService.FUNCTION_DEFINITIONS.find(
        (candidate) => candidate.name === functionName
      );

    return definition ?? null;
  }

  public hasFunction(functionName: string): boolean {
    return this.getFunction(functionName) !== null;
  }

  public getFunctionNames(): readonly string[] {
    return this.functionNames;
  }
}
