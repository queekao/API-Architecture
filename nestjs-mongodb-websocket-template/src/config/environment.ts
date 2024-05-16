import * as dotenv from 'dotenv';
const parsed = dotenv.config().parsed;

/**
 * 會取代 ${KEY} 為 process.env[KEY]
 * 並明確的寫入 process.env
 */
function replaceEnvVariable(parsed: dotenv.DotenvParseOutput) {
  const keyList = Object.keys(parsed);
  const regex = /(?<=\$\{).*?(?=\})/g;
  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i];
    let value = parsed[key];
    if (value === undefined) continue;

    let matchArray = regex.exec(value);
    while (matchArray !== null) {
      const matchKey = matchArray[0];
      const replaceValue = parsed[matchKey];
      if (matchKey === key) throw Error(`不可自己引用自己 ${matchKey}`);
      if (replaceValue === undefined) throw Error(`找無環境變數 ${matchKey}`);

      value = value.replace(`\$\{${matchKey}\}`, replaceValue);
      parsed[key] = value;

      regex.lastIndex = 0;
      matchArray = regex.exec(value);
    }
    process.env[key] = parsed[key];
  }
}

function checkNeedEnv(keyList: string[]) {
  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i];
    if (process.env[key] === undefined) {
      throw new Error(`請填寫環境變數 ${key}`);
    }
  }
}

replaceEnvVariable(parsed ?? {});
checkNeedEnv(['APP_NAME', 'API_KEY', 'CALLBACK_KEY', 'THIRD_PART_SERVER_TOKEN_AUTH_API']);
export const ENV = {
  APP_NAME: process.env.APP_NAME ?? '[APP NAME]',
  IMAGE_FOLDER_NAME: process.env.IMAGE_FOLDER_NAME ?? 'image',
  URL: {
    EXPORT_HTTP_URL: process.env.EXPORT_HTTP_URL ?? 'http://localhost:3000',
    EXPORT_IMAGE_URL: process.env.EXPORT_IMAGE_URL ?? 'http://localhost:3000/image',
    URL_GLOBAL_PREFIX: process.env.URL_GLOBAL_PREFIX ?? '',
    URL_API_PREFIX: process.env.URL_API_PREFIX ?? '/api',
    URL_SWAGGER: process.env.URL_SWAGGER ?? '/document',
    URL_STATIC: process.env.URL_STATIC ?? '',
  },
  WEB_SOCKET_PORT: 3001,
  DEFAULT_TIMEZONE:
    isNaN(process.env.DEFAULT_TIMEZONE as any) === false ? parseInt(process.env.DEFAULT_TIMEZONE as any) : 8,
  THIRD_PART_SERVER: {
    API: {
      TOKEN_AUTH: process.env.THIRD_PART_SERVER_TOKEN_AUTH_API as string,
    },
  },
};
