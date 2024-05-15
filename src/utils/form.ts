const endFields = ["_field", "Field"];

export function filterWithObjectKeyOfField(
  value: Record<string, any>
): string[] {
  const keys = Object.keys(value).filter(
    (i) => i.endsWith(endFields[0]) || i.endsWith(endFields[1])
  );
  return keys.map((i) => value[i]);
}
