import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guard/api-key.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/common/enum/api-tag.enum';

export const UseApiKey = () => {
  return function <T>(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
    const apiKeyGuard = UseGuards(ApiKeyGuard);
    const apiBearerAuth = ApiBearerAuth();
    const apiTags = ApiTags(ApiTag.ApiKey);

    apiTags(target, key, descriptor);
    apiBearerAuth(target, key, descriptor);
    apiKeyGuard(target, key, descriptor);
  };
};
