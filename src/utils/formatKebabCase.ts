export function formatLowerKebabCase(input: string): string {
  return input.toLowerCase().replace(/_/g, "-");
}

export function formatUpperKebabCase(input: string): string {
  return input.toUpperCase().replace(/-/g, "_");
}
