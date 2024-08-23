export const sortArrayByStringProp = <T>(items: T[], key: keyof T): T[] =>
  items.sort((a, b) => a[key].localeCompare(b[key]));