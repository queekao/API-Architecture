export function union<T>(arrayOrSet1: T[] | Set<T>, arrayOrSet2: T[] | Set<T>): Set<T> {
  const set1 = new Set(arrayOrSet1);
  const set2 = new Set(arrayOrSet2);
  return new Set([...set1, ...set2]);
}

export function intersection<T>(arrayOrSet1: T[] | Set<T>, arrayOrSet2: T[] | Set<T>): Set<T> {
  const set1 = new Set(arrayOrSet1);
  const set2 = new Set(arrayOrSet2);
  return new Set([...set1].filter((x) => set2.has(x)));
}

export function difference<T>(arrayOrSet1: T[] | Set<T>, arrayOrSet2: T[] | Set<T>): Set<T> {
  const set1 = new Set(arrayOrSet1);
  const set2 = new Set(arrayOrSet2);
  return new Set([...set1].filter((x) => !set2.has(x)));
}

/** B 是不是 A 的子集 */
export function isSubSet<T>(arrOrSetA: T[] | Set<T>, arrOrSetB: T[] | Set<T>): boolean {
  const setA = new Set(arrOrSetA);
  return Array.from(arrOrSetB).every((valueB) => setA.has(valueB));
}

/**
 * 找到 B 裡面和 A 不同的其中一個值， undefined 為找不到。
 * 注意，並不包含 A 裡面和 B 不同的值
 */
export function findOneDiff<T>(arrOrSetA: T[] | Set<T>, arrOrSetB: T[] | Set<T>): T | undefined {
  const setA = new Set(arrOrSetA);
  const arrB = Array.from(arrOrSetB);
  for (let i = 0; i < arrB.length; i++) {
    const value = arrB[i];
    if (setA.has(value)) continue;
    return value;
  }
}

/**
 * 找到 B 裡面和 A 不同的所有值
 * 注意，並不包含 A 裡面和 B 不同的值
 */
export function findAllDiff<T>(arrOrSetA: T[] | Set<T>, arrOrSetB: T[] | Set<T>): T[] {
  const setA = new Set(arrOrSetA);
  const arrB = Array.from(arrOrSetB);
  const result: T[] = [];
  for (let i = 0; i < arrB.length; i++) {
    const value = arrB[i];
    if (setA.has(value)) continue;
    result.push(value);
  }
  return result;
}
