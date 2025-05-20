import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export function encodeData(data: string) {
  const SALT = genSaltSync(parseInt(<string>process.env.DATA_SALT));

  return hashSync(data, SALT);
}

export function compareData(data: string, hash: string) {
  return compareSync(data, hash);
}

export const secondToMilliSeconds = 1000;
export const minuteToMilliSeconds = 60 * secondToMilliSeconds;
export const hourToMilliSeconds = 60 * minuteToMilliSeconds;
export const dayToMilliSeconds = 24 * hourToMilliSeconds;
export const weekToMilliSeconds = 7 * dayToMilliSeconds;

export function timeToMilliSeconds(time: string, delimiter: 'w' | 'd' | 'h' | 'm' | 's') {
  const number = parseInt(time.split(delimiter)[0]);

  switch (delimiter) {
    case 'w':
      return number * weekToMilliSeconds;
    case 'd':
      return number * dayToMilliSeconds;
    case 'h':
      return number * hourToMilliSeconds;
    case 'm':
      return number * minuteToMilliSeconds;
    default:
      return number * secondToMilliSeconds;
  }
}
