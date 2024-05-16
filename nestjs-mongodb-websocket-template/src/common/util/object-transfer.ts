export function keyMapObject<T extends object, K extends keyof T>(
  objList: T[],
  key: K,
): { [key: string]: T | undefined } {
  const keyMapObj: { [K in keyof T]: T } = {} as any;
  for (let i = 0; i < objList.length; i++) {
    const obj = objList[i];
    const keyValue = obj[key];
    if (obj[key] === undefined) throw new Error('object 找無 key 值');
    if (keyMapObj[keyValue as string] !== undefined) throw new Error('object list 中 key 值重複');
    keyMapObj[keyValue as string] = obj;
  }

  return keyMapObj;
}
