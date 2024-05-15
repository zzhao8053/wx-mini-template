export function transMainRouterData(value): string[] {
  const pages: any[] = [];
  value.forEach((i) => {
    i.pages.forEach((p) => pages.push(`${i.root}${p}`));
  });
  return pages;
}
