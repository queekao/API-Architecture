import { UseGuards } from '@nestjs/common';
import { CallbackKeyGuard } from '../guard/callback-key.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

export const UseCallbackKey = () => {
  return function <T>(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
    const callbackKeyGuard = UseGuards(CallbackKeyGuard);
    const apiExcludeEndpoint = ApiExcludeEndpoint(true);

    apiExcludeEndpoint(target, key, descriptor);
    callbackKeyGuard(target, key, descriptor);
  };
};
