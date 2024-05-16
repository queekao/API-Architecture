import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const CharSet = Object.freeze({
  AZ09: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
  Az09: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''),
  AZ: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  az: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  Az: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
  numberOnly: '0123456789'.split(''),
});

export const Formatter = Object.freeze({
  date: (timezone: number = 8, now: Date | dayjs.Dayjs = new Date()) =>
    dayjs(now).utcOffset(timezone).format('YYYYMMDD'),
  dateTime: (timezone: number = 8, now: Date | dayjs.Dayjs = new Date()) =>
    dayjs(now).utcOffset(timezone).format('YYYYMMDDHHmmss'),
});

export function getRandomStr(strList: string[]): string {
  return strList[Math.floor(Math.random() * strList.length) % strList.length];
}

export function randomString(
  length = 6,
  strList: string[] = CharSet.AZ09,
  randomStr: (strList: string[]) => string = getRandomStr,
): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += randomStr(strList);
  }
  return str;
}

export function formatRandomString(formatString: () => string, ...params: Parameters<typeof randomString>): string {
  return formatString() + randomString(...params);
}
