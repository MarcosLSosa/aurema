/** Une clases y descarta los valores falsy (`false`, `null`, `""`). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}
