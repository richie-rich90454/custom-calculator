export function cssClass(value: string | undefined): string {
  return value ?? "";
}

export function joinClassNames(
  ...values: ReadonlyArray<string | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
