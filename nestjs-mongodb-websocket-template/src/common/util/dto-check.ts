import { iterate } from 'iterare';
import { ClassConstructor } from 'class-transformer';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { plainToInstance, ClassTransformOptions } from 'class-transformer';
import { validateOrReject, validateSync, ValidatorOptions, ValidationError } from 'class-validator';
import { Except, ReadonlyKeysOf } from 'type-fest';

const logger = new Logger('DTO-check');
export type ExcludeClassReadonly<T> = Except<T, ReadonlyKeysOf<T>>; // remove getter
export type ExcludeClassReadonlyDeep<T> = {
  [K in keyof T as K extends ReadonlyKeysOf<T> ? never : K]: ExcludeClassReadonlyDeep<T[K]>;
};

export type ExcludeClassMethods<T> = { [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K] };
export type ExcludeClassMethodsDeep<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: ExcludeClassMethodsDeep<T[K]>;
};

/** It would remove getter/method, but can't remove setter */
export type PlainObject<T> = ExcludeClassReadonlyDeep<ExcludeClassMethodsDeep<T>>;

export type DtoCheckOption<E extends Error> = {
  transformOption?: ClassTransformOptions | undefined;
  validateOption?: ValidatorOptions | undefined;
  /** message will replace {err} as {@link asErrorMessageList} */
  customError?: E;
};
export type DtoCheckSyncParameter<
  T extends object,
  V extends PlainObject<T> = PlainObject<T>,
  E extends Error = Error,
> = Parameters<typeof dtoCheckSync<T, V, E>>;

export const DEFAULT_TRANSFORM_OPTION: ClassTransformOptions = { excludeExtraneousValues: true };
export const DEFAULT_VALIDATE_OPTION: ValidatorOptions = { strictGroups: true, always: true };
export function toDtoCheckOption<T extends Error>(option: DtoCheckOption<T>): DtoCheckOption<T> {
  if (option === undefined) option = {};
  if (option?.transformOption === undefined) option.transformOption = DEFAULT_TRANSFORM_OPTION;
  if (option?.validateOption === undefined) option.validateOption = DEFAULT_VALIDATE_OPTION;

  return option;
}

/** 會將 DEFAULT_VALIDATE_OPTION 和 DEFAULT_TRANSFORM_OPTION 有填的值但 option 沒填的值填入 option */
export function fillDtoCheckOptionDefault<E extends Error>(option?: DtoCheckOption<E>): DtoCheckOption<E> {
  return {
    ...option,
    validateOption: { ...DEFAULT_VALIDATE_OPTION, ...option?.validateOption },
    transformOption: { ...DEFAULT_TRANSFORM_OPTION, ...option?.transformOption },
  };
}

/** 合併 A B ，若有重複的，則 B 會覆寫 A */
export function mergeDtoCheckOption<E extends Error>(
  optionA?: DtoCheckOption<E>,
  optionB?: DtoCheckOption<E>,
): DtoCheckOption<E> {
  return {
    ...optionA,
    ...optionB,
    transformOption: { ...optionA?.transformOption, ...optionB?.transformOption },
    validateOption: { ...optionA?.validateOption, ...optionB?.transformOption },
  };
}

/**
 * [Enforcing type-safe instance](https://github.com/typestack/class-transformer#enforcing-type-safe-instance)
 * trans value to Class, and call validateOrReject
 */
export async function dtoCheck<T extends object, V extends PlainObject<T>, E extends Error>(
  Class: ClassConstructor<T>,
  value: V,
  option: DtoCheckOption<E> | undefined = {
    transformOption: DEFAULT_TRANSFORM_OPTION,
    validateOption: DEFAULT_VALIDATE_OPTION,
    customError: undefined,
  },
): Promise<T> {
  option = toDtoCheckOption(option);

  const instance = plainToInstance(Class, value, option?.transformOption);
  await validateOrReject(instance, option?.validateOption).catch((errList) => {
    if (option?.customError === undefined) {
      logger.error(Class.name);
      logger.error(errList);
      throw new HttpException('DtoCheck Error', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      throwCustomError(option.customError, errList);
    }
  });
  return instance;
}

/**
 * [Enforcing type-safe instance](https://github.com/typestack/class-transformer#enforcing-type-safe-instance)
 * trans value to Class, and call validateSync
 */
export function dtoCheckSync<T extends object, V extends PlainObject<T>, E extends Error>(
  Class: ClassConstructor<T>,
  value: V,
  option: DtoCheckOption<E> | undefined = {
    transformOption: DEFAULT_TRANSFORM_OPTION,
    validateOption: DEFAULT_VALIDATE_OPTION,
    customError: undefined,
  },
): T {
  option = toDtoCheckOption(option);
  const instance = plainToInstance(Class, value, option?.transformOption);
  const errList = validateSync(instance, option?.validateOption);
  if (errList.length > 0) {
    if (option?.customError === undefined) {
      logger.error(Class.name);
      logger.error(errList);
      throw new HttpException('DtoCheck Error', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      throwCustomError(option.customError, errList);
    }
  }
  return instance;
}

export function throwCustomError<T extends Error>(customError: T, errList: ValidationError[]) {
  const errMessage = asErrorMessageList(errList).join(', ');
  throw replaceCustomErrorMessage(customError, errMessage);
}

/**
 * 警告，此 function 會強制改寫 HttpException 的 response
 */
export function replaceCustomErrorMessage<T extends Error>(customError: T, newMessage: string) {
  customError.message = customError.message.replace('{err}', newMessage);

  // 強制改寫私有屬性
  if (customError instanceof HttpException) {
    const response = (customError as any).response;
    if (typeof response === 'string') {
      (customError as any).response = response.replace('{err}', newMessage);
    }
  }
  return customError;
}

export function asErrorMessageList(validationErrors: ValidationError[]) {
  return iterate(validationErrors)
    .map((error) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints ?? {}))
    .flatten()
    .toArray();
}

function mapChildrenToValidationErrors(error: ValidationError, parentPath?: string): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors: ValidationError[] = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
}

function prependConstraintsWithParentProp(parentPath: string, error: ValidationError): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return { ...error, constraints };
}
