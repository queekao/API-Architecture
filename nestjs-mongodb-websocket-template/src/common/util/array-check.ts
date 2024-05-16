export function removeArrayUndefined<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((value) => value !== undefined) as T[];
}

export function removeArrayNull<T>(arr: (T | null)[]): T[] {
  return arr.filter((value) => value !== null) as T[];
}

export function removeArrayNullOrUndefined<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((value) => value !== null && value !== undefined) as T[];
}
